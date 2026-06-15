import React, { useState, useEffect } from 'react';
import { PlayCircle, RotateCcw, RefreshCw, Trophy } from 'lucide-react';
import P5Wrapper from './P5Wrapper';

// Sketches
import { bubbleSortSketch } from '../sketches/bubbleSortSketch';
import { selectionSortSketch } from '../sketches/selectionSortSketch';
import { insertionSortSketch } from '../sketches/insertionSortSketch';
import { mergeSortSketch } from '../sketches/mergeSortSketch';
import { quickSortSketch } from '../sketches/quickSortSketch';
import { heapSortSketch } from '../sketches/heapSortSketch';

// Algorithm Classes
import { BubbleSort } from '../algorithms/sorting-algos/bubblesort';
import { SelectionSort } from '../algorithms/sorting-algos/selectionsort';
import { InsertionSort } from '../algorithms/sorting-algos/insertionsort';
import { MergeSort } from '../algorithms/sorting-algos/mergesort';
import { QuickSort } from '../algorithms/sorting-algos/quicksort';
import { HeapSort } from '../algorithms/sorting-algos/heapsort';

const ALGORITHMS = [
  { name: 'Bubble Sort', sketch: bubbleSortSketch, Class: BubbleSort },
  { name: 'Selection Sort', sketch: selectionSortSketch, Class: SelectionSort },
  { name: 'Insertion Sort', sketch: insertionSortSketch, Class: InsertionSort },
  { name: 'Merge Sort', sketch: mergeSortSketch, Class: MergeSort },
  { name: 'Quick Sort', sketch: quickSortSketch, Class: QuickSort },
  { name: 'Heap Sort', sketch: heapSortSketch, Class: HeapSort },
];

const SortingRace = () => {
  const [baseArray, setBaseArray] = useState([]);
  const [sorters, setSorters] = useState(Array(6).fill(null));
  const [isRacing, setIsRacing] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]); // [{ name, time, steps }]
  const [speed, setSpeed] = useState(5);

  const generateArray = () => {
    const arr = [];
    for (let i = 0; i < 50; i++) {
      arr.push(Math.floor(Math.random() * 340) + 10);
    }
    setBaseArray(arr);
    
    // Initialize sorters with fresh clones
    const newSorters = ALGORITHMS.map(algo => new algo.Class([...arr]));
    setSorters(newSorters);
    setIsRacing(false);
    setLeaderboard([]);
  };

  useEffect(() => {
    generateArray();
  }, []);

  const handleAlgorithmFinish = (index) => {
    setLeaderboard(prev => {
      const algoName = ALGORITHMS[index].name;
      if (prev.find(l => l.name === algoName)) return prev;
      
      const sorter = sorters[index];
      const newEntry = {
        name: algoName,
        steps: sorter ? sorter.steps : 0,
        comparisons: sorter ? sorter.comparisons : 0,
        swaps: sorter ? sorter.swaps : 0
      };
      
      const newLeaderboard = [...prev, newEntry];
      if (newLeaderboard.length === ALGORITHMS.length) {
        setIsRacing(false);
      }
      return newLeaderboard;
    });
  };

  const handleStartRace = () => {
    if (leaderboard.length > 0) {
      // Re-initialize sorters with the SAME array to restart race
      const newSorters = ALGORITHMS.map(algo => new algo.Class([...baseArray]));
      setSorters(newSorters);
      setLeaderboard([]);
    }
    setIsRacing(true);
  };

  const getRankBadge = (algoName) => {
    const rank = leaderboard.findIndex(l => l.name === algoName);
    if (rank === -1) return null;
    
    if (rank === 0) return <span className="text-yellow-400 font-bold flex items-center gap-1"><Trophy className="w-4 h-4"/> 1st</span>;
    if (rank === 1) return <span className="text-gray-300 font-bold flex items-center gap-1"><Trophy className="w-4 h-4"/> 2nd</span>;
    if (rank === 2) return <span className="text-amber-600 font-bold flex items-center gap-1"><Trophy className="w-4 h-4"/> 3rd</span>;
    return <span className="text-purple-400 font-bold">{rank + 1}th</span>;
  };

  return (
    <div className="space-y-6">
      {/* Race Controls */}
      <div className="glass-card p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-white">Race Mode</span>
          <label className="flex items-center gap-2 text-sm text-gray-400">
            Speed
            <input
              type="range"
              min="1"
              max="20"
              value={speed}
              onChange={e => setSpeed(Number(e.target.value))}
              className="w-24"
            />
            <span className="text-xs text-purple-400 font-mono w-6">{speed}x</span>
          </label>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-ghost py-2 text-sm" onClick={generateArray} disabled={isRacing}>
            <RefreshCw className="w-4 h-4" />
            New Array
          </button>
          <button className="btn-primary py-2 text-sm" onClick={handleStartRace} disabled={isRacing || baseArray.length === 0}>
            <PlayCircle className="w-4 h-4" />
            Start Race
          </button>
        </div>
      </div>

      {/* Grid of 6 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {ALGORITHMS.map((algo, index) => (
          <div key={algo.name} className="glass-card p-4 flex flex-col h-[350px]">
            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
              <h3 className="font-semibold text-white text-sm">{algo.name}</h3>
              {getRankBadge(algo.name)}
            </div>
            
            <div className="flex-1 viz-canvas w-full overflow-x-auto flex items-center justify-start rounded-lg bg-black/40">
              <P5Wrapper
                sketch={algo.sketch}
                values={[...baseArray]}
                sorter={sorters[index]}
                isSorting={isRacing}
                speed={speed}
                width={300}
                height={220}
                showLabels={false}
                onFinish={() => handleAlgorithmFinish(index)}
              />
            </div>

            {/* Mini metrics */}
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white/5 rounded py-1">
                <span className="block text-gray-500">Steps</span>
                <span className="text-white font-mono">{sorters[index]?.steps || 0}</span>
              </div>
              <div className="bg-white/5 rounded py-1">
                <span className="block text-gray-500">Comps</span>
                <span className="text-blue-400 font-mono">{sorters[index]?.comparisons || 0}</span>
              </div>
              <div className="bg-white/5 rounded py-1">
                <span className="block text-gray-500">Swaps</span>
                <span className="text-green-400 font-mono">{sorters[index]?.swaps || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SortingRace;
