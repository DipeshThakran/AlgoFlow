import React from 'react';
import { Info, BarChart3, TrendingUp } from 'lucide-react';

const AlgorithmInfo = ({ 
  selectedAlgorithm, 
  isSorting, 
  currentStep, 
  totalSteps, 
  comparisons, 
  swaps, 
  currentIndices,
  sortedIndices,
  isCompleted
}) => {
  const getAlgorithmDescription = () => {
    const descriptions = {
      'Bubble Sort': {
        description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
        howItWorks: 'The algorithm gets its name from the way smaller elements "bubble" to the top of the list.',
        bestCase: 'O(n) — when array is already sorted',
        averageCase: 'O(n²) — quadratic time complexity',
        worstCase: 'O(n²) — when array is reverse sorted',
        space: 'O(1) — constant extra space'
      },
      'Selection Sort': {
        description: 'An in-place comparison sorting algorithm that divides the input list into two parts: a sorted sublist and an unsorted sublist.',
        howItWorks: 'The algorithm repeatedly selects the smallest element from the unsorted sublist and places it at the end of the sorted sublist.',
        bestCase: 'O(n²) — same as worst case',
        averageCase: 'O(n²) — quadratic time complexity',
        worstCase: 'O(n²) — always performs the same number of comparisons',
        space: 'O(1) — constant extra space'
      },
      'Insertion Sort': {
        description: 'A simple sorting algorithm that builds the final sorted array one item at a time.',
        howItWorks: 'It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.',
        bestCase: 'O(n) — when array is already sorted',
        averageCase: 'O(n²) — quadratic time complexity',
        worstCase: 'O(n²) — when array is reverse sorted',
        space: 'O(1) — constant extra space'
      },
      'Quick Sort': {
        description: 'A highly efficient, comparison-based, divide and conquer sorting algorithm.',
        howItWorks: 'It picks a "pivot" element and partitions the array around it, placing smaller elements before and larger elements after.',
        bestCase: 'O(n log n) — when pivot divides array evenly',
        averageCase: 'O(n log n) — average case performance',
        worstCase: 'O(n²) — when pivot is always smallest/largest',
        space: 'O(log n) — recursive call stack space'
      },
      'Heap Sort': {
        description: 'A comparison-based sorting algorithm that uses a binary heap data structure.',
        howItWorks: 'It divides the input into a sorted and an unsorted region, and iteratively shrinks the unsorted region by extracting the largest element.',
        bestCase: 'O(n log n) — same as worst case',
        averageCase: 'O(n log n) — consistent performance',
        worstCase: 'O(n log n) — always performs the same',
        space: 'O(1) — in-place sorting'
      },
      'Merge Sort': {
        description: 'An efficient, stable, comparison-based, divide and conquer sorting algorithm.',
        howItWorks: 'It divides the input array into two halves, recursively sorts them, and then merges the sorted halves.',
        bestCase: 'O(n log n) — same as worst case',
        averageCase: 'O(n log n) — consistent performance',
        worstCase: 'O(n log n) — always performs the same',
        space: 'O(n) — requires extra space for merging'
      }
    };
    return descriptions[selectedAlgorithm] || descriptions['Bubble Sort'];
  };

  const algoInfo = getAlgorithmDescription();
  const progress = totalSteps > 0 ? Math.min((currentStep / totalSteps) * 100, 100) : 0;

  return (
    <div className="glass-card p-5 mb-5">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-4 h-4 text-purple-400" />
        <h3 className="text-sm font-semibold text-white">
          {selectedAlgorithm} Information
        </h3>
        {isCompleted && (
          <span className="ml-auto tag tag-green text-xs">
            ✓ Completed!
          </span>
        )}
      </div>

      {/* Progress bar */}
      {isSorting && (
        <div className="mb-4">
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Step {currentStep} / {totalSteps}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Algorithm Description */}
        <div className="space-y-3">
          <div>
            <h4 className="text-xs font-medium text-gray-400 mb-1">Description</h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              {algoInfo.description}
            </p>
          </div>
          
          <div>
            <h4 className="text-xs font-medium text-gray-400 mb-1">How it Works</h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              {algoInfo.howItWorks}
            </p>
          </div>

          {/* Key Insights Section */}
          {isSorting && (
            <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4">
              <h4 className="text-xs font-medium text-blue-300 mb-2">Key Insights</h4>
              <div className="space-y-1.5 text-sm">
                {currentIndices && currentIndices.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs">Comparing:</span>
                    <span className="text-blue-400 font-mono text-xs bg-blue-500/10 px-2 py-0.5 rounded">
                      {currentIndices.join(' ↔ ')}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs">Efficiency:</span>
                  <span className={`font-medium text-xs ${comparisons > swaps * 3 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {comparisons > swaps * 3 ? 'High comparisons, low swaps' : 'Balanced operations'}
                  </span>
                </div>
                {isCompleted && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs">Status:</span>
                    <span className="text-green-400 font-medium text-xs">✓ Sorting completed!</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3">
          <div>
            <h4 className="text-xs font-medium text-gray-400 mb-2">Performance Metrics</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="metric-card">
                <div className="flex items-center gap-1.5 mb-1">
                  <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-xs text-gray-500">Comparisons</span>
                </div>
                <span className="text-lg font-bold text-blue-400">{comparisons}</span>
              </div>
              <div className="metric-card">
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-xs text-gray-500">Swaps</span>
                </div>
                <span className="text-lg font-bold text-green-400">{swaps}</span>
              </div>
            </div>
          </div>

          {/* Time Complexity */}
          <div>
            <h4 className="text-xs font-medium text-gray-400 mb-2">Complexity</h4>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs">Best Case:</span>
                <span className="text-green-400 font-mono text-xs">{algoInfo.bestCase}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs">Average Case:</span>
                <span className="text-yellow-400 font-mono text-xs">{algoInfo.averageCase}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs">Worst Case:</span>
                <span className="text-red-400 font-mono text-xs">{algoInfo.worstCase}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs">Space:</span>
                <span className="text-purple-400 font-mono text-xs">{algoInfo.space}</span>
              </div>
            </div>
          </div>

          {/* Sorted Elements */}
          {sortedIndices && sortedIndices.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-gray-400 mb-2">Sorted Elements</h4>
              <div className="flex flex-wrap gap-1">
                {sortedIndices.slice(-10).map((index) => (
                  <span 
                    key={index}
                    className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded border border-green-500/20"
                  >
                    {index}
                  </span>
                ))}
                {sortedIndices.length > 10 && (
                  <span className="px-2 py-0.5 bg-white/5 text-gray-500 text-xs rounded">
                    +{sortedIndices.length - 10} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlgorithmInfo; 