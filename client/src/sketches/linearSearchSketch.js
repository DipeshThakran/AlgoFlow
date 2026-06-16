import { LinearSearch } from '../algorithms/seach-algos/linearsearch';

export const linearSearchSketch = (p) => {
  let values = [];
  let target = null;
  let searcher = null;
  let isSearching = false;
  let speed = 5;
  let cw = 800;
  let ch = 320;

  p.updateWithProps = props => {
    if (props.values) values = props.values.slice();
    if (props.target !== undefined) target = props.target;
    if (props.searcher) searcher = props.searcher;
    if (typeof props.isSearching !== 'undefined') {
      isSearching = props.isSearching;
      if (isSearching && searcher) {
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
    p.noLoop();
    p.frameRate(speed * 2);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.textSize(16);
  };

  p.draw = () => {
    p.background(20, 20, 30);

    if (isSearching && searcher && !searcher.isDone()) {
      searcher.step();
    }

    const current = searcher ? searcher.getCurrentIndex() : -1;
    const foundIndex = searcher && searcher.isFound() ? searcher.getResult() : -1;

    const barWidth = p.width / (values.length || 1);

    for (let i = 0; i < values.length; i++) {
      if (i === foundIndex) {
        p.fill(74, 222, 128); // Green for found
      } else if (i === current) {
        p.fill(248, 113, 113); // Red for current
      } else {
        p.fill(80);
      }
      p.noStroke();
      p.rect(i * barWidth, p.height - 60, barWidth - 2, 50);

      // Draw value
      p.fill(220);
      p.text(values[i], i * barWidth + barWidth / 2, p.height - 65);
    }

    // Draw pointer
    p.textSize(14);
    if (current >= 0 && current < values.length) {
      p.fill(248, 113, 113);
      p.text('current', current * barWidth + barWidth / 2, p.height - 5);
    }

    // Draw target info
    p.textSize(16);
    p.fill(220);
    p.text(
      `Target: ${target !== null ? target : "?"} | Steps: ${searcher ? searcher.getSteps() : 0}`,
      p.width / 2,
      30
    );

    if (searcher && searcher.isDone()) {
      p.noLoop();
      if (searcher.isFound()) {
        p.fill(74, 222, 128);
        p.text(`Found at index ${searcher.getResult()}`, p.width / 2, 55);
      } else {
        p.fill(248, 113, 113);
        p.text(`Not found`, p.width / 2, 55);
      }
    }
  };
};