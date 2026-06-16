import { QuickSort } from '../algorithms/sorting-algos/quicksort';
import { audioSystem } from '../utils/audioSystem';

export const quickSortSketch = (p) => {
  let values = [];
  let sorter = null;
  let isSorting = false;
  let speed = 5;
  let cw = 800;
  let ch = 450;
  let showLabels = true;
  let onFinish = null;
  let hasFinished = false;

  p.updateWithProps = props => {
    if (props.values) values = props.values;
    if (props.sorter) sorter = props.sorter;
    if (typeof props.isSorting !== 'undefined') {
      if (props.isSorting && !isSorting) hasFinished = false;
      isSorting = props.isSorting;
      if (isSorting && sorter) {
        p.loop();
      } else {
        p.noLoop();
        p.redraw();
      }
    }
    if (props.onFinish) {
      onFinish = props.onFinish;
    }
    // Add speed control
    if (props.speed !== undefined) {
      speed = props.speed;
      p.frameRate(speed * 2); // Adjust frame rate based on speed
    }
    if (props.width && props.height) {
      cw = props.width;
      ch = props.height;
      p.resizeCanvas(cw, ch);
    }
    if (props.showLabels !== undefined) {
      showLabels = props.showLabels;
    }
  };

  p.setup = () => {
    p.createCanvas(cw, ch);
    p.noLoop();
    p.frameRate(speed * 2); // Set initial frame rate
  };

  p.draw = () => {
    p.background(10, 10, 20);

    // Only sort if we have a sorter and we're supposed to be sorting
    if (isSorting && sorter) {
      if (!sorter.isSorted()) {
        sorter.step();
        
        // Play sound
        const arr = sorter.arr;
        const indices = sorter.getCurrentIndices();
        const compareA = indices[0] >= 0 ? indices[0] : (indices[1] >= 0 ? indices[1] : 0);
        if (arr && compareA >= 0 && compareA < arr.length) {
          audioSystem.playSortTone(arr[compareA]);
        }
      }
      if (sorter.isSorted() && !hasFinished) {
        hasFinished = true;
        if (onFinish) onFinish();
      }
    }

    const [i, j] = sorter && sorter.getCurrentIndices ? sorter.getCurrentIndices() : [-1, -1];
    const sortedIndices = sorter && sorter.getSortedIndices ? sorter.getSortedIndices() : [];
    const arr = sorter && sorter.arr ? sorter.arr : (values && values.length > 0 ? values : []);
    const barWidth = p.width / (arr.length || 1);
    const padding = 2;
    const maxVal = arr.length > 0 ? Math.max(...arr) : 350;

    // Only draw bars if we have data
    if (arr.length > 0) {
      for (let idx = 0; idx < arr.length; idx++) {
        const barHeight = p.map(arr[idx], 0, maxVal, 10, p.height - 40);

        if (sortedIndices.includes(idx) || (sorter && sorter.isSorted())) {
          p.fill(34, 197, 94);
        } else if (idx === i || idx === j) {
          p.fill(239, 68, 68);
        } else {
          p.fill(55, 65, 81);
        }

        p.noStroke();
        p.rect(idx * barWidth + padding / 2, (p.height - 30) - barHeight, barWidth - padding, barHeight, 6);
      }
    }

    // Stop sorting if completed
    if (sorter && sorter.isSorted()) {
      isSorting = false;
      p.noLoop();
    }

    // Draw array indices below the bars
    if (arr.length > 0 && showLabels) {
      p.fill(128);
      p.textSize(10);
      p.textAlign(p.CENTER, p.TOP);
      for (let i = 0; i < arr.length; i++) {
        const x = i * barWidth + barWidth / 2;
        const y = p.height - 15; // Placed at bottom margin
        p.text(i.toString(), x, y);
      }
    }
  };

  p.windowResized = () => {
    p.redraw();
  };
};
