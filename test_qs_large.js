import { QuickSort } from './src/algorithms/sorting-algos/quicksort.js';

let totalStepsSum = 0;
for(let t=0; t<100; t++) {
  const arr = Array.from({length: 50}, () => Math.floor(Math.random() * 340) + 10);
  const qs = new QuickSort(arr);
  let step = 0;
  while (!qs.isSorted() && step < 5000) {
    qs.step();
    step++;
  }
  totalStepsSum += step;
}
console.log("Average steps:", totalStepsSum / 100);
