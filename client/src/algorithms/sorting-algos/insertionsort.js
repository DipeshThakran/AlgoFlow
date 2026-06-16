export class InsertionSort {
    constructor(arr) {
      this.arr = arr;
      this.i = 1;
      this.j = 1;
      this.key = arr[1];
      this.sorted = false;
      this.comparisons = 0;
      this.swaps = 0;
      this.steps = 0;
      this.totalSteps = Math.round(this.arr.length * (this.arr.length - 1)); // More accurate estimate for insertion sort
    }
  
    step() {
      if (this.sorted) return;
  
      this.steps++;
      
      if (this.i < this.arr.length) {
        if (this.j > 0 && this.arr[this.j - 1] > this.key) {
          this.comparisons++;
          this.arr[this.j] = this.arr[this.j - 1];
          this.swaps++;
          this.j--;
        } else {
          if (this.j > 0) {
            this.comparisons++;
          }
          this.arr[this.j] = this.key;
          this.i++;
          if (this.i < this.arr.length) {
            this.j = this.i;
            this.key = this.arr[this.i];
          }
        }
      } else {
        this.sorted = true;
      }
    }
  
    isSorted() {
      return this.sorted;
    }
  
    getCurrentIndices() {
      return [this.i, this.j];
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