import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  BarChart3, 
  Search, 
  GitBranch, 
  TreePine,
  Play,
  Zap,
  BookOpen,
  Users,
  ExternalLink,
  Sparkles, // For AI features
  X, // For closing modal
  LoaderCircle // For loading states
} from 'lucide-react';

/**
 * A full, modern, dark-themed landing page for an algorithm visualization tool.
 * It includes a sticky navigation bar, a dynamic hero section, detailed feature
 * and category cards, a call-to-action, and a comprehensive footer.
 *
 * This version is enhanced with two Gemini API features:
 * 1. An AI-powered explainer for each algorithm.
 * 2. An AI-powered learning path recommender.
 *
 * To make this work, you might need to add custom styles for effects like
 * 'glass-effect', 'hero-glow', 'floating-orb', and animations.
 * A sample CSS setup is provided in comments below.
 */
/*
  Add the following to your main CSS file (e.g., index.css) for the custom effects:

  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  @layer utilities {
    .glass-effect {
      @apply bg-gray-900/50 backdrop-blur-lg border-b border-gray-800;
    }

    .hero-glow {
      @apply bg-[radial-gradient(ellipse_at_center,_rgba(139,_92,_246,_0.15)_0%,_rgba(139,_92,_246,_0)_50%)]
    }

    .floating-orb {
      @apply bg-gradient-to-br from-purple-600 to-violet-700 filter blur-3xl;
    }

    .gradient-text {
      @apply text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-500;
    }
    
    .card-hover {
       @apply transition-all duration-300 hover:border-purple-500/50 hover:-translate-y-1;
       border: 1px solid transparent;
    }

    @keyframes breath {
      0%, 100% { 
        opacity: 0.1; 
        transform: scale(0.95); 
      }
      50% { 
        opacity: 0.25; 
        transform: scale(1.05); 
      }
    }
    
    .animate-breath {
      animation: breath 8s ease-in-out infinite;
    }
    
    @keyframes fade-in {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .animate-fade-in {
        animation: fade-in 1s ease-out forwards;
    }
  }
*/


//=========== AI Explanation Modal Component ===========//
const AiExplanationModal = ({ category, onClose }) => {
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAlgo, setSelectedAlgo] = useState("");

  const fetchExplanation = async (algorithmName) => {
    setSelectedAlgo(algorithmName);
    setExplanation("");
    setError("");
    setIsLoading(true);

    const prompt = `Explain the ${algorithmName} algorithm in a simple, beginner-friendly way. Focus on the core concept and how it works in 1-2 short paragraphs.`;
    
    try {
      const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = { contents: chatHistory };
      const apiKey = ""; // API key will be handled by the environment
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();
      
      if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
        setExplanation(result.candidates[0].content.parts[0].text);
      } else {
        throw new Error("Unexpected response format from the API.");
      }
    } catch (err) {
      console.error("Gemini API Error:", err);
      setError("Sorry, I couldn't fetch an explanation right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#161622] rounded-2xl p-8 max-w-2xl w-full relative glass-effect border border-purple-500/30">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
        <h3 className="text-2xl font-bold text-white mb-2">✨ AI Explanations</h3>
        <p className="text-gray-400 mb-6">Select an algorithm from the <span className="font-bold text-purple-400">{category.title}</span> category to get a simple explanation.</p>
        
        <div className="flex flex-wrap gap-3 mb-6">
          {category.algorithms.map(algo => (
            <button
              key={algo}
              onClick={() => fetchExplanation(algo)}
              disabled={isLoading}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${selectedAlgo === algo ? 'bg-purple-600 text-white' : 'bg-gray-700/50 hover:bg-gray-600/50'}`}
            >
              {algo}
            </button>
          ))}
        </div>

        <div className="bg-black/30 p-4 rounded-lg min-h-[150px]">
          {isLoading && (
            <div className="flex items-center justify-center h-full text-gray-400">
              <LoaderCircle className="w-6 h-6 animate-spin mr-2" />
              <span>Generating explanation...</span>
            </div>
          )}
          {error && <p className="text-red-400">{error}</p>}
          {explanation && <p className="text-gray-300 whitespace-pre-wrap">{explanation}</p>}
        </div>
      </div>
    </div>
  );
};


//=========== AI Learning Path Component ===========//
const LearningPath = () => {
  const [path, setPath] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLearningPath = async () => {
    setIsLoading(true);
    setError("");
    setPath(null);

    const prompt = "Generate a beginner's learning path for Data Structures and Algorithms. Provide 5 key steps, each with a title and a short 1-sentence description. Start from the very basics.";

    try {
      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              learningPath: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    step: { type: "STRING" },
                    title: { type: "STRING" },
                    description: { type: "STRING" },
                  },
                  required: ["step", "title", "description"]
                }
              }
            }
          }
        }
      };
      const apiKey = ""; // API key will be handled by the environment
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();
      
      if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
        const parsedJson = JSON.parse(result.candidates[0].content.parts[0].text);
        setPath(parsedJson.learningPath);
      } else {
        throw new Error("Unexpected response format from the API.");
      }
    } catch (err) {
      console.error("Gemini API Error:", err);
      setError("Sorry, I couldn't generate a learning path right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="ai-path" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-violet-600/10"></div>
      <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Don't know where to start?
        </h2>
        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
          Let our AI suggest a personalized learning path to guide you from beginner to expert.
        </p>
        <button
          onClick={fetchLearningPath}
          disabled={isLoading}
          className="group bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center justify-center mx-auto space-x-2 border border-purple-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <LoaderCircle className="w-6 h-6 animate-spin" />
          ) : (
            <Sparkles className="w-6 h-6" />
          )}
          <span>{isLoading ? 'Generating...' : '✨ Suggest a Learning Path for Me'}</span>
        </button>

        {error && <p className="text-red-400 mt-6">{error}</p>}

        {path && (
          <div className="mt-12 text-left space-y-4 animate-fade-in">
            {path.map((item, index) => (
              <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h4 className="font-bold text-purple-400">{item.step}: {item.title}</h4>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};


const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleExplainClick = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const algorithmCategories = [
    {
      title: "Sorting Algorithms",
      description: "Visualize how data gets organized step by step",
      icon: <BarChart3 className="w-6 h-6" />,
      algorithms: ["Bubble Sort", "Merge Sort", "Quick Sort", "Heap Sort"],
      color: "from-purple-500 to-violet-600",
    },
    {
      title: "Searching Algorithms", 
      description: "Watch how algorithms find elements efficiently",
      icon: <Search className="w-6 h-6" />,
      algorithms: ["Binary Search", "Linear Search", "Jump Search"],
      color: "from-blue-500 to-purple-600",
    },
    {
      title: "Graph Algorithms",
      description: "Explore pathfinding and graph traversal methods",
      icon: <GitBranch className="w-6 h-6" />,
      algorithms: ["Dijkstra's Algorithm", "Breadth-First Search (BFS)", "Depth-First Search (DFS)", "A* Search"],
      color: "from-violet-500 to-purple-600",
    },
    {
      title: "Tree Traversals",
      description: "Navigate through tree structures systematically", 
      icon: <TreePine className="w-6 h-6" />,
      algorithms: ["Inorder Traversal", "Preorder Traversal", "Postorder Traversal", "Level Order Traversal"],
      color: "from-indigo-500 to-purple-600",
    }
  ];

  const features = [
    {
      icon: <Play className="w-5 h-5" />,
      title: "Interactive Visualizations",
      description: "Step through algorithms at your own pace with intuitive controls"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Real-time Execution", 
      description: "Watch algorithms execute with highlighted steps and comparisons"
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Educational Content",
      description: "Learn with detailed explanations and complexity analysis"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Beginner Friendly",
      description: "Perfect for students and developers at any level"
    }
  ];

  return (
    <>
      {isModalOpen && <AiExplanationModal category={selectedCategory} onClose={() => setIsModalOpen(false)} />}
      <div className="min-h-screen bg-[#0a0a14] text-white font-sans">
        {/* Navigation */}
        <nav className="sticky top-0 z-40 glass-effect">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">AlgoFlow</span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <a href="#algorithms" className="text-gray-300 hover:text-white transition-colors">Algorithms</a>
                <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
                <button className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border border-purple-500/20">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 hero-glow"></div>
          <div className="absolute top-20 left-20 w-72 h-72 floating-orb animate-breath"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 floating-orb animate-breath" style={{animationDelay: '4s'}}></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="text-center animate-fade-in">
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  AlgoFlow 2025 Release
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                <span className="block text-white">Visualize DSA</span>
                <span className="block gradient-text">Algorithms Instantly</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                An interactive way to understand how algorithms work. The default tool among students 
                now also powers a wide range of educational institutions, including universities, 
                coding bootcamps, and online learning platforms.
              </p>
              
              <div className="flex justify-center items-center mb-16">
                <button className="group bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center space-x-2 border border-purple-500/20">
                  <span>Start Visualizing</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Algorithm Categories */}
        <section id="algorithms" className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Algorithm Categories
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Dive deep into different types of algorithms with interactive visualizations
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {algorithmCategories.map((category, index) => (
                <div 
                  key={index}
                  className="card-hover glass-effect rounded-2xl p-6 group flex flex-col"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="flex-grow">
                    <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{category.title}</h3>
                    <p className="text-gray-300 mb-4 text-sm leading-relaxed">{category.description}</p>
                    <div className="space-y-2">
                      {category.algorithms.map((algo, algoIndex) => (
                        <div key={algoIndex} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                          <span className="text-sm text-gray-400">{algo}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-700/50">
                    <button onClick={() => handleExplainClick(category)} className="text-sm font-medium text-purple-400 group-hover:text-purple-300 flex items-center transition-colors w-full">
                      <Sparkles className="w-4 h-4 mr-2" />
                      ✨ Explain with AI
                      <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Why Choose AlgoFlow?
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Learn algorithms the visual way with our comprehensive platform
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center group">
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Learning Path Section */}
        <LearningPath />

        {/* Footer */}
        <footer id="about" className="border-t border-gray-800 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">AlgoFlow</span>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  Making algorithms accessible through interactive visualizations. 
                  Learn, explore, and master data structures and algorithms.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Algorithms</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Sorting</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Searching</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Graph</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Tree</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Resources</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Examples</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 AlgoFlow. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
