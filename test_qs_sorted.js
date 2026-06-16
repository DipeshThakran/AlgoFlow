import { QuickSort } from './src/algorithms/sorting-algos/quicksort.js';

let totalStepsSum = 0;
for(let t=0; t<100; t++) {
  const arr = Array.from({length: 50}, (_, i) => 10 + i * (340/50));
  const qs = new QuickSort(arr);
  let step = 0;
  while (!qs.isSorted() && step < 5000) {
    qs.step();
    step++;
  }
  totalStepsSum += step;
}
console.log("Average steps (Sorted):", totalStepsSum / 100);
