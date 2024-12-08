export type NodeId = string | number;

export interface Edge {
  to: NodeId;
  weight: number;
}

export interface Graph {
  nodes: NodeId[];
  edges: Map<NodeId, Edge[]>;
}

export type GraphAlgos = (typeof graphAlgoIds)[number];
export const graphAlgoIds = ['bfs', 'dfs', 'dijkstra'] as const;
export type GraphAlgoLabels = Record<GraphAlgos, string>;
export const graphAlgoLabels: GraphAlgoLabels = {
  bfs: 'Breadth First Search',
  dfs: 'Depth First Search',
  dijkstra: "Dijkstra's Algorithm",
};

export function addNode(graph: Graph, node: NodeId): void {
  if (!graph.edges.has(node)) {
    graph.nodes.push(node);
    graph.edges.set(node, []);
  }
}

export function addEdge(
  graph: Graph,
  from: NodeId,
  to: NodeId,
  weight = 1,
  directed = false
): void {
  const fromNode = graph.edges.get(from);
  const toNode = graph.edges.get(to);

  if (!fromNode) {
    throw new Error(`Node ${from} does not exist in the graph.`);
  }

  if (!toNode) {
    throw new Error(`Node ${to} does not exist in the graph.`);
  }

  fromNode.push({ to, weight });

  if (!directed) {
    toNode.push({ to: from, weight });
  }
}

export function setNodeWeight(
  graph: Graph,
  node: NodeId,
  additionalWeight: number
): void {
  for (const [, edges] of graph.edges.entries()) {
    for (const edge of edges) {
      if (edge.to === node) {
        edge.weight = additionalWeight;
      }
    }
  }
}

export function hasWeightSet(
  graph: Graph,
  node: NodeId,
  defaultWeight = 1
): boolean {
  // Check if any edge points to the given node with a weight > defaultWeight
  for (const [, edges] of graph.edges.entries()) {
    for (const edge of edges) {
      if (edge.to === node && edge.weight > defaultWeight) {
        return true;
      }
    }
  }
  return false;
}

export function getNodesWithWeightsSet(
  graph: Graph,
  defaultWeight = 1
): Set<NodeId> {
  const nodesWithWeightsSet = new Set<NodeId>();

  for (const [, edges] of graph.edges.entries()) {
    for (const edge of edges) {
      if (edge.weight > defaultWeight) {
        nodesWithWeightsSet.add(edge.to);
      }
    }
  }

  return nodesWithWeightsSet;
}

export function resetWeights(graph: Graph, defaultWeight = 1): void {
  for (const [, edges] of graph.edges.entries()) {
    for (const edge of edges) {
      edge.weight = defaultWeight;
    }
  }
}

export function getEdges(graph: Graph, node: NodeId): Edge[] | undefined {
  return graph.edges.get(node);
}

export function print(graph: Graph): string {
  let result = `Nodes: ${graph.nodes.join(', ')}\nEdges:\n`;
  for (const [node, neighbors] of graph.edges.entries()) {
    result += `${node} -> ${neighbors
      .map((edge) => `${edge.to} (weight: ${edge.weight})`)
      .join(', ')}\n`;
  }
  return result.trim();
}

export function bfs(graph: Graph, start: NodeId, end: NodeId): NodeId[] {
  const visited = new Set<NodeId>();
  const queue: NodeId[] = [start];
  const result: NodeId[] = [];

  while (queue.length > 0) {
    const node = queue.shift()!;
    if (!visited.has(node)) {
      visited.add(node);
      result.push(node);

      if (node === end) {
        return result;
      }

      // Push neighbors (ignoring weights in BFS traversal)
      const neighbors = graph.edges.get(node) || [];
      queue.push(
        ...neighbors.map((edge) => edge.to).filter((n) => !visited.has(n))
      );
    }
  }

  return result;
}

export function dfs(
  graph: Graph,
  start: NodeId,
  end: NodeId,
  visited = new Set<NodeId>()
): NodeId[] {
  if (visited.has(start)) return [];
  if (visited.has(end)) return [];

  visited.add(start);
  const result = [start];

  // Traverse neighbors (ignoring weights in DFS traversal)
  const neighbors = graph.edges.get(start) || [];
  for (const edge of neighbors) {
    result.push(...dfs(graph, edge.to, end, visited));
  }

  return result;
}

export function dijkstra(
  graph: Graph,
  start: NodeId,
  end: NodeId
): { distances: Record<NodeId, number>; visitedOrder: NodeId[] } {
  const distances: Record<NodeId, number> = {};
  const visited = new Set<NodeId>();
  const visitedOrder: NodeId[] = [];
  const priorityQueue: { node: NodeId; distance: number }[] = [];

  // Initialize distances
  for (const node of graph.nodes) {
    distances[node] = Infinity;
  }
  distances[start] = 0;

  // Add the starting node to the queue
  priorityQueue.push({ node: start, distance: 0 });

  while (priorityQueue.length > 0) {
    // Sort queue by distance and pick the closest node
    priorityQueue.sort((a, b) => a.distance - b.distance);
    const { node } = priorityQueue.shift()!;

    if (visited.has(node)) continue;

    // Mark node as visited
    visited.add(node);
    visitedOrder.push(node);

    // Stop if the end node is reached
    if (node === end) {
      break;
    }

    // Update distances for edges
    const edges = graph.edges.get(node) || [];
    for (const edge of edges) {
      const newDist = distances[node] + edge.weight;
      if (newDist < distances[edge.to]) {
        distances[edge.to] = newDist;
        priorityQueue.push({ node: edge.to, distance: newDist });
      }
    }
  }

  return { distances, visitedOrder };
}

export function buildGridGraph(rows = 5, cols = 5): Graph {
  const g: Graph = { nodes: [], edges: new Map() };

  // Add nodes to the graph
  for (let i = 0; i < rows * cols; i++) {
    addNode(g, i);
  }

  // Add edges to the graph
  for (let i = 0; i < rows * cols; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;

    // Add left neighbor
    if (col > 0) {
      addEdge(g, i, i - 1);
    }

    // Add right neighbor
    if (col < cols - 1) {
      addEdge(g, i, i + 1);
    }

    // Add top neighbor
    if (row > 0) {
      addEdge(g, i, i - cols);
    }

    // Add bottom neighbor
    if (row < rows - 1) {
      addEdge(g, i, i + cols);
    }
  }

  return g;
}
