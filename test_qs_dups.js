import { QuickSort } from './src/algorithms/sorting-algos/quicksort.js';

let totalStepsSum = 0;
for(let t=0; t<100; t++) {
  const uniqueValues = [50, 150, 250, 350];
  const arr = Array.from({length: 50}, () => uniqueValues[Math.floor(Math.random() * uniqueValues.length)]);
  const qs = new QuickSort(arr);
  let step = 0;
  while (!qs.isSorted() && step < 5000) {
    qs.step();
    step++;
  }
  totalStepsSum += step;
}
console.log("Average steps (Dups):", totalStepsSum / 100);
