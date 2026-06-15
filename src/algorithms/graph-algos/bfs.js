/**
 * Breadth-First Search — step-by-step execution
 */
export class BFS {
  constructor(graph, sourceId = 0) {
    this.graph = graph;
    this.sourceId = sourceId;
    this.visited = new Set();
    this.queue = [sourceId];
    this.visitOrder = [];
    this.currentNode = null;
    this.traversedEdges = [];
    this.done = false;
    this.steps = 0;
    this.parent = new Map();

    this.visited.add(sourceId);
  }

  step() {
    if (this.done) return;
    this.steps++;

    if (this.queue.length === 0) {
      this.done = true;
      this.currentNode = null;
      return;
    }

    const current = this.queue.shift();
    this.currentNode = current;
    this.visitOrder.push(current);

    const neighbors = this.graph.getNeighbors(current);
    for (const { node: neighborId } of neighbors) {
      if (!this.visited.has(neighborId)) {
        this.visited.add(neighborId);
        this.queue.push(neighborId);
        this.parent.set(neighborId, current);
        this.traversedEdges.push({ from: current, to: neighborId });
      }
    }

    if (this.queue.length === 0) {
      this.done = true;
    }
  }

  isDone() { return this.done; }
  
  getVisited() { return this.visited; }
  
  getCurrentNode() { return this.currentNode; }
  
  getVisitOrder() { return this.visitOrder; }
  
  getTraversedEdges() { return this.traversedEdges; }
  
  getQueue() { return [...this.queue]; }

  getMetrics() {
    return {
      steps: this.steps,
      visited: this.visited.size,
      total: this.graph.nodeCount,
      queueSize: this.queue.length,
    };
  }
}
