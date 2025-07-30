export class QuickSort {
    constructor(arr) {
      this.arr = arr;
      this.stack = [{ left: 0, right: arr.length - 1 }];
      this.i = null;
      this.j = null;
      this.pivot = null;
      this.sorted = false;
      this.sortedIndices = [];
      this.comparisons = 0;
      this.swaps = 0;
      this.steps = 0;
      this.totalSteps = Math.round(this.arr.length * Math.log2(this.arr.length) * 1.5); // More accurate estimate for quick sort
    }
  
    step() {
      if (this.sorted) return;
  
      this.steps++;
  
      if (this.stack.length === 0) {
        this.sorted = true;
        this.sortedIndices = Array.from({ length: this.arr.length }, (_, idx) => idx);
        return;
      }
  
      let top = this.stack[this.stack.length - 1];
      let { left, right } = top;
  
      if (left >= right) {
        this.stack.pop();
        return;
      }
  
      if (this.i === null) {
        this.pivot = this.arr[right];
        this.i = left - 1;
        this.j = left;
      }
  
      if (this.j < right) {
        this.comparisons++;
        if (this.arr[this.j] < this.pivot) {
          this.i++;
          [this.arr[this.i], this.arr[this.j]] = [this.arr[this.j], this.arr[this.i]];
          this.swaps++;
        }
        this.j++;
      } else {
        [this.arr[this.i + 1], this.arr[right]] = [this.arr[right], this.arr[this.i + 1]];
        this.swaps++;
        let pi = this.i + 1;
        this.stack.pop();
        this.stack.push({ left: left, right: pi - 1 });
        this.stack.push({ left: pi + 1, right: right });
        this.i = null;
        this.j = null;
        this.pivot = null;
      }
    }
  
    isSorted() {
      return this.sorted;
    }
  
    getCurrentIndices() {
      return [this.i, this.j];
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