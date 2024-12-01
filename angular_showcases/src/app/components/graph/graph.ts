export type NodeId = string | number;

export interface Edge {
  to: NodeId;
  weight: number;
}

export interface Graph {
  nodes: NodeId[];
  edges: Map<NodeId, Edge[]>;
}

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
  weight: number,
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

export function getNeighbors(graph: Graph, node: NodeId): Edge[] | undefined {
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

export function bfs(graph: Graph, start: NodeId): NodeId[] {
  const visited = new Set<NodeId>();
  const queue: NodeId[] = [start];
  const result: NodeId[] = [];

  while (queue.length > 0) {
    const node = queue.shift()!;
    if (!visited.has(node)) {
      visited.add(node);
      result.push(node);

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
  visited = new Set<NodeId>()
): NodeId[] {
  if (visited.has(start)) return [];

  visited.add(start);
  const result = [start];

  // Traverse neighbors (ignoring weights in DFS traversal)
  const neighbors = graph.edges.get(start) || [];
  for (const edge of neighbors) {
    result.push(...dfs(graph, edge.to, visited));
  }

  return result;
}

export function dijkstra(graph: Graph, start: NodeId): Record<NodeId, number> {
  const distances: Record<NodeId, number> = {};
  const visited = new Set<NodeId>();
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
    visited.add(node);

    // Update distances for neighbors
    const neighbors = graph.edges.get(node) || [];
    for (const edge of neighbors) {
      const newDist = distances[node] + edge.weight;
      if (newDist < distances[edge.to]) {
        distances[edge.to] = newDist;
        priorityQueue.push({ node: edge.to, distance: newDist });
      }
    }
  }

  return distances;
}
