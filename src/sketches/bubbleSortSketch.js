import { BubbleSort } from '../algorithms/sorting-algos/bubblesort';

/**
 * p5.js sketch for visualizing bubble sort.
 * Uses red for compared bars and green for sorted bars.
 */
export const bubbleSortSketch = (p) => {
  let values = [];
  let sorter = null;
  let isSorting = false;

  // This function is called by ReactP5Wrapper to update the sketch's internal state
  p.updateWithProps = props => {
    if (props.values) {
      values = props.values;
    }
    if (props.sorter) {
      sorter = props.sorter;
    }
    if (typeof props.isSorting !== 'undefined') {
      isSorting = props.isSorting;
      if (isSorting) {
        p.loop(); // Start the animation loop
      } else {
        p.noLoop(); // Pause the animation loop
        p.redraw(); // Draw one last frame to show the current state
      }
    }
  };

  p.setup = () => {
    const w = 800;
    const h = 400;
    p.createCanvas(w, h);
    p.noLoop();
  };

  p.draw = () => {
    p.background(10, 10, 20); // Dark background: bg-[#0a0a14]

    if (isSorting && sorter && !sorter.isSorted()) {
      sorter.step();
    }

    const [compareA, compareB] = sorter && sorter.getCurrentIndices ? sorter.getCurrentIndices() : [-1, -1];
    const sortedIndices = sorter && sorter.getSortedIndices ? sorter.getSortedIndices() : [];
    const arr = sorter && sorter.arr ? sorter.arr : [];
    const barWidth = p.width / (arr.length || 1);
    const padding = 2;

    for (let i = 0; i < arr.length; i++) {
      const barHeight = p.map(arr[i], 0, p.height, 0, p.height);

      if (sortedIndices.includes(i) || (sorter && sorter.isSorted())) {
        p.fill(34, 197, 94); // Tailwind green-500
      } else if (i === compareA || i === compareB) {
        p.fill(239, 68, 68); // Tailwind red-500
      } else {
        p.fill(55, 65, 81); // Tailwind gray-700
      }

      p.noStroke();
      p.rect(i * barWidth + padding / 2, p.height - barHeight, barWidth - padding, barHeight, 6); // Rounded bars
    }

    if (sorter && sorter.isSorted()) {
      isSorting = false;
      p.noLoop();
    }
  };

  p.windowResized = () => {
    const w = 800;
    const h = 400;
    p.resizeCanvas(w, h);
    p.redraw();
  };
};