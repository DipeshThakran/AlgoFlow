export class HeapSort {
    constructor(arr) {
      this.arr = arr;
      this.n = arr.length;
      this.i = Math.floor(this.n / 2) - 1;
      this.j = this.n - 1;
      this.phase = 'heapify';
      this.sorted = false;
      this.sortedIndices = [];
      this.heapSize = this.n;
      this.currentIndices = [];
      this.comparisons = 0;
      this.swaps = 0;
      this.steps = 0;
      this.totalSteps = Math.round(this.n * Math.log2(this.n) * 1.5); // More accurate estimate for heap sort
    }
  
    step() {
      if (this.sorted) return;
  
      this.steps++;
  
      if (this.phase === 'heapify') {
        if (this.i >= 0) {
          this.heapify(this.n, this.i);
          this.i--;
        } else {
          this.phase = 'sort';
          this.j = this.n - 1;
        }
      } else if (this.phase === 'sort') {
        if (this.j > 0) {
          [this.arr[0], this.arr[this.j]] = [this.arr[this.j], this.arr[0]];
          this.swaps++;
          this.heapify(this.j, 0);
          this.sortedIndices.push(this.j);
          this.j--;
        } else {
          this.sorted = true;
          this.sortedIndices = Array.from({ length: this.n }, (_, idx) => idx);
        }
      }
    }
  
    heapify(n, i) {
      let largest = i;
      let l = 2 * i + 1;
      let r = 2 * i + 2;
      this.currentIndices = [i];
      if (l < n && this.arr[l] > this.arr[largest]) {
        this.comparisons++;
        largest = l;
      }
      if (r < n && this.arr[r] > this.arr[largest]) {
        this.comparisons++;
        largest = r;
      }
      if (largest !== i) {
        [this.arr[i], this.arr[largest]] = [this.arr[largest], this.arr[i]];
        this.swaps++;
        this.heapify(n, largest);
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