/**
 * Universal p5.js sketch for graph algorithms
 * Dark-themed with animated node/edge highlighting
 */
import { audioSystem } from '../utils/audioSystem';
export const graphSketch = (p) => {
  let graph = null;
  let algorithm = null;
  let isRunning = false;
  let speed = 5;
  let frameCounter = 0;
  let cw = 800;
  let ch = 450;

  p.updateWithProps = (props) => {
    if (props.graph) graph = props.graph;
    if (props.algorithm) algorithm = props.algorithm;
    if (typeof props.isRunning !== 'undefined') {
      isRunning = props.isRunning;
      if (isRunning) p.loop();
      else { p.noLoop(); p.redraw(); }
    }
    if (props.speed !== undefined) {
      speed = props.speed;
    }
    if (props.width && props.height) {
      cw = props.width;
      ch = props.height;
      p.resizeCanvas(cw, ch);
    }
  };

  p.setup = () => {
    p.createCanvas(cw, ch);
    p.textFont('Inter, sans-serif');
    p.noLoop();
  };

  p.draw = () => {
    p.background(10, 10, 20);

    p.push();
    // Calculate scale factor based on width to fit 1000px content inside cw
    const scaleFactor = Math.min(1, cw / 1000);
    
    // Center it horizontally if scaled down
    if (scaleFactor < 1) {
      const scaledWidth = 1000 * scaleFactor;
      p.translate((cw - scaledWidth) / 2, 0);
    }
    
    p.scale(scaleFactor);

    if (!graph) {
      p.fill(100);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(16 / scaleFactor);
      p.text('Click "Start" to generate a graph', 500, ch / 2 / scaleFactor);
      p.pop();
      return;
    }

    // Step algorithm at controlled speed
    frameCounter++;
    const stepInterval = Math.max(1, Math.floor(30 / speed));
    
    // We need to know if a new node was visited to play a sound
    const prevVisitedCount = algorithm && algorithm.getVisited ? algorithm.getVisited().size : 0;
    
    if (isRunning && algorithm && !algorithm.isDone() && frameCounter % stepInterval === 0) {
      algorithm.step();
      
      const newVisitedCount = algorithm.getVisited ? algorithm.getVisited().size : 0;
      if (newVisitedCount > prevVisitedCount) {
        audioSystem.playNodeVisitTone();
      } else if (algorithm.getTraversedEdges && algorithm.getTraversedEdges().length > 0) {
         // Play a softer tone for edge traversal if no new node visited
         audioSystem.playEdgeTone();
      }
    }

    const visited = algorithm ? algorithm.getVisited() : new Set();
    const currentNode = algorithm ? algorithm.getCurrentNode() : null;
    const traversedEdges = algorithm && algorithm.getTraversedEdges 
      ? algorithm.getTraversedEdges() 
      : [];
    const pathEdges = algorithm && algorithm.getPathEdges 
      ? algorithm.getPathEdges() 
      : [];

    // Draw edges
    for (const edge of graph.edges) {
      const nodeA = graph.nodes[edge.from];
      const nodeB = graph.nodes[edge.to];
      
      // Check if edge is traversed
      const isTraversed = traversedEdges.some(
        e => (e.from === edge.from && e.to === edge.to) || (e.from === edge.to && e.to === edge.from)
      );
      const isPath = pathEdges.some(
        e => (e.from === edge.from && e.to === edge.to) || (e.from === edge.to && e.to === edge.from)
      );

      if (isPath) {
        p.stroke(139, 92, 246);
        p.strokeWeight(3);
      } else if (isTraversed) {
        p.stroke(59, 130, 246, 180);
        p.strokeWeight(2.5);
      } else {
        p.stroke(60, 60, 80);
        p.strokeWeight(1);
      }
      p.line(nodeA.x, nodeA.y, nodeB.x, nodeB.y);

      // Draw weight
      const midX = (nodeA.x + nodeB.x) / 2;
      const midY = (nodeA.y + nodeB.y) / 2;
      p.noStroke();
      p.fill(100, 100, 120);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(11);
      p.text(edge.weight, midX, midY - 8);
    }

    // Draw nodes
    for (const node of graph.nodes) {
      const isVisited = visited.has(node.id);
      const isCurrent = currentNode === node.id;
      const isSource = node.id === 0;

      let fillColor;
      let nodeRadius = 22;
      
      if (isCurrent) {
        fillColor = [239, 68, 68]; // red — active
        nodeRadius = 26;
      } else if (isSource) {
        fillColor = [139, 92, 246]; // purple — source
      } else if (isVisited) {
        fillColor = [34, 197, 94]; // green — visited
      } else {
        fillColor = [45, 45, 65]; // dark gray — unvisited
      }

      // Glow effect for current node
      if (isCurrent) {
        p.noStroke();
        p.fill(239, 68, 68, 30);
        p.ellipse(node.x, node.y, nodeRadius * 3);
        p.fill(239, 68, 68, 15);
        p.ellipse(node.x, node.y, nodeRadius * 4);
      }

      // Node circle
      p.fill(...fillColor);
      p.stroke(255, 255, 255, 30);
      p.strokeWeight(1);
      p.ellipse(node.x, node.y, nodeRadius * 2);

      // Node label
      p.noStroke();
      p.fill(255);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(14);
      p.textStyle(p.BOLD);
      p.text(node.id, node.x, node.y);
      p.textStyle(p.NORMAL);

      // Show distance for Dijkstra
      if (algorithm && algorithm.getDistances) {
        const dist = algorithm.getDistances().get(node.id);
        if (dist !== undefined && dist !== Infinity) {
          p.fill(180, 180, 200);
          p.textSize(10);
          p.text(`d=${dist}`, node.x, node.y + nodeRadius + 14);
        }
      }
    }

    // Draw legend
    drawLegend();

    // Stop when done
    if (algorithm && algorithm.isDone()) {
      isRunning = false;
      // Draw "Done" indicator
      p.noStroke();
      p.fill(34, 197, 94, 200);
      p.textSize(14);
      p.textAlign(p.LEFT, p.TOP);
      p.text('✓ Complete', 15, 15);
    }
    p.pop();
  };

  function drawLegend() {
    const x = 15, y = p.height - 90;
    p.noStroke();
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(11);

    // Source
    p.fill(139, 92, 246); p.ellipse(x + 6, y, 12);
    p.fill(160); p.text('Source', x + 18, y);

    // Current
    p.fill(239, 68, 68); p.ellipse(x + 6, y + 20, 12);
    p.fill(160); p.text('Current', x + 18, y + 20);

    // Visited
    p.fill(34, 197, 94); p.ellipse(x + 6, y + 40, 12);
    p.fill(160); p.text('Visited', x + 18, y + 40);

    // Unvisited
    p.fill(45, 45, 65); p.ellipse(x + 6, y + 60, 12);
    p.fill(160); p.text('Unvisited', x + 18, y + 60);
  }

  p.windowResized = () => {
    p.redraw();
  };
};
