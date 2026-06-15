// BinarySearch.js
export class BinarySearch {
  constructor(arr, target) {
    this.arr = arr.slice().sort((a, b) => a - b); // Sorted copy
    this.target = target;
    this.left = 0;
    this.right = arr.length - 1;
    this.currentMid = Math.floor((this.left + this.right) / 2); // Initialize mid for first draw
    this.foundIndex = -1;
    this.done = false;
    this.steps = 0;
  }

  step() {
    if (this.done) return;

    if (this.left > this.right) {
      this.done = true;
      this.foundIndex = -1;
      return;
    }

    this.currentMid = Math.floor((this.left + this.right) / 2);
    this.steps++;

    if (this.arr[this.currentMid] === this.target) {
      this.foundIndex = this.currentMid;
      this.done = true;
    } else if (this.arr[this.currentMid] < this.target) {
      this.left = this.currentMid + 1;
    } else {
      this.right = this.currentMid - 1;
    }
  }

  isFound() {
    return this.foundIndex !== -1;
  }

  isDone() {
    return this.done;
  }

  getCurrentIndices() {
    // Always return valid indices for visualization
    return [this.left, this.right, this.currentMid];
  }

  getResult() {
    return this.foundIndex;
  }

  getSteps() {
    return this.steps;
  }
}