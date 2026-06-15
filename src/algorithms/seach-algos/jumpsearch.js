// JumpSearch.js
export class JumpSearch {
    constructor(arr, target) {
      this.arr = arr.slice().sort((a, b) => a - b);
      this.target = target;
      this.n = this.arr.length;
      this.blockSize = Math.floor(Math.sqrt(this.n));
      this.current = 0;
      this.prev = 0;
      this.foundIndex = -1;
      this.done = false;
      this.steps = 0;
      this.linearPhase = false;
    }
  
    step() {
      if (this.done) return;
      this.steps++;
  
      if (!this.linearPhase) {
        if (this.current >= this.n || this.arr[this.current] >= this.target) {
          this.linearPhase = true;
          this.current = this.prev;
        } else {
          this.prev = this.current;
          this.current += this.blockSize;
        }
      } else {
        if (this.current >= this.n || this.arr[this.current] > this.target) {
          this.done = true;
          this.foundIndex = -1;
          return;
        }
        if (this.arr[this.current] === this.target) {
          this.foundIndex = this.current;
          this.done = true;
          return;
        }
        this.current++;
      }
    }
  
    isFound() {
      return this.foundIndex !== -1;
    }
  
    isDone() {
      return this.done;
    }
  
    getCurrentIndices() {
      // For visualization: [prev, current, blockSize, linearPhase]
      return [this.prev, this.current, this.blockSize, this.linearPhase];
    }
  
    getResult() {
      return this.foundIndex;
    }
  
    getSteps() {
      return this.steps;
    }
  }