import React from 'react';
import { 
  ArrowRight, 
  BarChart3, 
  Search, 
  GitBranch, 
  TreePine,
  Play,
  Zap,
  BookOpen,
  Users
} from 'lucide-react';

const LandingPage = () => {
  const algorithmCategories = [
    {
      title: "Sorting Algorithms",
      description: "Visualize how data gets organized step by step",
      icon: <BarChart3 className="w-8 h-8" />,
      algorithms: ["Bubble Sort", "Merge Sort", "Quick Sort", "Heap Sort"],
      color: "from-blue-500 to-purple-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Searching Algorithms",
      description: "Watch how algorithms find elements efficiently",
      icon: <Search className="w-8 h-8" />,
      algorithms: ["Binary Search", "Linear Search", "Jump Search"],
      color: "from-green-500 to-teal-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      title: "Graph Algorithms",
      description: "Explore pathfinding and graph traversal methods",
      icon: <GitBranch className="w-8 h-8" />,
      algorithms: ["Dijkstra", "BFS", "DFS", "A* Search"],
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    {
      title: "Tree Traversals",
      description: "Navigate through tree structures systematically",
      icon: <TreePine className="w-8 h-8" />,
      algorithms: ["Inorder", "Preorder", "Postorder", "Level Order"],
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    }
  ];

  const features = [
    {
      icon: <Play className="w-6 h-6" />,
      title: "Interactive Visualizations",
      description: "Step through algorithms at your own pace with play, pause, and speed controls"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Execution",
      description: "Watch algorithms execute in real-time with highlighted steps and comparisons"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Educational Content",
      description: "Learn with detailed explanations, complexity analysis, and use cases"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Beginner Friendly",
      description: "Perfect for students, developers, and anyone curious about algorithms"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">AlgoFlow</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#algorithms" className="text-gray-600 hover:text-gray-900 transition-colors">Algorithms</a>
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              Visualize DSA
              <span className="block gradient-text">Algorithms Instantly</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              An interactive way to understand how algorithms work. 
              Watch sorting, searching, and graph algorithms come to life through beautiful visualizations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all duration-300 flex items-center space-x-2">
                <span>Start Visualizing</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-300">
                Explore Algorithms
              </button>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-bounce-gentle"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-green-200 rounded-full opacity-20 animate-bounce-gentle" style={{animationDelay: '2s'}}></div>
      </section>

      {/* Algorithm Categories */}
      <section id="algorithms" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Algorithm Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Dive deep into different types of algorithms with interactive visualizations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {algorithmCategories.map((category, index) => (
              <div 
                key={index}
                className={`card-hover bg-white rounded-2xl p-6 border-2 ${category.borderColor} ${category.bgColor} cursor-pointer group`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="space-y-2">
                  {category.algorithms.map((algo, algoIndex) => (
                    <div key={algoIndex} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-sm text-gray-700">{algo}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700 flex items-center">
                    Explore <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose AlgoFlow?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learn algorithms the visual way with our comprehensive platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Master Algorithms?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students and developers who are learning algorithms the visual way
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl">
            Start Learning Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">AlgoFlow</span>
              </div>
              <p className="text-gray-400 mb-4">
                Making algorithms accessible through interactive visualizations. 
                Learn, explore, and master data structures and algorithms.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Algorithms</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sorting</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Searching</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Graph</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tree</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
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
  );
};

export default LandingPage;