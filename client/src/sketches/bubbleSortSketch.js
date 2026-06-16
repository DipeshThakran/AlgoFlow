import { BubbleSort } from '../algorithms/sorting-algos/bubblesort';
import { audioSystem } from '../utils/audioSystem';

/**
 * p5.js sketch for visualizing bubble sort.
 * Uses red for compared bars and green for sorted bars.
 */
export const bubbleSortSketch = (p) => {
  let values = [];
  let sorter = null;
  let isSorting = false;
  let speed = 5; // Add speed variable
  let cw = 800;
  let ch = 450;
  let showLabels = true;
  let onFinish = null;
  let hasFinished = false;

  // This function is called by ReactP5Wrapper to update the sketch's internal state
  p.updateWithProps = props => {
    if (props.values) {
      values = props.values;
    }
    if (props.sorter) {
      sorter = props.sorter;
    }
    if (typeof props.isSorting !== 'undefined') {
      if (props.isSorting && !isSorting) hasFinished = false; // reset flag on new sort
      isSorting = props.isSorting;
      if (isSorting && sorter) {
        p.loop(); // Start the animation loop
      } else {
        p.noLoop(); // Pause the animation loop
        p.redraw(); // Draw one last frame to show the current state
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
    p.background(10, 10, 20); // Dark background: bg-[#0a0a14]

    // Only sort if we have a sorter and we're supposed to be sorting
    if (isSorting && sorter) {
      if (!sorter.isSorted()) {
        sorter.step();
        
        // Play sound
        const arr = sorter.arr;
        const [compareA] = sorter.getCurrentIndices();
        if (arr && compareA >= 0 && compareA < arr.length) {
          audioSystem.playSortTone(arr[compareA]);
        }
      }
      if (sorter.isSorted() && !hasFinished) {
        hasFinished = true;
        if (onFinish) onFinish();
      }
    }

    const [compareA, compareB] = sorter && sorter.getCurrentIndices ? sorter.getCurrentIndices() : [-1, -1];
    const sortedIndices = sorter && sorter.getSortedIndices ? sorter.getSortedIndices() : [];
    const arr = sorter && sorter.arr ? sorter.arr : (values && values.length > 0 ? values : []);
    const barWidth = p.width / (arr.length || 1);
    const padding = 2;
    const maxVal = arr.length > 0 ? Math.max(...arr) : 350;

    // Only draw bars if we have data
    if (arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        const barHeight = p.map(arr[i], 0, maxVal, 10, p.height - 40);

        if (sortedIndices.includes(i) || (sorter && sorter.isSorted())) {
          p.fill(34, 197, 94); // Tailwind green-500
        } else if (i === compareA || i === compareB) {
          p.fill(239, 68, 68); // Tailwind red-500
        } else {
          p.fill(55, 65, 81); // Tailwind gray-700
        }

        p.noStroke();
        p.rect(i * barWidth + padding / 2, (p.height - 30) - barHeight, barWidth - padding, barHeight, 6); // Rounded bars
      }
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

    // Stop sorting if completed
    if (sorter && sorter.isSorted()) {
      isSorting = false;
      p.noLoop();
    }
  };

  p.windowResized = () => {
    // If not controlled by props, we can maintain the last known size or default
    p.redraw();
  };
};