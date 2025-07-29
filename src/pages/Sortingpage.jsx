import React, { useState } from 'react';
import { 
  BarChart3, 
  Menu,
  PlayCircle 
} from 'lucide-react';
import P5Wrapper from '../components/P5Wrapper';
import { bubbleSortSketch } from '../sketches/bubbleSortSketch';
import { BubbleSort } from '../algorithms/sorting-algos/bubblesort';



const SortingVisualizerPage = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("Bubble Sort");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [values, setValues] = useState([]);
  const [sorter, setSorter] = useState(null);

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
    setSorter(new BubbleSort(arr));
    setStarted(true);
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
              setStarted(false); // Reset started when changing algorithm
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
    if (selectedAlgorithm === "Bubble Sort") return bubbleSortSketch;
    // Add more algorithms here as needed
    return null;
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

          {/* Controls Bar */}
          <div className="flex-shrink-0 bg-gray-900/50 border border-gray-800 rounded-lg p-4 mb-6 flex items-center justify-between">
            <span className="text-sm text-gray-400">Controls</span>
            <button
              className="group bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-2 border border-purple-500/20"
              onClick={handleStart}
              disabled={selectedAlgorithm !== "Bubble Sort"}
            >
              <PlayCircle className="w-5 h-5"/>
              <span>Start</span>
            </button>
          </div>

          {/* Visualization Canvas */}
          <div className="flex-1 bg-black/20 rounded-lg border border-dashed border-gray-700 flex items-center justify-center relative">
          <P5Wrapper
            sketch={selectedAlgorithm === "Bubble Sort" ? bubbleSortSketch : () => {}}
            values={values}
            sorter={sorter}
            isSorting={started}
          />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SortingVisualizerPage;
