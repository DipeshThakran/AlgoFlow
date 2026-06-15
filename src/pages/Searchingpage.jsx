import React, { useState, useEffect } from 'react';
import { BarChart3, Menu, PlayCircle, RotateCcw, Search, Info, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import P5Wrapper from '../components/P5Wrapper';
import { binarySearchSketch } from '../sketches/binarySearchSketch';
import { linearSearchSketch } from '../sketches/linearSearchSketch';
import { jumpSearchSketch } from '../sketches/jumpSearchSketch';
import { BinarySearch } from '../algorithms/seach-algos/binarysearch';
import { LinearSearch } from '../algorithms/seach-algos/linearsearch';
import { JumpSearch } from '../algorithms/seach-algos/jumpsearch';

const searchDescriptions = {
  'Binary Search': {
    description: 'An efficient search algorithm that works on sorted arrays by repeatedly dividing the search interval in half.',
    howItWorks: 'Compares the target with the middle element. If not equal, eliminates half the remaining elements based on whether target is larger or smaller.',
    bestCase: 'O(1) — target is at middle',
    averageCase: 'O(log n) — logarithmic',
    worstCase: 'O(log n) — logarithmic',
    space: 'O(1) — constant extra space',
    requirement: 'Requires sorted array',
  },
  'Linear Search': {
    description: 'The simplest search algorithm that checks each element sequentially until the target is found or the array ends.',
    howItWorks: 'Iterates through each element from start to end, comparing each to the target value. Works on both sorted and unsorted arrays.',
    bestCase: 'O(1) — target is first element',
    averageCase: 'O(n) — linear',
    worstCase: 'O(n) — target is last or absent',
    space: 'O(1) — constant extra space',
    requirement: 'Works on any array',
  },
  'Jump Search': {
    description: 'A search algorithm for sorted arrays that works by jumping ahead by fixed steps and then performing a linear search in the block.',
    howItWorks: 'Jumps forward by √n steps until a block containing the target is found, then performs linear search within that block.',
    bestCase: 'O(1) — target is at first jump',
    averageCase: 'O(√n) — square root',
    worstCase: 'O(√n) — square root',
    space: 'O(1) — constant extra space',
    requirement: 'Requires sorted array',
  },
};

const SearchingVisualizerPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [values, setValues] = useState([]);
  const [target, setTarget] = useState('');
  const [speed, setSpeed] = useState(5);
  const [searcher, setSearcher] = useState(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('Binary Search');
  const navigate = useNavigate();

  const searchingAlgorithms = [
    "Binary Search",
    "Linear Search", 
    "Jump Search"
  ];

  const generateRandomArray = (min = 10, max = 99) => {
    const size = window.innerWidth < 640 ? 12 : 30;
    return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
  };

  const generateNewArray = () => {
    const arr = generateRandomArray();
    setValues(selectedAlgorithm === 'Linear Search' ? arr : arr.slice().sort((a, b) => a - b));
    setSearcher(null);
    setStarted(false);
  };

  useEffect(() => {
    generateNewArray();
  }, [selectedAlgorithm]);

  const handleStart = () => {
    if (!target || isNaN(Number(target))) return;

    let newSearcher;
    
    switch (selectedAlgorithm) {
      case 'Binary Search':
        newSearcher = new BinarySearch(values, Number(target));
        break;
      case 'Linear Search':
        newSearcher = new LinearSearch(values, Number(target));
        break;
      case 'Jump Search':
        newSearcher = new JumpSearch(values, Number(target));
        break;
      default:
        newSearcher = new BinarySearch(values, Number(target));
    }
    
    setSearcher(newSearcher);
    setStarted(true);
  };

  const handleReset = () => {
    setStarted(false);
    setSearcher(null);
    setTarget('');
  };

  const getCurrentSketch = () => {
    switch (selectedAlgorithm) {
      case 'Binary Search': return binarySearchSketch;
      case 'Linear Search': return linearSearchSketch;
      case 'Jump Search': return jumpSearchSketch;
      default: return binarySearchSketch;
    }
  };

  const info = searchDescriptions[selectedAlgorithm];

  const SidebarContent = () => (
    <div className="p-6">
      <h2 className="text-lg font-bold text-white mb-1">Searching Algorithms</h2>
      <p className="text-xs text-gray-500 mb-6">Select an algorithm to visualize</p>
      <nav className="space-y-1.5">
        {searchingAlgorithms.map(algo => (
          <button
            key={algo}
            onClick={() => {
              setSelectedAlgorithm(algo);
              handleReset();
              if (isSidebarOpen) setSidebarOpen(false);
            }}
            className={`sidebar-item ${selectedAlgorithm === algo ? 'active' : ''}`}
          >
            {algo}
          </button>
        ))}
      </nav>
    </div>
  );

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
            <div className="md:hidden">
              <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-300 hover:text-white p-2">
                <Menu className="w-5 h-5" />
              </button>
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

          {/* Header */}
          <div className="flex-shrink-0 mb-6">
            <div className="flex items-center gap-3 mb-1">
              <Search className="w-6 h-6 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">{selectedAlgorithm}</h1>
            </div>
            <p className="text-gray-500 text-sm">Interactive searching algorithm visualization</p>
          </div>

          {/* Visualization Canvas */}
          <div className="viz-canvas relative w-full p-4 mb-6 glass-card">
            <P5Wrapper
              sketch={getCurrentSketch()}
              values={values}
              target={target ? Number(target) : null}
              searcher={searcher}
              isSearching={started}
              speed={speed}
              height={300}
            />
            {/* Show array values below canvas */}
            {values.length > 0 && (
              <div className="mt-4 text-sm text-center max-w-xl mx-auto pb-4">
                <span className="font-medium text-purple-400">Array: </span>
                <span className="text-gray-500 font-mono text-xs">{values.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex-shrink-0 glass-card p-4 mb-6 flex items-center justify-between gap-4 flex-wrap">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Controls</span>
            <div className="flex items-center gap-3 flex-wrap">
              <label className="flex items-center gap-2 text-sm text-gray-400">
                Speed
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={speed}
                  onChange={e => setSpeed(Number(e.target.value))}
                  className="w-24"
                />
                <span className="text-xs text-purple-400 w-6">{speed}x</span>
              </label>
              <input
                type="number"
                placeholder="Target value (10-99)"
                value={target}
                onChange={e => setTarget(e.target.value)}
                disabled={started}
                className="w-44"
              />
              <button
                className="btn-primary text-sm py-2"
                onClick={handleStart}
                disabled={started || !target}
              >
                <PlayCircle className="w-4 h-4"/>
                <span>Start</span>
              </button>
              <button
                className="btn-ghost text-sm py-2"
                onClick={handleReset}
                disabled={!started && !target}
              >
                <RotateCcw className="w-4 h-4"/>
                <span>Reset</span>
              </button>
              <button
                className="btn-ghost text-sm py-2"
                onClick={generateNewArray}
                disabled={started}
              >
                <RotateCcw className="w-4 h-4"/>
                <span>New Array</span>
              </button>
            </div>
          </div>

          {/* Algorithm Info */}
          {info && (
            <div className="glass-card p-5 mb-5">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-white">Algorithm Information</h3>
                {searcher && searcher.isDone() && (
                  <span className={`ml-auto tag text-xs ${searcher.isFound() ? 'tag-green' : 'tag-purple'}`}>
                    {searcher.isFound() ? `✓ Found at index ${searcher.getResult()}` : '✗ Not found'}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-medium text-gray-400 mb-1">Description</h4>
                    <p className="text-sm text-gray-300 leading-relaxed">{info.description}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-400 mb-1">How It Works</h4>
                    <p className="text-sm text-gray-300 leading-relaxed">{info.howItWorks}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xs font-medium text-gray-400 mb-1">Complexity</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Best Case:</span>
                      <span className="text-green-400 font-mono text-xs">{info.bestCase}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Average Case:</span>
                      <span className="text-yellow-400 font-mono text-xs">{info.averageCase}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Worst Case:</span>
                      <span className="text-red-400 font-mono text-xs">{info.worstCase}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Space:</span>
                      <span className="text-purple-400 font-mono text-xs">{info.space}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Requirement:</span>
                      <span className="text-blue-400 font-mono text-xs">{info.requirement}</span>
                    </div>
                  </div>
                  {searcher && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <h4 className="text-xs font-medium text-gray-400 mb-2">Live Metrics</h4>
                      <div className="metric-card">
                        <span className="text-xs text-gray-500">Steps</span>
                        <p className="text-lg font-bold text-blue-400">{searcher.getSteps()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchingVisualizerPage;