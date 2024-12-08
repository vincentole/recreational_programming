import { Component, computed, effect, inject, signal } from '@angular/core';
import {
  bfs,
  buildGridGraph,
  dfs,
  Graph,
  graphAlgoLabels,
  graphAlgoIds,
  GraphAlgos,
  NodeId,
  dijkstra,
  setNodeWeight,
  hasWeightSet,
  getNodesWithWeightsSet,
  resetWeights,
} from './graph';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NotificationService as NotificationService } from '../notification/notification.service';
import { NgClass } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

type NodeStyles = { [key: NodeId]: string };

@Component({
  selector: 'app-graph',
  imports: [ReactiveFormsModule, NgClass],
  template: `
    <div class="py-4 max-w-sm m-auto flex gap-4">
      <select
        name="algo"
        id="algo"
        [formControl]="selectedAlgo"
        class="rounded-md border border-gray-200 disabled:bg-gray-100"
      >
        @for (id of graphAlgoIds; track id) {
        <option [value]="id">{{ graphAlgoLabels[id] }}</option>
        }
      </select>
      <button
        (click)="animateAlgo()"
        [disabled]="animationState() === 'running'"
        class="rounded-md border border-gray-200 px-2 hover:bg-gray-100 active:bg-gray-300 transition-all disabled:bg-gray-100"
      >
        Start
      </button>
      <button
        (click)="reset()"
        [disabled]="animationState() === 'running'"
        class="rounded-md border border-gray-200 px-2 hover:bg-gray-100 active:bg-gray-300 transition-all disabled:bg-gray-100"
      >
        Reset
      </button>
    </div>

    <div class="grid grid-cols-5 gap-2 max-w-sm m-auto">
      @for (nodeId of graph.nodes; track nodeId; let index = $index) {
      <button
        (click)="setStartEndWeight(index)"
        [ngClass]="[
          nodeAnimationStyles[nodeId],
          index === startNode() ? 'bg-green-200' : '',
          index === endNode() ? 'bg-red-200' : '',
          index !== startNode() && index !== endNode() ? nodeHoverClass() : '',
          nodesWithWeight().has(index) ? 'bg-gray-400' : '',
          'text-center transition-all duration-200 aspect-square flex items-center justify-center border border-gray-500 rounded-sm'
        ]"
      ></button>
      }
    </div>
  `,
})
export class GraphComponent {
  notificationService = inject(NotificationService);

  graph: Graph = buildGridGraph();

  nodeAnimationStyles = this.initNodeStyles();

  selectedAlgo = new FormControl<GraphAlgos>('bfs');
  selectedAlgoValueChanges = toSignal(this.selectedAlgo.valueChanges);

  graphAlgoIds = graphAlgoIds;
  graphAlgoLabels = graphAlgoLabels;

  startNode = signal<NodeId | null>(null);
  endNode = signal<NodeId | null>(null);
  nodesWithWeight = signal<Set<NodeId>>(new Set());

  animationState = signal<'ready' | 'running' | 'done'>('ready');

  nodeHoverClass = computed(() => {
    if (!this.startNode()) {
      return 'hover:bg-green-200';
    } else if (!this.endNode()) {
      return 'hover:bg-red-200';
    } else if (this.selectedAlgo.value === 'dijkstra') {
      return 'hover:bg-gray-400';
    }

    return '';
  });

  constructor() {
    effect(() => {
      this.selectedAlgoValueChanges();
      this.reset();
    });

    effect(() => {
      if (this.animationState() === 'running') {
        this.selectedAlgo.disable();
      } else {
        this.selectedAlgo.enable();
      }
    });
  }

  initNodeStyles(): NodeStyles {
    const nodeStyles: NodeStyles = {};

    this.graph.nodes.forEach((nodeId) => {
      nodeStyles[nodeId] = '';
    });

    return nodeStyles;
  }

  reset() {
    this.startNode.set(null);
    this.endNode.set(null);
    this.nodeAnimationStyles = this.initNodeStyles();
    this.animationState.set('ready');

    resetWeights(this.graph);
    this.nodesWithWeight.set(getNodesWithWeightsSet(this.graph));
  }

  setStartEndWeight(index: number) {
    if (!this.startNode()) {
      this.startNode.set(index);
    } else if (!this.endNode()) {
      this.endNode.set(index);
    } else if (this.selectedAlgo.value === 'dijkstra') {
      this.toggleWeight(index);
    }
  }

  toggleWeight(nodeId: number) {
    if (hasWeightSet(this.graph, nodeId)) {
      setNodeWeight(this.graph, nodeId, 1);
    } else {
      setNodeWeight(this.graph, nodeId, 9999);
    }

    this.nodesWithWeight.set(getNodesWithWeightsSet(this.graph));
  }

  animateAlgo() {
    switch (this.animationState()) {
      case 'running':
        this.notificationService.sendInfo(
          'An animation is already running. Please wait for it to finish and reset to start a new one.'
        );
        return;
      case 'done':
        this.notificationService.sendInfo(
          'Please reset the previous animation before staring a new one.'
        );
        return;
    }

    const startNode = this.startNode();
    const endNode = this.endNode();

    if (!startNode || !endNode) {
      this.notificationService.sendInfo('A start and end node have to be set.');
      return;
    }

    switch (this.selectedAlgo.value) {
      case 'bfs':
        {
          const nodes = bfs(this.graph, startNode, endNode);
          this.animateNodes(nodes);
        }
        break;
      case 'dfs':
        {
          const nodes = dfs(this.graph, startNode, endNode);
          this.animateNodes(nodes);
        }
        break;
      case 'dijkstra':
        const nodes = dijkstra(this.graph, startNode, endNode).visitedOrder;
        this.animateNodes(nodes);
        break;
      default:
        this.notificationService.sendError('Unknown algorithm selected.');
    }
  }

  animateNodes(nodeIds: NodeId[]) {
    this.animationState.set('running');
    const animationDuration = 400;
    const overlap = 300;

    nodeIds.forEach((nodeId, index) => {
      const delay = index * (animationDuration - overlap);
      const startBgClass = 'bg-purple-300';
      const endBgClass = 'bg-purple-300';

      if (nodeId !== this.startNode() && nodeId !== this.endNode()) {
        setTimeout(() => {
          this.nodeAnimationStyles[nodeId] = startBgClass;

          setTimeout(() => {
            this.nodeAnimationStyles[nodeId] = endBgClass;

            if (index === nodeIds.length - 2) {
              this.animationState.set('done');
            }
          }, animationDuration);
        }, delay);
      }
    });
  }
}
