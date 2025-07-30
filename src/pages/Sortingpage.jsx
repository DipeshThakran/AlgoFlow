import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Menu,
  PlayCircle,
  RotateCcw
} from 'lucide-react';
import P5Wrapper from '../components/P5Wrapper';
import { bubbleSortSketch } from '../sketches/bubbleSortSketch';
import { selectionSortSketch } from '../sketches/selectionSortSketch';
import { insertionSortSketch } from '../sketches/insertionSortSketch';
import { quickSortSketch } from '../sketches/quickSortSketch';
import { heapSortSketch } from '../sketches/heapSortSketch';
import { mergeSortSketch } from '../sketches/mergeSortSketch';
import { BubbleSort } from '../algorithms/sorting-algos/bubblesort';
import { SelectionSort } from '../algorithms/sorting-algos/selectionsort';
import { InsertionSort } from '../algorithms/sorting-algos/insertionsort';
import { QuickSort } from '../algorithms/sorting-algos/quicksort';
import { HeapSort } from '../algorithms/sorting-algos/heapsort';
import { MergeSort } from '../algorithms/sorting-algos/mergesort';
import Controlbar from '../controlpannel/Controlbar';
import AlgorithmInfo from '../components/AlgorithmInfo';




const SortingVisualizerPage = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("Bubble Sort");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [values, setValues] = useState([]);
  const [sorter, setSorter] = useState(null);
  const [speed, setSpeed] = useState(5);
  const [metrics, setMetrics] = useState({
    comparisons: 0,
    swaps: 0,
    currentStep: 0,
    totalSteps: 0
  });

  const sortingAlgorithms = [
    "Bubble Sort", 
    "Merge Sort", 
    "Quick Sort", 
    "Heap Sort", 
    "Insertion Sort", 
    "Selection Sort"
  ];

  const generateRandomArray = (size = 50, min = 10, max = 350) => {
    return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
  };

  const handleStart = () => {
    const arr = generateRandomArray();
    setValues(arr.slice());
    let sorterInstance;
    switch (selectedAlgorithm) {
      case 'Bubble Sort':
        sorterInstance = new BubbleSort(arr);
        break;
      case 'Selection Sort':
        sorterInstance = new SelectionSort(arr);
        break;
      case 'Insertion Sort':
        sorterInstance = new InsertionSort(arr);
        break;
      case 'Quick Sort':
        sorterInstance = new QuickSort(arr);
        break;
      case 'Heap Sort':
        sorterInstance = new HeapSort(arr);
        break;
      case 'Merge Sort':
        sorterInstance = new MergeSort(arr);
        break;
      default:
        sorterInstance = new BubbleSort(arr);
    }
    setSorter(sorterInstance);
    setStarted(true);
    // Reset metrics
    setMetrics({
      comparisons: 0,
      swaps: 0,
      currentStep: 0,
      totalSteps: sorterInstance.getMetrics().totalSteps
    });
  };

  const handleSpeedChange = (val) => {
    setSpeed(val);
    // Optionally, pass speed to your sketch or sorting logic
  };

  // Update metrics in real-time
  useEffect(() => {
    if (sorter && started) {
      const interval = setInterval(() => {
        if (sorter && !sorter.isSorted()) {
          const currentMetrics = sorter.getMetrics();
          setMetrics(currentMetrics);
          
          // Safety check: if steps exceed total steps by too much, mark as completed
          if (currentMetrics.currentStep > currentMetrics.totalSteps * 2) {
            sorter.sorted = true;
            setStarted(false);
          }
        }
      }, 100); // Update every 100ms

      return () => clearInterval(interval);
    }
  }, [sorter, started]);

  const handleRestart = () => {
    // Force stop the current sorting process
    setStarted(false);
    // Clear the sorter and values
    setSorter(null);
    setValues([]);
    // Add a small delay to ensure the sketch has time to stop
    setTimeout(() => {
      // Generate new random array and start fresh
      const arr = generateRandomArray();
      setValues(arr.slice());
      let sorterInstance;
      switch (selectedAlgorithm) {
        case 'Bubble Sort':
          sorterInstance = new BubbleSort(arr);
          break;
        case 'Selection Sort':
          sorterInstance = new SelectionSort(arr);
          break;
        case 'Insertion Sort':
          sorterInstance = new InsertionSort(arr);
          break;
        case 'Quick Sort':
          sorterInstance = new QuickSort(arr);
          break;
        case 'Heap Sort':
          sorterInstance = new HeapSort(arr);
          break;
        case 'Merge Sort':
          sorterInstance = new MergeSort(arr);
          break;
        default:
          sorterInstance = new BubbleSort(arr);
      }
      setSorter(sorterInstance);
      setStarted(true);
      // Reset metrics
      setMetrics({
        comparisons: 0,
        swaps: 0,
        currentStep: 0,
        totalSteps: sorterInstance.getMetrics().totalSteps
      });
    }, 100);
  };

  // Reusable sidebar content
  const SidebarContent = () => (
    <div className="p-6">
      <h2 className="text-xl font-bold text-white mb-6">Sorting Algorithms</h2>
      <nav className="space-y-2">
        {sortingAlgorithms.map(algo => (
          <a
            key={algo}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setSelectedAlgorithm(algo);
              // Reset all states when changing algorithm
              setStarted(false);
              setSorter(null);
              setValues([]);
              if (isSidebarOpen) setSidebarOpen(false);
            }}
            className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              selectedAlgorithm === algo 
                ? 'bg-purple-600/30 text-purple-300' 
                : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
            }`}
          >
            {algo}
          </a>
        ))}
      </nav>
    </div>
  );

  // Choose sketch based on selectedAlgorithm
  const getSketch = () => {
    switch (selectedAlgorithm) {
      case 'Bubble Sort':
        return bubbleSortSketch;
      case 'Selection Sort':
        return selectionSortSketch;
      case 'Insertion Sort':
        return insertionSortSketch;
      case 'Quick Sort':
        return quickSortSketch;
      case 'Heap Sort':
        return heapSortSketch;
      case 'Merge Sort':
        return mergeSortSketch;
      default:
        return bubbleSortSketch;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white font-sans flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 glass-effect">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <a href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">AlgoFlow</span>
              </a>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-300 hover:text-white">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0 border-r border-gray-800 glass-effect">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar (Overlay) */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-30 md:hidden">
            <div onClick={() => setSidebarOpen(false)} className="absolute inset-0 bg-black/60"></div>
            <aside className="absolute top-0 left-0 w-64 h-full bg-[#161622] glass-effect border-r border-gray-800">
              <SidebarContent />
            </aside>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Header */}
          <div className="flex-shrink-0 mb-6">
            <h1 className="text-3xl font-bold text-white">{selectedAlgorithm}</h1>
            <p className="text-gray-400">An interactive visualization.</p>
          </div>

          {/* Algorithm Information */}
          <AlgorithmInfo
            selectedAlgorithm={selectedAlgorithm}
            isSorting={started}
            currentStep={metrics.currentStep}
            totalSteps={metrics.totalSteps}
            comparisons={metrics.comparisons}
            swaps={metrics.swaps}
            currentIndices={sorter ? sorter.getCurrentIndices() : []}
            sortedIndices={sorter ? sorter.getSortedIndices() : []}
            isCompleted={sorter ? sorter.isSorted() : false}
          />

          {/* Controls Bar */}
          <Controlbar
            onStart={handleStart}
            onRestart={handleRestart}
            onSpeedChange={handleSpeedChange}
            disabled={false}
            speed={speed}
          />

          {/* Visualization Canvas */}
          <div className="flex-1 min-h-[400px] bg-black/20 rounded-lg border border-dashed border-gray-700 flex items-start justify-center pt-8 relative">
            <P5Wrapper
              sketch={getSketch()}
              values={values}
              sorter={sorter}
              isSorting={started}
              speed={speed}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SortingVisualizerPage;
