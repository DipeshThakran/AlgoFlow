export const binarySearchSketch = (p) => {
  // Fixed array and variables
  let values = [-5, -2, 0, 1, 2, 4, 5, 6, 7, 10];
  let low = 0;
  let high = values.length - 1;
  let mid = -1;
  let target = 7;
  let found = false;
  let searching = true;
  let steps = 0;
  let speed = 5;
  let cw = 800;
  let ch = 200;

  p.updateWithProps = props => {
    if (props.target !== undefined) target = props.target;
    // Optionally allow array override from props
    if (props.values && Array.isArray(props.values)) {
      values = props.values.slice().sort((a, b) => a - b);
      low = 0;
      high = values.length - 1;
      mid = -1;
      found = false;
      searching = true;
      steps = 0;
    }
    if (typeof props.isSearching !== 'undefined') {
      searching = props.isSearching;
      if (searching) {
        p.loop();
      } else {
        p.noLoop();
        p.redraw();
      }
    }
    if (props.speed !== undefined) {
      speed = props.speed;
      p.frameRate(speed * 2);
    }
    if (props.width && props.height) {
      cw = props.width;
      ch = props.height;
      p.resizeCanvas(cw, ch);
    }
  };

  p.setup = () => {
    p.createCanvas(cw, ch);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(18);
    p.frameRate(speed * 2);
    p.noLoop();
  };

  p.draw = () => {
    p.background(255);
    drawArray();

    if (searching) {
      if (low <= high) {
        mid = Math.floor((low + high) / 2);
        steps++;
        if (values[mid] === target) {
          found = true;
          searching = false;
        } else if (values[mid] < target) {
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      } else {
        searching = false;
      }
    } else {
      p.noLoop();
    }

    // Draw info
    p.textSize(16);
    p.fill(0);
    p.text(`Target: ${target} | Steps: ${steps}`, p.width / 2, 30);

    if (!searching) {
      if (found) {
        p.fill(100, 200, 100);
        p.text(`Found at index ${mid}`, p.width / 2, 55);
      } else {
        p.fill(248, 113, 113);
        p.text('Not found', p.width / 2, 55);
      }
    }
  };

  function drawArray() {
    let padding = 5;
    let boxWidth = Math.min(70, (p.width - padding * values.length) / values.length);
    let boxHeight = 60;
    let totalWidth = values.length * (boxWidth + padding);
    let startX = (p.width - totalWidth) / 2 + padding / 2;
    let y = p.height / 2 - boxHeight / 2;

    for (let i = 0; i < values.length; i++) {
      let x = startX + i * (boxWidth + padding);

      // Default color
      p.fill(240);

      if (i === mid && found) {
        p.fill(100, 200, 100); // Green: found
      } else if (i === mid) {
        p.fill(255, 255, 150); // Yellow: middle
      } else if (i === low && low <= high) {
        p.fill(180, 200, 255); // Blue: low
      } else if (i === high && low <= high) {
        p.fill(200, 180, 255); // Purple: high
      }

      p.stroke(0);
      p.rect(x, y, boxWidth, boxHeight);
      p.fill(0);
      p.text(values[i], x + boxWidth / 2, y + boxHeight / 2);

      // Draw index number above
      p.textSize(14);
      p.text(i, x + boxWidth / 2, y - 20);
      p.textSize(18);
    }

    // Draw labels
    drawLabel('Low', low, startX, boxWidth, p.height / 2 + 40);
    drawLabel('Middle', mid, startX, boxWidth, p.height / 2 + 60);
    drawLabel('High', high, startX, boxWidth, p.height / 2 + 80);
  }

  function drawLabel(label, index, startX, boxWidth, y) {
    if (index >= 0 && index < values.length) {
      let x = startX + index * (boxWidth + 5) + boxWidth / 2;
      p.fill(0);
      p.textSize(14);
      p.text(label, x, y);
    }
  }
}