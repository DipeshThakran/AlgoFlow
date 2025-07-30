import { BubbleSort } from '../algorithms/sorting-algos/bubblesort';

/**
 * p5.js sketch for visualizing bubble sort.
 * Uses red for compared bars and green for sorted bars.
 */
export const bubbleSortSketch = (p) => {
  let values = [];
  let sorter = null;
  let isSorting = false;
  let speed = 5; // Add speed variable

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
      if (isSorting && sorter) {
        p.loop(); // Start the animation loop
      } else {
        p.noLoop(); // Pause the animation loop
        p.redraw(); // Draw one last frame to show the current state
      }
    }
    // Add speed control
    if (props.speed !== undefined) {
      speed = props.speed;
      p.frameRate(speed * 2); // Adjust frame rate based on speed
    }
  };

  p.setup = () => {
    const w = 800;
    const h = 450; // Increased height to accommodate index labels
    p.createCanvas(w, h);
    p.noLoop();
    p.frameRate(speed * 2); // Set initial frame rate
  };

  p.draw = () => {
    p.background(10, 10, 20); // Dark background: bg-[#0a0a14]

    // Only sort if we have a sorter and we're supposed to be sorting
    if (isSorting && sorter && !sorter.isSorted()) {
      sorter.step();
    }

    const [compareA, compareB] = sorter && sorter.getCurrentIndices ? sorter.getCurrentIndices() : [-1, -1];
    const sortedIndices = sorter && sorter.getSortedIndices ? sorter.getSortedIndices() : [];
    const arr = sorter && sorter.arr ? sorter.arr : [];
    const barWidth = p.width / (arr.length || 1);
    const padding = 2;

    // Only draw bars if we have data
    if (arr.length > 0) {
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
    }

    // Draw step counter and metrics
    if (sorter && arr.length > 0) {
      p.fill(255);
      p.textSize(14);
      p.textAlign(p.LEFT, p.TOP);
      p.text(`Step: ${sorter.steps || 0}`, 10, 10);
      p.text(`Comparisons: ${sorter.comparisons || 0}`, 10, 30);
      p.text(`Swaps: ${sorter.swaps || 0}`, 10, 50);
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

    // Stop sorting if completed
    if (sorter && sorter.isSorted()) {
      isSorting = false;
      p.noLoop();
    }
  };

  p.windowResized = () => {
    const w = 800;
    const h = 450; // Increased height to accommodate index labels
    p.resizeCanvas(w, h);
    p.redraw();
  };
};