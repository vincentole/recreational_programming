import { Component, OnInit } from '@angular/core';
import { addEdge, addNode, Graph, print } from './graph';

@Component({
  selector: 'app-graph',

  template: ` <div class="text-blue-700">Graph</div> `,
})
export class GraphComponent implements OnInit {
  graph: Graph = { nodes: [], edges: new Map() };

  ngOnInit(): void {
    const g = this.graph;

    addNode(g, 'A');
    addNode(g, 'B');
    addNode(g, 'C');

    addEdge(g, 'A', 'B', 1);
    addEdge(g, 'A', 'C', 1);
    addEdge(g, 'C', 'B', 1);

    console.log(print(g));
  }
}
