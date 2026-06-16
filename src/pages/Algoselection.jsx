import React, { useEffect } from 'react';
import { 
  ArrowRight, 
  BarChart3, 
  Search, 
  GitBranch, 
  TreePine,
  ArrowLeft,
  Code2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* =========================================
   Scroll Animation Hook
   ========================================= */
const useScrollAnimation = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.scroll-animate, .scroll-animate-scale');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);
};

/* =========================================
   Main Component
   ========================================= */
export default function AlgorithmSelectionPage() {
  useScrollAnimation();
  const navigate = useNavigate();

  const algorithmCategories = [
    {
      title: "Sorting Algorithms",
      description: "Visualize how data gets organized step-by-step, from simple bubble sort to efficient merge sort and quick sort.",
      icon: <BarChart3 className="w-8 h-8" />,
      color: "from-purple-500 to-violet-600",
      shadowColor: "shadow-purple-500/20",
      count: 6,
      link: "/sorting-visualizer"
    },
    {
      title: "Searching Algorithms", 
      description: "Watch how different search strategies find elements in a dataset with varying efficiency and approaches.",
      icon: <Search className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500",
      shadowColor: "shadow-blue-500/20",
      count: 3,
      link: "/searching-visualizer"
    },
    {
      title: "Graph Algorithms",
      description: "Explore pathfinding and traversal methods on complex node-based graph structures with weighted edges.",
      icon: <GitBranch className="w-8 h-8" />,
      color: "from-violet-500 to-fuchsia-500",
      shadowColor: "shadow-violet-500/20",
      count: 5,
      link: "/visualizer/graph"
    },
    {
      title: "Tree Algorithms",
      description: "Learn how to navigate through hierarchical binary tree data structures using different traversal orders.", 
      icon: <TreePine className="w-8 h-8" />,
      color: "from-emerald-500 to-teal-500",
      shadowColor: "shadow-emerald-500/20",
      count: 4,
      link: "/visualizer/tree"
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-white font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 nav-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-3 group"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight">AlgoFlow</span>
              </button>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="btn-ghost text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 hero-glow"></div>
        {/* Floating orbs */}
        <div className="absolute top-20 right-20 w-64 h-64 floating-orb animate-breath opacity-40"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 floating-orb animate-breath opacity-30" style={{ animationDelay: '3s' }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          
          {/* Breadcrumb */}
          <div className="breadcrumb animate-fade-in-down">
            <a href="/" onClick={e => { e.preventDefault(); navigate('/'); }}>Home</a>
            <ChevronRight className="separator w-3.5 h-3.5" />
            <span className="current">Choose a Category</span>
          </div>

          {/* Header Text */}
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="tag tag-purple mb-6 inline-flex">
              <Code2 className="w-4 h-4" />
              Algorithm Library
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 tracking-tight">
              <span className="text-white">Choose a </span>
              <span className="gradient-text">Category</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Select an algorithm category to begin your visualization journey. Each section provides interactive tools to help you learn.
            </p>
          </div>
          
          {/* Category Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {algorithmCategories.map((category, index) => (
              <div
                key={index}
                role="button"
                tabIndex={0}
                onClick={() => navigate(category.link)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(category.link); }}
                className={`scroll-animate glass-card card-gradient-border p-8 group flex flex-col cursor-pointer`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-all duration-300 shadow-lg ${category.shadowColor}`}>
                      {category.icon}
                    </div>
                    <span className="tag tag-purple text-xs">
                      {category.count} algorithms
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-200 transition-colors">{category.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{category.description}</p>
                </div>
                <div className="mt-8 pt-5 border-t border-white/5">
                  <div className="text-lg font-semibold text-purple-400 group-hover:text-purple-300 flex items-center transition-colors">
                    <span>Start Visualizing</span>
                    <ArrowRight className="w-5 h-5 ml-auto group-hover:translate-x-2 transition-transform duration-300" />
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

// Needed for breadcrumb icon import
function ChevronRight({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
    </svg>
  );
}
