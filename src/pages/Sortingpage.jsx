import React, { useState, useEffect } from 'react';
import { audioSystem } from '../utils/audioSystem';
import { 
  Play, Square, RotateCcw, FastForward, 
  Settings2, Activity, Hash, BarChart3, Menu, ChevronRight, X, Volume2, VolumeX
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import SortingRace from '../components/SortingRace';

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
  const [isMuted, setIsMuted] = useState(audioSystem.isMuted);
  const navigate = useNavigate();

  const sortingAlgorithms = [
    "Bubble Sort", 
    "Selection Sort", 
    "Insertion Sort", 
    "Merge Sort", 
    "Quick Sort", 
    "Heap Sort"
  ];

  const generateRandomArray = (size = 50, min = 10, max = 350) => {
    return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
  };

  const createSorter = (algorithm, arr) => {
    switch (algorithm) {
      case 'Bubble Sort': return new BubbleSort(arr);
      case 'Selection Sort': return new SelectionSort(arr);
      case 'Insertion Sort': return new InsertionSort(arr);
      case 'Quick Sort': return new QuickSort(arr);
      case 'Heap Sort': return new HeapSort(arr);
      case 'Merge Sort': return new MergeSort(arr);
      default: return new BubbleSort(arr);
    }
  };

  const handleStart = () => {
    const arr = generateRandomArray();
    setValues(arr.slice());
    const sorterInstance = createSorter(selectedAlgorithm, arr);
    setSorter(sorterInstance);
    setStarted(true);
    setMetrics({
      comparisons: 0,
      swaps: 0,
      currentStep: 0,
      totalSteps: sorterInstance.getMetrics().totalSteps
    });
  };

  const handleSpeedChange = (val) => {
    setSpeed(val);
  };

  // Update metrics in real-time
  useEffect(() => {
    if (sorter && started) {
      const interval = setInterval(() => {
        if (sorter && !sorter.isSorted()) {
          const currentMetrics = sorter.getMetrics();
          setMetrics(currentMetrics);
          if (currentMetrics.currentStep > currentMetrics.totalSteps * 2) {
            sorter.sorted = true;
            setStarted(false);
          }
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [sorter, started]);

  const handleRestart = () => {
    setStarted(false);
    setSorter(null);
    setValues([]);
    setTimeout(() => {
      const arr = generateRandomArray();
      setValues(arr.slice());
      const sorterInstance = createSorter(selectedAlgorithm, arr);
      setSorter(sorterInstance);
      setStarted(true);
      setMetrics({
        comparisons: 0,
        swaps: 0,
        currentStep: 0,
        totalSteps: sorterInstance.getMetrics().totalSteps
      });
    }, 100);
  };

  const SidebarContent = () => (
    <div className="p-6">
      <h2 className="text-lg font-bold text-white mb-1">Sorting Algorithms</h2>
      <p className="text-xs text-gray-500 mb-6">Select an algorithm to visualize</p>
      <nav className="space-y-1.5">
        {sortingAlgorithms.map(algo => (
          <button
            key={algo}
            onClick={() => {
              setSelectedAlgorithm(algo);
              setStarted(false);
              setSorter(null);
              setValues([]);
              if (isSidebarOpen) setSidebarOpen(false);
            }}
            className={`sidebar-item ${selectedAlgorithm === algo ? 'active' : ''}`}
          >
            {algo}
          </button>
        ))}
        
        <div className="h-px bg-white/10 my-2"></div>
        <button
          onClick={() => {
            setSelectedAlgorithm('Race Mode');
            setStarted(false);
            setSorter(null);
            setValues([]);
            if (isSidebarOpen) setSidebarOpen(false);
          }}
          className={`sidebar-item ${selectedAlgorithm === 'Race Mode' ? 'active' : ''}`}
        >
          Race Mode 🏎️
        </button>
      </nav>
    </div>
  );

  const getSketch = () => {
    switch (selectedAlgorithm) {
      case 'Bubble Sort': return bubbleSortSketch;
      case 'Selection Sort': return selectionSortSketch;
      case 'Insertion Sort': return insertionSortSketch;
      case 'Quick Sort': return quickSortSketch;
      case 'Heap Sort': return heapSortSketch;
      case 'Merge Sort': return mergeSortSketch;
      default: return bubbleSortSketch;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-white font-sans flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 nav-blur">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/')} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight">AlgoFlow</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  const muted = audioSystem.toggleMute();
                  setIsMuted(muted);
                }} 
                className="text-gray-300 hover:text-white p-2 md:mr-2"
                title={isMuted ? "Unmute Sounds" : "Mute Sounds"}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <div className="md:hidden">
                <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-300 hover:text-white p-2">
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0 border-r border-white/5 bg-[var(--bg-secondary)]">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-30 md:hidden">
            <div onClick={() => setSidebarOpen(false)} className="absolute inset-0 bg-black/60"></div>
            <aside className="absolute top-0 left-0 w-64 h-full bg-[var(--bg-secondary)] border-r border-white/5">
              <SidebarContent />
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Breadcrumb */}
          <div className="breadcrumb mb-2">
            <a href="/" onClick={e => { e.preventDefault(); navigate('/'); }}>Home</a>
            <ChevronRight className="separator w-3.5 h-3.5" />
            <a href="/algo-selection" onClick={e => { e.preventDefault(); navigate('/algo-selection'); }}>Categories</a>
            <ChevronRight className="separator w-3.5 h-3.5" />
            <span className="current">{selectedAlgorithm}</span>
          </div>

          {selectedAlgorithm === 'Race Mode' ? (
            <SortingRace />
          ) : (
            <>
              {/* Header */}
              <div className="flex-shrink-0 mb-6">
                <div className="flex items-center gap-3 mb-1">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                  <h1 className="text-2xl font-bold text-white">{selectedAlgorithm}</h1>
                </div>
                <p className="text-gray-500 text-sm">Interactive sorting algorithm visualization</p>
              </div>

              {/* Visualization Canvas */}
              <div className="viz-canvas relative w-full mb-6">
                <P5Wrapper
                  sketch={getSketch()}
                  values={values}
                  sorter={sorter}
                  isSorting={started}
                  speed={speed}
                  height={300}
                />
              </div>

              {/* Controls Bar */}
              <div className="mb-6">
                <Controlbar
                  onStart={handleStart}
                  onRestart={handleRestart}
                  onSpeedChange={handleSpeedChange}
                  disabled={false}
                  speed={speed}
                />
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
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default SortingVisualizerPage;
