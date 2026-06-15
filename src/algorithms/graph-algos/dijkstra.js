/**
 * Dijkstra's Algorithm — step-by-step execution
 * Finds shortest path from source to all other nodes
 */
export class Dijkstra {
  constructor(graph, sourceId = 0) {
    this.graph = graph;
    this.sourceId = sourceId;
    this.distances = new Map();
    this.previous = new Map();
    this.visited = new Set();
    this.queue = []; // priority queue (sorted array)
    this.currentNode = null;
    this.currentNeighbor = null;
    this.done = false;
    this.steps = 0;
    this.pathEdges = []; // edges in shortest path tree

    // Initialize
    for (const node of graph.nodes) {
      this.distances.set(node.id, Infinity);
      this.previous.set(node.id, null);
    }
    this.distances.set(sourceId, 0);
    this.queue.push({ id: sourceId, dist: 0 });
  }

  step() {
    if (this.done) return;
    this.steps++;

    if (this.queue.length === 0) {
      this.done = true;
      this._buildPathEdges();
      return;
    }

    // Sort by distance (min heap simulation)
    this.queue.sort((a, b) => a.dist - b.dist);
    const current = this.queue.shift();
    
    if (this.visited.has(current.id)) {
      return; // Skip already processed
    }

    this.currentNode = current.id;
    this.visited.add(current.id);

    const neighbors = this.graph.getNeighbors(current.id);
    for (const { node: neighborId, weight } of neighbors) {
      if (!this.visited.has(neighborId)) {
        const newDist = this.distances.get(current.id) + weight;
        if (newDist < this.distances.get(neighborId)) {
          this.distances.set(neighborId, newDist);
          this.previous.set(neighborId, current.id);
          this.queue.push({ id: neighborId, dist: newDist });
        }
      }
    }

    // Check if all reachable nodes are visited
    if (this.queue.length === 0 || this.queue.every(q => this.visited.has(q.id))) {
      this.done = true;
      this._buildPathEdges();
    }
  }

  _buildPathEdges() {
    this.pathEdges = [];
    for (const [nodeId, prevId] of this.previous) {
      if (prevId !== null) {
        this.pathEdges.push({ from: prevId, to: nodeId });
      }
    }
  }

  isDone() { return this.done; }
  
  getVisited() { return this.visited; }
  
  getCurrentNode() { return this.currentNode; }
  
  getDistances() { return this.distances; }
  
  getPathEdges() { return this.pathEdges; }

  getShortestPath(targetId) {
    const path = [];
    let current = targetId;
    while (current !== null) {
      path.unshift(current);
      current = this.previous.get(current);
    }
    return path[0] === this.sourceId ? path : [];
  }

  getMetrics() {
    return {
      steps: this.steps,
      visited: this.visited.size,
      total: this.graph.nodeCount,
    };
  }
}