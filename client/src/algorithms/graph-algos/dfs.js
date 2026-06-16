/**
 * Depth-First Search — step-by-step execution
 */
export class DFS {
  constructor(graph, sourceId = 0) {
    this.graph = graph;
    this.sourceId = sourceId;
    this.visited = new Set();
    this.stack = [sourceId];
    this.visitOrder = [];
    this.currentNode = null;
    this.traversedEdges = [];
    this.done = false;
    this.steps = 0;
    this.parent = new Map();
  }

  step() {
    if (this.done) return;
    this.steps++;

    if (this.stack.length === 0) {
      this.done = true;
      this.currentNode = null;
      return;
    }

    const current = this.stack.pop();
    
    if (this.visited.has(current)) {
      // Skip already visited, try next
      if (this.stack.length === 0) {
        this.done = true;
      }
      return;
    }

    this.visited.add(current);
    this.currentNode = current;
    this.visitOrder.push(current);

    // Add edge from parent
    if (this.parent.has(current)) {
      this.traversedEdges.push({ from: this.parent.get(current), to: current });
    }

    const neighbors = this.graph.getNeighbors(current);
    // Push in reverse to maintain left-to-right DFS order
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const neighborId = neighbors[i].node;
      if (!this.visited.has(neighborId)) {
        this.stack.push(neighborId);
        if (!this.parent.has(neighborId)) {
          this.parent.set(neighborId, current);
        }
      }
    }

    if (this.stack.length === 0) {
      this.done = true;
    }
  }

  isDone() { return this.done; }
  
  getVisited() { return this.visited; }
  
  getCurrentNode() { return this.currentNode; }
  
  getVisitOrder() { return this.visitOrder; }
  
  getTraversedEdges() { return this.traversedEdges; }
  
  getStack() { return [...this.stack]; }

  getMetrics() {
    return {
      steps: this.steps,
      visited: this.visited.size,
      total: this.graph.nodeCount,
      stackSize: this.stack.length,
    };
  }
}
