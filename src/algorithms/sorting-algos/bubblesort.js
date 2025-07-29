export class BubbleSort {
  constructor(arr) {
    this.arr = arr;
    this.i = 0;
    this.j = 0;
    this.sorted = false;
  }

  step() {
    if (this.sorted) return;

    if (this.i < this.arr.length) {
      if (this.j < this.arr.length - this.i - 1) {
        if (this.arr[this.j] > this.arr[this.j + 1]) {
          // Swap
          let temp = this.arr[this.j];
          this.arr[this.j] = this.arr[this.j + 1];
          this.arr[this.j + 1] = temp;
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
}