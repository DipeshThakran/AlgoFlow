import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  BarChart3, 
  Search, 
  GitBranch, 
  TreePine,
  Sparkles
} from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';



//=========== Style Injection Hook ===========//
// Injects and removes CSS styles from the document head for a consistent look.
const useGlobalStyles = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      body {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
      }
      body::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
      }
      .glass-effect {
        background: rgba(22, 22, 34, 0.5);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .hero-glow {
        background: radial-gradient(ellipse at center, rgba(138, 43, 226, 0.15) 0%, rgba(10, 10, 20, 0) 70%);
      }
      .gradient-text {
        background: -webkit-linear-gradient(45deg, #c084fc, #a855f7, #9333ea);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .card-hover { 
        transition: transform 0.3s ease, box-shadow 0.3s ease; 
      }
      .card-hover:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(168, 85, 247, 0.2);
      }
      .animate-fade-in { 
        animation: fadeIn 0.8s ease-in-out; 
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
};


//=========== Main Algorithm Selection Page Component ===========//
export default function AlgorithmSelectionPage() {
  // Apply the global styles for UI consistency
  useGlobalStyles();
  const navigate = useNavigate();

  // Data for the algorithm category cards
  const algorithmCategories = [
    {
      title: "Sorting Algorithms",
      description: "Visualize how data gets organized step-by-step, from simple to complex methods.",
      icon: <BarChart3 className="w-8 h-8" />,
      color: "from-purple-500 to-violet-600",
      link: "/sorting-visualizer" // Example link for your routing
    },
    {
      title: "Searching Algorithms", 
      description: "Watch how different strategies find elements in a dataset with varying efficiency.",
      icon: <Search className="w-8 h-8" />,
      color: "from-blue-500 to-sky-500",
      link: "/visualizer/searching"
    },
    {
      title: "Graph Algorithms",
      description: "Explore pathfinding and traversal methods on complex node-based structures.",
      icon: <GitBranch className="w-8 h-8" />,
      color: "from-violet-500 to-fuchsia-500",
      link: "/visualizer/graph"
    },
    {
      title: "Tree Algorithms",
      description: "Learn how to navigate through hierarchical data structures systematically.", 
      icon: <TreePine className="w-8 h-8" />,
      color: "from-emerald-500 to-teal-500",
      link: "/visualizer/tree"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white font-sans">
      {/* A simple nav bar placeholder */}
      <nav className="sticky top-0 z-40 glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">AlgoFlow</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative overflow-hidden py-20 sm:py-24 lg:py-32">
        <div className="absolute inset-0 hero-glow"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          
          {/* Header Text */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="block text-white">Choose a Category</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Select an algorithm category to begin your visualization journey. Each section provides a suite of interactive tools to help you learn.
            </p>
          </div>
          
          {/* Category Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {algorithmCategories.map((category, index) => (
              <div
                key={index}
                role="button"
                tabIndex={0}
                onClick={() => window.location.href = category.link}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') window.location.href = category.link; }}
                className="card-hover glass-effect rounded-2xl p-8 group flex flex-col animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex-grow">
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-black/20`}>
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{category.title}</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">{category.description}</p>
                </div>
                <div className="mt-auto">
                  <div className="text-lg font-medium text-purple-400 group-hover:text-purple-300 flex items-center transition-colors w-full">
                    Start Visualizing
                    <ArrowRight className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
