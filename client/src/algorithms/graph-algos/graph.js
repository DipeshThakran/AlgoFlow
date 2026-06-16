/**
 * Graph class — shared by all graph algorithms
 * Generates a random weighted undirected graph
 */
export class Graph {
  constructor(nodeCount = 8) {
    this.nodeCount = nodeCount;
    this.nodes = [];
    this.edges = [];
    this.adjacencyList = new Map();
    this.generate();
  }

  generate() {
    this.nodes = [];
    this.edges = [];
    this.adjacencyList = new Map();

    // The classic 9-node textbook graph example (often used for Dijkstra)
    this.nodeCount = 9;
    
    // Hardcoded nice planar layout for 1000x500 canvas
    const positions = [
      { id: 0, x: 150, y: 250 },
      { id: 1, x: 320, y: 120 },
      { id: 2, x: 500, y: 120 },
      { id: 3, x: 680, y: 120 },
      { id: 4, x: 850, y: 250 },
      { id: 5, x: 680, y: 380 },
      { id: 6, x: 500, y: 380 },
      { id: 7, x: 320, y: 380 },
      { id: 8, x: 500, y: 250 }
    ];

    for (let pos of positions) {
      this.nodes.push({ ...pos, label: String(pos.id) });
      this.adjacencyList.set(pos.id, []);
    }

    // Classic textbook edges and weights
    const edgeData = [
      [0, 1, 4], [0, 7, 8],
      [1, 2, 8], [1, 7, 11],
      [2, 3, 7], [2, 8, 2], [2, 5, 4],
      [3, 4, 9], [3, 5, 14],
      [4, 5, 10],
      [5, 6, 2],
      [6, 7, 1], [6, 8, 6],
      [7, 8, 7]
    ];

    for (let edge of edgeData) {
      this._addEdge(edge[0], edge[1], edge[2]);
    }
  }

  _addEdge(a, b, weight) {
    this.edges.push({ from: a, to: b, weight });
    this.adjacencyList.get(a).push({ node: b, weight });
    this.adjacencyList.get(b).push({ node: a, weight });
  }

  _hasEdge(a, b) {
    return this.edges.some(
      e => (e.from === a && e.to === b) || (e.from === b && e.to === a)
    );
  }

  getNeighbors(nodeId) {
    return this.adjacencyList.get(nodeId) || [];
  }
}
