import React, { useState } from 'react';
import { 
  BarChart3, Menu, PlayCircle, RotateCcw, 
  TreePine, Info, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import P5Wrapper from '../components/P5Wrapper';
import { treeSketch } from '../sketches/treeSketch';
import { BST, TreeTraversal } from '../algorithms/tree-algos/bst';

const algorithmDescriptions = {
  "Inorder Traversal": {
    description: "Visits nodes in Left → Root → Right order. For a BST, this produces values in ascending sorted order.",
    howItWorks: "Recursively visit left subtree, process root, then recursively visit right subtree.",
    time: 'O(n) — visits each node once',
    space: 'O(h) — call stack depth equals tree height',
    output: 'Sorted order (for BST)',
  },
  "Preorder Traversal": {
    description: "Visits nodes in Root → Left → Right order. Useful for creating a copy of the tree or prefix expression trees.",
    howItWorks: "Process root first, then recursively visit left subtree, then right subtree.",
    time: 'O(n) — visits each node once',
    space: 'O(h) — call stack depth equals tree height',
    output: 'Root-first order',
  },
  "Postorder Traversal": {
    description: "Visits nodes in Left → Right → Root order. Useful for deleting trees or evaluating postfix expressions.",
    howItWorks: "Recursively visit left subtree, then right subtree, then process root last.",
    time: 'O(n) — visits each node once',
    space: 'O(h) — call stack depth equals tree height',
    output: 'Leaves-first order',
  },
  "Level Order Traversal": {
    description: "Visits nodes level by level, from top to bottom, left to right. Also known as Breadth-First traversal of a tree.",
    howItWorks: "Uses a queue to visit all nodes at each depth level before moving to the next level.",
    time: 'O(n) — visits each node once',
    space: 'O(w) — queue holds up to tree width nodes',
    output: 'Level-by-level order',
  },
};

const traversalTypeMap = {
  "Inorder Traversal": 'inorder',
  "Preorder Traversal": 'preorder',
  "Postorder Traversal": 'postorder',
  "Level Order Traversal": 'levelorder',
};

const TreeVisualizerPage = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("Inorder Traversal");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [bst, setBst] = useState(null);
  const [traversal, setTraversal] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(5);
  const navigate = useNavigate();

  const treeAlgorithms = [
    "Inorder Traversal",
    "Preorder Traversal",
    "Postorder Traversal",
    "Level Order Traversal"
  ];

  const handleStart = () => {
    const tree = BST.generateRandom(15);
    setBst(tree);
    const type = traversalTypeMap[selectedAlgorithm];
    const trav = new TreeTraversal(tree, type);
    setTraversal(trav);
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTraversal(null);
    setBst(null);
  };

  const info = algorithmDescriptions[selectedAlgorithm];

  const SidebarContent = () => (
    <div className="p-6">
      <h2 className="text-lg font-bold text-white mb-1">Tree Traversals</h2>
      <p className="text-xs text-gray-500 mb-6">Select a traversal method</p>
      <nav className="space-y-1.5">
        {treeAlgorithms.map(algo => (
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
              <TreePine className="w-6 h-6 text-emerald-400" />
              <h1 className="text-2xl font-bold text-white">{selectedAlgorithm}</h1>
            </div>
            <p className="text-gray-500 text-sm">Interactive binary tree traversal visualization</p>
          </div>

          {/* Visualization Canvas */}
          <div className="viz-canvas relative w-full mb-6">
            <P5Wrapper
              sketch={treeSketch}
              bst={bst}
              traversal={traversal}
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
                  max="25"
                  value={speed}
                  onChange={e => setSpeed(Number(e.target.value))}
                  className="w-24"
                />
                <span className="text-xs text-purple-400 w-6">{speed}x</span>
              </label>
              <button className="btn-ghost text-sm py-2" onClick={handleReset} disabled={!bst}>
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
                <Info className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Traversal Information</h3>
                {traversal && traversal.isDone() && (
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
                      <span className="text-gray-500">Time:</span>
                      <span className="text-green-400 font-mono text-xs">{info.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Space:</span>
                      <span className="text-purple-400 font-mono text-xs">{info.space}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Output:</span>
                      <span className="text-blue-400 font-mono text-xs">{info.output}</span>
                    </div>
                  </div>
                  {traversal && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <h4 className="text-xs font-medium text-gray-400 mb-2">Live Metrics</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="metric-card">
                          <span className="text-xs text-gray-500">Steps</span>
                          <p className="text-lg font-bold text-blue-400">{traversal.getMetrics().steps}</p>
                        </div>
                        <div className="metric-card">
                          <span className="text-xs text-gray-500">Visited</span>
                          <p className="text-lg font-bold text-green-400">{traversal.getMetrics().visited}/{traversal.getMetrics().total}</p>
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

export default TreeVisualizerPage;
