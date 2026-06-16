/**
 * Prim's Algorithm — step-by-step execution
 * Finds Minimum Spanning Tree for a weighted undirected graph
 */
export class Prims {
  constructor(graph, startId = 0) {
    this.graph = graph;
    this.startId = startId;
    this.distances = new Map(); // min weight edge connecting to MST
    this.previous = new Map(); // tracks the MST structure
    this.visited = new Set(); // nodes currently in the MST
    this.queue = []; // priority queue based on edge weight
    this.currentNode = null;
    this.done = false;
    this.steps = 0;
    this.pathEdges = []; // edges forming the MST

    // Initialize
    for (const node of graph.nodes) {
      this.distances.set(node.id, Infinity);
      this.previous.set(node.id, null);
    }
    
    this.distances.set(startId, 0);
    this.queue.push({ id: startId, dist: 0 });
  }

  step() {
    if (this.done) return;
    this.steps++;

    if (this.queue.length === 0 || this.visited.size === this.graph.nodeCount) {
      this.done = true;
      this._buildPathEdges();
      return;
    }

    // Sort by edge weight (min heap simulation)
    this.queue.sort((a, b) => a.dist - b.dist);
    const current = this.queue.shift();
    
    if (this.visited.has(current.id)) {
      return; // Skip already processed
    }

    this.currentNode = current.id;
    this.visited.add(current.id);

    // Dynamically build path edges as we add to MST
    this._buildPathEdges();

    const neighbors = this.graph.getNeighbors(current.id);
    for (const { node: neighborId, weight } of neighbors) {
      if (!this.visited.has(neighborId)) {
        if (weight < this.distances.get(neighborId)) {
          this.distances.set(neighborId, weight);
          this.previous.set(neighborId, current.id);
          
          // Add to queue or update
          const qIndex = this.queue.findIndex(q => q.id === neighborId);
          if (qIndex !== -1) {
             this.queue[qIndex].dist = weight;
          } else {
             this.queue.push({ id: neighborId, dist: weight });
          }
        }
      }
    }

    if (this.queue.length === 0 || this.visited.size === this.graph.nodeCount) {
      this.done = true;
      this._buildPathEdges();
    }
  }

  _buildPathEdges() {
    this.pathEdges = [];
    for (const [nodeId, prevId] of this.previous) {
      if (prevId !== null && this.visited.has(nodeId)) {
        this.pathEdges.push({ from: prevId, to: nodeId });
      }
    }
  }

  isDone() { return this.done; }
  getVisited() { return this.visited; }
  getCurrentNode() { return this.currentNode; }
  getDistances() { return this.distances; } // Returns edge weights
  getPathEdges() { return this.pathEdges; }

  getMetrics() {
    return {
      steps: this.steps,
      visited: this.visited.size,
      total: this.graph.nodeCount,
    };
  }
}
