/**
 * Universal p5.js sketch for tree algorithm visualizations
 * Dark-themed with animated node visiting
 */
export const treeSketch = (p) => {
  let bst = null;
  let traversal = null;
  let isRunning = false;
  let speed = 5;
  let frameCounter = 0;
  let cw = 800;
  let ch = 450;

  p.updateWithProps = (props) => {
    if (props.bst) bst = props.bst;
    if (props.traversal) traversal = props.traversal;
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
    // Calculate scale factor based on width to fit 800px content inside cw
    const scaleFactor = Math.min(1, cw / 800);
    
    // Center it horizontally if scaled down
    if (scaleFactor < 1) {
      const scaledWidth = 800 * scaleFactor;
      p.translate((cw - scaledWidth) / 2, 0);
    }
    
    p.scale(scaleFactor);

    if (!bst || !bst.getRoot()) {
      p.fill(100);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(16 / scaleFactor);
      p.text('Click "Start" to generate a tree', 400, ch / 2 / scaleFactor);
      p.pop();
      return;
    }

    // Step traversal at controlled speed
    frameCounter++;
    const stepInterval = Math.max(1, Math.floor(25 / speed));
    if (isRunning && traversal && !traversal.isDone() && frameCounter % stepInterval === 0) {
      traversal.step();
    }

    const visitedNodes = traversal ? new Set(traversal.getVisitOrder()) : new Set();
    const currentNode = traversal ? traversal.getCurrentNode() : null;

    // Draw tree recursively
    drawNode(bst.getRoot(), visitedNodes, currentNode);

    // Draw visit order at bottom
    if (traversal && traversal.getVisitValues().length > 0) {
      const values = traversal.getVisitValues();
      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(12 / scaleFactor);
      p.fill(140);
      p.text('Traversal Order:', 400, (ch - 40) / scaleFactor);
      
      const maxShow = Math.min(values.length, 20);
      const displayVals = values.slice(0, maxShow);
      const valStr = displayVals.join(' → ') + (values.length > maxShow ? ' ...' : '');
      p.fill(192, 132, 252);
      p.textSize(13 / scaleFactor);
      p.text(valStr, 400, (ch - 18) / scaleFactor);
    }

    // Done indicator
    if (traversal && traversal.isDone()) {
      isRunning = false;
      p.noStroke();
      p.fill(34, 197, 94, 220);
      p.textSize(14 / scaleFactor);
      p.textAlign(p.LEFT, p.TOP);
      p.text('✓ Traversal Complete', 15, 15);
    }
    
    p.pop();
  };

  function drawNode(node, visited, current) {
    if (!node) return;

    // Draw edges first
    if (node.left) {
      const isEdgeVisited = visited.has(node) && visited.has(node.left);
      p.stroke(isEdgeVisited ? p.color(139, 92, 246, 180) : p.color(50, 50, 70));
      p.strokeWeight(isEdgeVisited ? 2.5 : 1);
      p.line(node.x, node.y, node.left.x, node.left.y);
    }
    if (node.right) {
      const isEdgeVisited = visited.has(node) && visited.has(node.right);
      p.stroke(isEdgeVisited ? p.color(139, 92, 246, 180) : p.color(50, 50, 70));
      p.strokeWeight(isEdgeVisited ? 2.5 : 1);
      p.line(node.x, node.y, node.right.x, node.right.y);
    }

    // Recurse children
    drawNode(node.left, visited, current);
    drawNode(node.right, visited, current);

    // Determine fill color
    const isCurrent = node === current;
    const isVisited = visited.has(node);
    const isRoot = node === (bst ? bst.getRoot() : null);
    
    let fillColor;
    let nodeRadius = 18;
    
    if (isCurrent) {
      fillColor = [239, 68, 68]; // red — active
      nodeRadius = 22;
    } else if (isVisited) {
      fillColor = [34, 197, 94]; // green — visited
    } else if (isRoot) {
      fillColor = [139, 92, 246]; // purple — root
    } else {
      fillColor = [45, 45, 65]; // dark gray — unvisited
    }

    // Glow for current
    if (isCurrent) {
      p.noStroke();
      p.fill(239, 68, 68, 25);
      p.ellipse(node.x, node.y, nodeRadius * 3);
    }

    // Node circle
    p.fill(...fillColor);
    p.stroke(255, 255, 255, 25);
    p.strokeWeight(1);
    p.ellipse(node.x, node.y, nodeRadius * 2);

    // Value text
    p.noStroke();
    p.fill(255);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(12);
    p.textStyle(p.BOLD);
    p.text(node.value, node.x, node.y);
    p.textStyle(p.NORMAL);
  }

  p.windowResized = () => {
    p.redraw();
  };
};
