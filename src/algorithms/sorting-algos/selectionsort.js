export class SelectionSort {
    constructor(arr) {
      this.arr = arr;
      this.i = 0;
      this.j = 1;
      this.minIdx = 0;
      this.sorted = false;
      this.comparisons = 0;
      this.swaps = 0;
      this.steps = 0;
      this.totalSteps = Math.round(this.arr.length * (this.arr.length - 1)); // More accurate estimate for selection sort
    }
  
    step() {
      if (this.sorted) return;
  
      this.steps++;
      
      if (this.i < this.arr.length - 1) {
        if (this.j < this.arr.length) {
          this.comparisons++;
          if (this.arr[this.j] < this.arr[this.minIdx]) {
            this.minIdx = this.j;
          }
          this.j++;
        } else {
          // Swap
          if (this.minIdx !== this.i) {
            [this.arr[this.i], this.arr[this.minIdx]] = [this.arr[this.minIdx], this.arr[this.i]];
            this.swaps++;
          }
          this.i++;
          this.minIdx = this.i;
          this.j = this.i + 1;
        }
      } else {
        this.sorted = true;
      }
    }
  
    isSorted() {
      return this.sorted;
    }
  
    getCurrentIndices() {
      return [this.i, this.j, this.minIdx];
    }
  
    getSortedIndices() {
      if (this.sorted) {
        return Array.from({ length: this.arr.length }, (_, idx) => idx);
      }
      return Array.from({ length: this.i }, (_, idx) => idx);
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