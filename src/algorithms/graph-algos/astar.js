/**
 * A* Search Algorithm — step-by-step execution
 * Finds shortest path from source to target using a heuristic (Euclidean distance)
 */
export class AStar {
  constructor(graph, sourceId = 0, targetId = 4) {
    this.graph = graph;
    this.sourceId = sourceId;
    this.targetId = targetId;
    this.distances = new Map(); // g-score
    this.fScores = new Map();   // f-score (g + h)
    this.previous = new Map();
    this.visited = new Set();
    this.queue = []; // priority queue based on f-score
    this.currentNode = null;
    this.done = false;
    this.steps = 0;
    this.pathEdges = []; // edges in shortest path tree

    this.targetNode = graph.nodes.find(n => n.id === targetId);

    // Initialize
    for (const node of graph.nodes) {
      this.distances.set(node.id, Infinity);
      this.fScores.set(node.id, Infinity);
      this.previous.set(node.id, null);
    }
    
    this.distances.set(sourceId, 0);
    this.fScores.set(sourceId, this._heuristic(sourceId));
    this.queue.push({ id: sourceId, f: this.fScores.get(sourceId) });
  }

  _heuristic(nodeId) {
    if (!this.targetNode) return 0;
    const node = this.graph.nodes.find(n => n.id === nodeId);
    if (!node) return 0;
    
    // Euclidean distance
    const dx = node.x - this.targetNode.x;
    const dy = node.y - this.targetNode.y;
    // We scale it down slightly so it's admissible
    return Math.sqrt(dx * dx + dy * dy) * 0.05; 
  }

  step() {
    if (this.done) return;
    this.steps++;

    if (this.queue.length === 0) {
      this.done = true;
      this._buildPathEdges();
      return;
    }

    // Sort by f-score (min heap simulation)
    this.queue.sort((a, b) => a.f - b.f);
    const current = this.queue.shift();
    
    if (this.visited.has(current.id)) {
      return; // Skip already processed
    }

    this.currentNode = current.id;
    this.visited.add(current.id);

    if (current.id === this.targetId) {
      this.done = true;
      this._buildPathEdges();
      return;
    }

    const neighbors = this.graph.getNeighbors(current.id);
    for (const { node: neighborId, weight } of neighbors) {
      if (!this.visited.has(neighborId)) {
        const tentativeG = this.distances.get(current.id) + weight;
        
        if (tentativeG < this.distances.get(neighborId)) {
          this.previous.set(neighborId, current.id);
          this.distances.set(neighborId, tentativeG);
          
          const fScore = tentativeG + this._heuristic(neighborId);
          this.fScores.set(neighborId, fScore);
          
          // Add to queue or update
          const qIndex = this.queue.findIndex(q => q.id === neighborId);
          if (qIndex !== -1) {
             this.queue[qIndex].f = fScore;
          } else {
             this.queue.push({ id: neighborId, f: fScore });
          }
        }
      }
    }

    // Check if all reachable nodes are visited
    if (this.queue.length === 0) {
      this.done = true;
      this._buildPathEdges();
    }
  }

  _buildPathEdges() {
    this.pathEdges = [];
    let current = this.targetId;
    
    // If target was never reached, show the tree built so far
    if (this.previous.get(this.targetId) === null && this.targetId !== this.sourceId) {
      for (const [nodeId, prevId] of this.previous) {
        if (prevId !== null) {
          this.pathEdges.push({ from: prevId, to: nodeId });
        }
      }
      return;
    }

    // Highlight the specific path to target
    while (current !== null && current !== this.sourceId) {
      const prev = this.previous.get(current);
      if (prev !== null) {
        this.pathEdges.push({ from: prev, to: current });
      }
      current = prev;
    }
  }

  isDone() { return this.done; }
  getVisited() { return this.visited; }
  getCurrentNode() { return this.currentNode; }
  getDistances() { return this.distances; }
  getPathEdges() { return this.pathEdges; }

  getMetrics() {
    return {
      steps: this.steps,
      visited: this.visited.size,
      total: this.graph.nodeCount,
    };
  }
}
