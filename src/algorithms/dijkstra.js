export default function sketch(p) {
  let nodes = [];
  let edges = [];
  let openSet = [];
  let visited = [];
  let source, target;

  const nodeCount = 8;
  let speed = 100;

  p.setup = function () {
    p.createCanvas(800, 600); // extra width for sidebar
    nodes = [];
    edges = [];
    openSet = [];
    visited = [];

    // Create nodes with random positions
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Node(i, p.random(100, 500), p.random(100, 500)));
    }

    // Randomly connect nodes
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (p.random(1) < 0.4) {
          let weight = p.floor(p.random(1, 10));
          edges.push(new Edge(nodes[i], nodes[j], weight));
          nodes[i].neighbors.push({ node: nodes[j], weight });
          nodes[j].neighbors.push({ node: nodes[i], weight });
        }
      }
    }

    source = nodes[0];
    target = nodes[nodeCount - 1];
    source.dist = 0;
    openSet.push(source);
  };

  p.draw = function () {
    if (p.frameCount % speed !== 0) return;

    p.background(255);

    // Draw edges
    for (let edge of edges) {
      edge.show();
    }

    // Dijkstra's algorithm step
    if (openSet.length > 0) {
      openSet.sort((a, b) => a.dist - b.dist);
      let current = openSet.shift();

      visited.push(current);

      if (current === target) {
        console.log("Target reached");
        p.noLoop();
      }

      for (let neighborObj of current.neighbors) {
        let neighbor = neighborObj.node;
        let weight = neighborObj.weight;
        let tempDist = current.dist + weight;

        if (tempDist < neighbor.dist) {
          neighbor.dist = tempDist;
          neighbor.prev = current;
          if (!visited.includes(neighbor) && !openSet.includes(neighbor)) {
            openSet.push(neighbor);
          }
        }
      }
    } else {
      console.log("No path found");
      p.noLoop();
    }

    // Draw visited nodes
    for (let node of visited) {
      node.show(p.color(255, 100, 100));
    }

    // Draw nodes in openSet
    for (let node of openSet) {
      node.show(p.color(100, 255, 100));
    }

    // Draw all other nodes
    for (let node of nodes) {
      if (!openSet.includes(node) && !visited.includes(node)) {
        node.show(p.color(220));
      }
    }

    // Draw shortest path
    let path = [];
    let temp = target;
    while (temp) {
      path.push(temp);
      temp = temp.prev;
    }
    for (let i = 0; i < path.length - 1; i++) {
      p.strokeWeight(4);
      p.stroke(0, 0, 255);
      p.line(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y);
    }

    // Draw Priority Queue (openSet)
    p.noStroke();
    p.fill(0);
    p.textSize(14);
    p.textAlign(p.LEFT);
    p.text("Priority Queue (openSet):", 620, 30);
    for (let i = 0; i < openSet.length; i++) {
      const n = openSet[i];
      p.fill(230);
      p.stroke(0);
      p.rect(620, 50 + i * 35, 160, 30);
      p.fill(0);
      p.noStroke();
      p.text(`Node ${n.id} (dist=${n.dist})`, 630, 50 + i * 35 + 20);
    }

    // Draw Visited Nodes (closedSet)
    p.text("Visited Nodes:", 620, 300);
    for (let i = 0; i < visited.length; i++) {
      const n = visited[i];
      p.fill(255, 220, 220);
      p.stroke(0);
      p.rect(620, 320 + i * 30, 160, 25);
      p.fill(0);
      p.noStroke();
      p.text(`Node ${n.id}`, 630, 320 + i * 30 + 17);
    }
  };

  class Node {
    constructor(id, x, y) {
      this.id = id;
      this.x = x;
      this.y = y;
      this.dist = Infinity;
      this.prev = null;
      this.neighbors = [];
    }

    show(col) {
      p.fill(col);
      p.stroke(0);
      p.strokeWeight(1);
      p.ellipse(this.x, this.y, 30);
      p.fill(0);
      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.text(this.id, this.x, this.y);
    }
  }

  class Edge {
    constructor(a, b, weight) {
      this.a = a;
      this.b = b;
      this.weight = weight;
    }

    show() {
      p.stroke(150);
      p.strokeWeight(1);
      p.line(this.a.x, this.a.y, this.b.x, this.b.y);

      // show weight at midpoint
      const midX = (this.a.x + this.b.x) / 2;
      const midY = (this.a.y + this.b.y) / 2;
      p.fill(0);
      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.text(this.weight, midX, midY);
    }
  }
}