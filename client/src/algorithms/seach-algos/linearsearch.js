// LinearSearch.js
export class LinearSearch {
    constructor(arr, target) {
      this.arr = arr.slice();
      this.target = target;
      this.current = 0;
      this.foundIndex = -1;
      this.done = false;
      this.steps = 0;
    }
  
    step() {
      if (this.done) return;
      if (this.current >= this.arr.length) {
        this.done = true;
        this.foundIndex = -1;
        return;
      }
      this.steps++;
      if (this.arr[this.current] === this.target) {
        this.foundIndex = this.current;
        this.done = true;
      } else {
        this.current++;
      }
    }
  
    isFound() {
      return this.foundIndex !== -1;
    }
  
    isDone() {
      return this.done;
    }
  
    getCurrentIndex() {
      return this.current;
    }
  
    getResult() {
      return this.foundIndex;
    }
  
    getSteps() {
      return this.steps;
    }
  }