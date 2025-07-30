export class BubbleSort {
  constructor(arr) {
    this.arr = arr;
    this.i = 0;
    this.j = 0;
    this.sorted = false;
    this.comparisons = 0;
    this.swaps = 0;
    this.steps = 0;
    this.totalSteps = Math.round(this.arr.length * (this.arr.length - 1)); // More accurate estimate for bubble sort
  }

  step() {
    if (this.sorted) return;

    this.steps++;
    
    if (this.i < this.arr.length - 1) {
      if (this.j < this.arr.length - this.i - 1) {
        this.comparisons++;
        if (this.arr[this.j] > this.arr[this.j + 1]) {
          // Swap
          let temp = this.arr[this.j];
          this.arr[this.j] = this.arr[this.j + 1];
          this.arr[this.j + 1] = temp;
          this.swaps++;
        }
        this.j++;
      } else {
        this.j = 0;
        this.i++;
      }
    } else {
      this.sorted = true;
    }
  }

  isSorted() {
    return this.sorted;
  }

  getCurrentIndices() {
    return [this.j, this.j + 1];
  }

  getSortedIndices() {
    // All elements from arr.length - i to arr.length - 1 are sorted
    if (this.sorted) {
      return Array.from({ length: this.arr.length }, (_, idx) => idx);
    }
    return Array.from({ length: this.i }, (_, idx) => this.arr.length - 1 - idx).reverse();
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