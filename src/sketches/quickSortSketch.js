import { QuickSort } from '../algorithms/sorting-algos/quicksort';

export const quickSortSketch = (p) => {
  let values = [];
  let sorter = null;
  let isSorting = false;
  let speed = 5; // Add speed variable

  p.updateWithProps = props => {
    if (props.values) values = props.values;
    if (props.sorter) sorter = props.sorter;
    if (typeof props.isSorting !== 'undefined') {
      isSorting = props.isSorting;
      if (isSorting && sorter) p.loop();
      else {
        p.noLoop();
        p.redraw();
      }
    }
    // Add speed control
    if (props.speed !== undefined) {
      speed = props.speed;
      p.frameRate(speed * 2); // Adjust frame rate based on speed
    }
  };

  p.setup = () => {
    p.createCanvas(800, 450); // Increased height to accommodate index labels
    p.noLoop();
    p.frameRate(speed * 2); // Set initial frame rate
  };

  p.draw = () => {
    p.background(10, 10, 20);

    // Only sort if we have a sorter and we're supposed to be sorting
    if (isSorting && sorter && !sorter.isSorted()) {
      sorter.step();
    }

    const [i, j] = sorter && sorter.getCurrentIndices ? sorter.getCurrentIndices() : [-1, -1];
    const sortedIndices = sorter && sorter.getSortedIndices ? sorter.getSortedIndices() : [];
    const arr = sorter && sorter.arr ? sorter.arr : [];
    const barWidth = p.width / (arr.length || 1);
    const padding = 2;

    // Only draw bars if we have data
    if (arr.length > 0) {
      for (let idx = 0; idx < arr.length; idx++) {
        const barHeight = p.map(arr[idx], 0, p.height, 0, p.height);

        if (sortedIndices.includes(idx) || (sorter && sorter.isSorted())) {
          p.fill(34, 197, 94);
        } else if (idx === i || idx === j) {
          p.fill(239, 68, 68);
        } else {
          p.fill(55, 65, 81);
        }

        p.noStroke();
        p.rect(idx * barWidth + padding / 2, p.height - barHeight, barWidth - padding, barHeight, 6);
      }
    }

    // Stop sorting if completed
    if (sorter && sorter.isSorted()) {
      isSorting = false;
      p.noLoop();
    }

    // Draw array indices below the bars
    if (arr.length > 0) {
      p.fill(128);
      p.textSize(10);
      p.textAlign(p.CENTER, p.TOP);
      for (let i = 0; i < arr.length; i++) {
        const x = i * barWidth + barWidth / 2;
        const y = 430; // Moved further down to avoid overlap
        p.text(i.toString(), x, y);
      }
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(800, 450); // Increased height to accommodate index labels
    p.redraw();
  };
};
