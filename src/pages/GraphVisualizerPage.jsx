import React, { useState } from 'react';
import { 
  BarChart3, Menu, PlayCircle, RotateCcw, 
  GitBranch, Info, ChevronRight, Volume2, VolumeX
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { audioSystem } from '../utils/audioSystem';
import P5Wrapper from '../components/P5Wrapper';
import { graphSketch } from '../sketches/graphSketch';
import { Graph } from '../algorithms/graph-algos/graph';
import { Dijkstra } from '../algorithms/graph-algos/dijkstra';
import { BFS } from '../algorithms/graph-algos/bfs';
import { DFS } from '../algorithms/graph-algos/dfs';
import { AStar } from '../algorithms/graph-algos/astar';
import { Prims } from '../algorithms/graph-algos/prims';

const algorithmDescriptions = {
  "Dijkstra's Algorithm": {
    description: "A greedy algorithm that finds the shortest path from a source node to all other nodes in a weighted graph.",
    howItWorks: "It uses a priority queue to always explore the nearest unvisited node, updating distances as shorter paths are found.",
    bestCase: 'O((V + E) log V) — with binary heap',
    worstCase: 'O(V²) — with array-based queue',
    space: 'O(V) — distance and predecessor arrays',
  },
  "Breadth-First Search (BFS)": {
    description: "A graph traversal algorithm that explores all neighbors at the current depth before moving to nodes at the next depth level.",
    howItWorks: "It uses a queue (FIFO) to visit nodes layer by layer, making it ideal for finding the shortest path in unweighted graphs.",
    bestCase: 'O(V + E)',
    worstCase: 'O(V + E)',
    space: 'O(V) — queue and visited set',
  },
  "Depth-First Search (DFS)": {
    description: "A graph traversal algorithm that explores as far as possible along each branch before backtracking.",
    howItWorks: "It uses a stack (LIFO) to go deep into the graph first. Useful for topological sorting, cycle detection, and connected components.",
    bestCase: 'O(V + E)',
    worstCase: 'O(V + E)',
    space: 'O(V) — stack and visited set',
  },
  "A* Search (A-Star)": {
    description: "A pathfinding algorithm that finds the shortest path by using a heuristic to guide the search.",
    howItWorks: "It combines Dijkstra's uniform-cost search with a heuristic (like Euclidean distance) that estimates the cost to reach the target, prioritizing nodes that appear closer to the goal.",
    bestCase: 'O(E)',
    worstCase: 'O(E log V)',
    space: 'O(V)',
  },
  "Prim's Algorithm (MST)": {
    description: "A greedy algorithm that finds a Minimum Spanning Tree for a weighted undirected graph.",
    howItWorks: "It starts with a single node and continuously adds the cheapest edge that connects a visited node to an unvisited node until all nodes are connected.",
    bestCase: 'O(E log V)',
    worstCase: 'O(E log V)',
    space: 'O(V)',
  },
};

const GraphVisualizerPage = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("Dijkstra's Algorithm");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [graph, setGraph] = useState(null);
  const [algorithm, setAlgorithm] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [isMuted, setIsMuted] = useState(audioSystem.isMuted);
  const navigate = useNavigate();

  const graphAlgorithms = [
    "Dijkstra's Algorithm",
    "A* Search (A-Star)",
    "Prim's Algorithm (MST)",
    "Breadth-First Search (BFS)",
    "Depth-First Search (DFS)"
  ];

  const handleStart = () => {
    const g = new Graph(8);
    setGraph(g);

    let algo;
    switch (selectedAlgorithm) {
      case "Dijkstra's Algorithm":
        algo = new Dijkstra(g, 0);
        break;
      case "Breadth-First Search (BFS)":
        algo = new BFS(g, 0);
        break;
      case "Depth-First Search (DFS)":
        algo = new DFS(g, 0);
        break;
      case "A* Search (A-Star)":
        algo = new AStar(g, 0, 4); // Target node is 4 (far right)
        break;
      case "Prim's Algorithm (MST)":
        algo = new Prims(g, 0);
        break;
      default:
        algo = new Dijkstra(g, 0);
    }
    setAlgorithm(algo);
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setAlgorithm(null);
    setGraph(null);
  };

  const info = algorithmDescriptions[selectedAlgorithm];

  const SidebarContent = () => (
    <div className="p-6">
      <h2 className="text-lg font-bold text-white mb-1">Graph Algorithms</h2>
      <p className="text-xs text-gray-500 mb-6">Select an algorithm to visualize</p>
      <nav className="space-y-1.5">
        {graphAlgorithms.map(algo => (
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

          {/* Header */}
          <div className="flex-shrink-0 mb-6">
            <div className="flex items-center gap-3 mb-1">
              <GitBranch className="w-6 h-6 text-violet-400" />
              <h1 className="text-2xl font-bold text-white">{selectedAlgorithm}</h1>
            </div>
            <p className="text-gray-500 text-sm">Interactive graph algorithm visualization</p>
          </div>

          {/* Visualization Canvas */}
          <div className="viz-canvas relative w-full mb-6">
            <P5Wrapper
              sketch={graphSketch}
              graph={graph}
              algorithm={algorithm}
              isRunning={isRunning}
              speed={speed}
            />
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
                  max="30"
                  value={speed}
                  onChange={e => setSpeed(Number(e.target.value))}
                  className="w-24"
                />
                <span className="text-xs text-purple-400 w-6">{speed}x</span>
              </label>
              <button className="btn-ghost text-sm py-2" onClick={handleReset} disabled={!graph}>
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
              <button className="btn-primary text-sm py-2" onClick={handleStart}>
                <PlayCircle className="w-4 h-4" />
                <span>Start</span>
              </button>
            </div>
          </div>

          {/* Algorithm Info */}
          {info && (
            <div className="glass-card p-5 mb-5">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-semibold text-white">Algorithm Information</h3>
                {algorithm && algorithm.isDone() && (
                  <span className="ml-auto tag tag-green text-xs">✓ Complete</span>
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
                      <span className="text-gray-500">Worst Case:</span>
                      <span className="text-red-400 font-mono text-xs">{info.worstCase}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Space:</span>
                      <span className="text-purple-400 font-mono text-xs">{info.space}</span>
                    </div>
                  </div>
                  {algorithm && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <h4 className="text-xs font-medium text-gray-400 mb-2">Live Metrics</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="metric-card">
                          <span className="text-xs text-gray-500">Steps</span>
                          <p className="text-lg font-bold text-blue-400">{algorithm.getMetrics().steps}</p>
                        </div>
                        <div className="metric-card">
                          <span className="text-xs text-gray-500">Visited</span>
                          <p className="text-lg font-bold text-green-400">{algorithm.getMetrics().visited}/{algorithm.getMetrics().total}</p>
                        </div>
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

export default GraphVisualizerPage;
