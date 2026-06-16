import { QuickSort } from './src/algorithms/sorting-algos/quicksort.js';

const arr = [10, 10, 10, 10, 10];
const qs = new QuickSort(arr);

let maxSteps = 1000;
let step = 0;
while (!qs.isSorted() && step < maxSteps) {
  qs.step();
  step++;
}

console.log("Sorted:", qs.isSorted());
console.log("Final array:", qs.arr);
console.log("Steps taken:", step);
