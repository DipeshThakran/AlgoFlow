export class MergeSort {
  constructor(arr) {
    this.arr = arr;
    this.n = arr.length;
    this.sorted = false;
    this.stack = [];
    this.currentMerge = null;
    this.currentIndices = [];
    this.sortedIndices = [];
    this.comparisons = 0;
    this.swaps = 0;
    this.steps = 0;
    this.totalSteps = Math.round(this.n * Math.log2(this.n) * 1.5); // More accurate estimate for merge sort
    this.initStack();
  }

  initStack() {
    // Build stack of all subarrays to merge, bottom-up
    let size = 1;
    while (size < this.n) {
      for (let left = 0; left < this.n - size; left += 2 * size) {
        let mid = left + size - 1;
        let right = Math.min(left + 2 * size - 1, this.n - 1);
        this.stack.push({ left, mid, right, i: left, j: mid + 1, k: left, aux: this.arr.slice() });
      }
      size *= 2;
    }
    this.stack.reverse(); // So we can pop from the end
  }

  step() {
    if (this.sorted) return;

    this.steps++;

    if (!this.currentMerge && this.stack.length === 0) {
      this.sorted = true;
      this.sortedIndices = Array.from({ length: this.n }, (_, i) => i);
      return;
    }

    if (!this.currentMerge) {
      this.currentMerge = this.stack.pop();
    }

    let m = this.currentMerge;
    if (m.i <= m.mid && m.j <= m.right) {
      this.currentIndices = [m.i, m.j];
      this.comparisons++;
      if (this.arr[m.i] <= this.arr[m.j]) {
        m.aux[m.k++] = this.arr[m.i++];
      } else {
        m.aux[m.k++] = this.arr[m.j++];
      }
    } else if (m.i <= m.mid) {
      this.currentIndices = [m.i];
      m.aux[m.k++] = this.arr[m.i++];
    } else if (m.j <= m.right) {
      this.currentIndices = [m.j];
      m.aux[m.k++] = this.arr[m.j++];
    } else {
      // Copy back to arr
      for (let l = m.left; l <= m.right; l++) {
        this.arr[l] = m.aux[l];
      }
      this.currentMerge = null;
      // Optionally, update sortedIndices for visualization
      this.sortedIndices = this.sortedIndices.concat(
        Array.from({ length: m.right - m.left + 1 }, (_, idx) => m.left + idx)
      );
    }
  }

  isSorted() {
    return this.sorted;
  }

  getCurrentIndices() {
    return this.currentIndices;
  }

  getSortedIndices() {
    return this.sortedIndices;
  }

  getMetrics() {
    return {
      comparisons: this.comparisons,
      swaps: this.swaps,
      currentStep: this.steps,
      totalSteps: this.totalSteps
    };
  }
}
