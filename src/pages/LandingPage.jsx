import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Sparkles,
  X,
  LoaderCircle,
  ChevronRight,
  Code2,
  Layers,
  MousePointerClick
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

    const elements = document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);
};

/* =========================================
   Animated Particle Background
   ========================================= */
const ParticleField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${p.opacity})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x;
          const dy = p.y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.06 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
};

/* =========================================
   Animated Counter
   ========================================= */
const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = 0;
          const startTime = performance.now();
          const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * (end - start) + start));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

/* =========================================
   AI Explanation Modal
   ========================================= */
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
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}>
      <div 
        className="bg-[#111122] rounded-2xl p-8 max-w-2xl w-full relative border border-purple-500/20 shadow-2xl shadow-purple-500/10"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">AI Explanations</h3>
        </div>
        <p className="text-gray-400 mb-6 ml-[52px]">Select an algorithm from <span className="font-semibold text-purple-400">{category.title}</span> to get a simple explanation.</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {category.algorithms.map(algo => (
            <button
              key={algo}
              onClick={() => fetchExplanation(algo)}
              disabled={isLoading}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedAlgo === algo 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' 
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5 hover:border-purple-500/30'
              }`}
            >
              {algo}
            </button>
          ))}
        </div>

        <div className="bg-black/40 p-5 rounded-xl min-h-[150px] border border-white/5">
          {isLoading && (
            <div className="flex items-center justify-center h-full text-gray-400 py-12">
              <LoaderCircle className="w-6 h-6 animate-spin mr-3 text-purple-400" />
              <span>Generating explanation...</span>
            </div>
          )}
          {error && <p className="text-red-400">{error}</p>}
          {explanation && <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{explanation}</p>}
          {!isLoading && !error && !explanation && (
            <p className="text-gray-500 text-center py-12">Click an algorithm above to get an AI-powered explanation.</p>
          )}
        </div>
      </div>
    </div>
  );
};


/* =========================================
   AI Learning Path Component
   ========================================= */
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
    <section id="ai-path" className="py-24 relative section-glow">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-600/5 to-transparent"></div>
      <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="scroll-animate">
          <span className="tag tag-purple mb-6 inline-flex">
            <Sparkles className="w-4 h-4" />
            AI-Powered
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Don't know where to start?
          </h2>
          <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
            Let our AI suggest a personalized learning path to guide you from beginner to expert.
          </p>
          <button
            onClick={fetchLearningPath}
            disabled={isLoading}
            className="btn-primary text-lg mx-auto disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <LoaderCircle className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            <span>{isLoading ? 'Generating...' : 'Suggest a Learning Path'}</span>
          </button>
        </div>

        {error && <p className="text-red-400 mt-6">{error}</p>}

        {path && (
          <div className="mt-14 text-left space-y-4">
            {path.map((item, index) => (
              <div 
                key={index} 
                className="p-5 glass-card flex items-start gap-4 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">{item.title}</h4>
                  <p className="text-gray-400 mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};


/* =========================================
   Main Landing Page
   ========================================= */
const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useScrollAnimation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleExplainClick = (e, category) => {
    e.stopPropagation();
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const algorithmCategories = [
    {
      title: "Sorting Algorithms",
      description: "Visualize how data gets organized step by step with beautiful animations",
      icon: <BarChart3 className="w-6 h-6" />,
      algorithms: ["Bubble Sort", "Merge Sort", "Quick Sort", "Heap Sort", "Insertion Sort", "Selection Sort"],
      color: "from-purple-500 to-violet-600",
      link: "/sorting-visualizer",
    },
    {
      title: "Searching Algorithms", 
      description: "Watch how algorithms find elements efficiently through different strategies",
      icon: <Search className="w-6 h-6" />,
      algorithms: ["Binary Search", "Linear Search", "Jump Search"],
      color: "from-blue-500 to-cyan-500",
      link: "/searching-visualizer",
    },
    {
      title: "Graph Algorithms",
      description: "Explore pathfinding and graph traversal on interactive node-based structures",
      icon: <GitBranch className="w-6 h-6" />,
      algorithms: ["Dijkstra's Algorithm", "A* Search", "Prim's Algorithm", "BFS", "DFS"],
      color: "from-violet-500 to-fuchsia-500",
      link: "/visualizer/graph",
    },
    {
      title: "Tree Traversals",
      description: "Navigate through tree structures systematically with visual step tracking", 
      icon: <TreePine className="w-6 h-6" />,
      algorithms: ["Inorder Traversal", "Preorder Traversal", "Postorder Traversal", "Level Order Traversal"],
      color: "from-emerald-500 to-teal-500",
      link: "/visualizer/tree",
    }
  ];

  const features = [
    {
      icon: <Play className="w-6 h-6" />,
      title: "Interactive Visualizations",
      description: "Step through algorithms at your own pace with intuitive play/pause controls and speed adjustment",
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Metrics", 
      description: "Watch comparisons, swaps, and steps update live as algorithms execute frame by frame",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Educational Content",
      description: "Learn with detailed descriptions, complexity analysis, and AI-powered explanations",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Beginner Friendly",
      description: "Designed for students and developers at any level — no prior knowledge required",
      color: "from-emerald-500 to-teal-500"
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Choose a Category",
      description: "Pick from sorting, searching, graph, or tree algorithms",
      icon: <Layers className="w-6 h-6" />
    },
    {
      step: "02",
      title: "Select an Algorithm",
      description: "Browse the sidebar to pick a specific algorithm to visualize",
      icon: <Code2 className="w-6 h-6" />
    },
    {
      step: "03",
      title: "Watch & Learn",
      description: "Hit play, adjust speed, and observe the algorithm step by step",
      icon: <MousePointerClick className="w-6 h-6" />
    }
  ];

  return (
    <>
      {isModalOpen && <AiExplanationModal category={selectedCategory} onClose={() => setIsModalOpen(false)} />}
      <ParticleField />
      <div className="min-h-screen text-white font-sans relative z-10">
        {/* Navigation */}
        <nav className={`sticky top-0 z-40 transition-all duration-500 ${scrolled ? 'nav-blur shadow-lg shadow-black/20' : 'bg-transparent border-b border-transparent'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3 animate-fade-in-down">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight">AlgoFlow</span>
              </div>
              <div className="hidden md:flex items-center gap-8 animate-fade-in-down">
                <a href="#algorithms" className="nav-link text-sm font-medium">Algorithms</a>
                <a href="#features" className="nav-link text-sm font-medium">Features</a>
                <a href="#how-it-works" className="nav-link text-sm font-medium">How It Works</a>
                <button 
                  className="btn-ghost text-sm"
                  onClick={() => navigate('/algo-selection')}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
          <div className="absolute inset-0 hero-glow"></div>
          <div className="absolute top-20 left-10 w-72 h-72 floating-orb animate-breath"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 floating-orb animate-breath" style={{animationDelay: '4s'}}></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-8 animate-fade-in-up">
                <span className="tag tag-purple">
                  <Sparkles className="w-3.5 h-3.5" />
                  AlgoFlow v2.0 — Now with Graph & Tree Visualizers
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 leading-[1.05] tracking-tight animate-fade-in-up delay-100">
                <span className="block text-white">Visualize DSA</span>
                <span className="block gradient-text">Algorithms Instantly</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                An interactive way to understand how algorithms work. Step through sorting, 
                searching, graph, and tree algorithms with beautiful visualizations, real-time metrics, 
                and AI-powered explanations.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20 animate-fade-in-up delay-300">
                <button
                  className="btn-primary text-lg px-8 py-4"
                  onClick={() => navigate('/algo-selection')}
                >
                  <span>Start Visualizing</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <a href="#algorithms" className="btn-ghost text-lg px-8 py-4">
                  <span>Explore Algorithms</span>
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 max-w-lg mx-auto gap-6 animate-fade-in-up delay-400">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold gradient-text">
                    <AnimatedCounter end={17} suffix="+" />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Algorithms</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold gradient-text">
                    <AnimatedCounter end={4} />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Categories</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold gradient-text">
                    <AnimatedCounter end={100} suffix="%" />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Interactive</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Algorithm Categories */}
        <section id="algorithms" className="py-24 relative section-glow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 scroll-animate">
              <span className="tag tag-purple mb-6 inline-flex">
                <Code2 className="w-4 h-4" />
                Algorithm Library
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Algorithm Categories
              </h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Dive deep into different types of algorithms with interactive step-by-step visualizations
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {algorithmCategories.map((category, index) => (
                <div 
                  key={index}
                  className="scroll-animate glass-card card-gradient-border p-6 group cursor-pointer flex flex-col"
                  style={{ transitionDelay: `${index * 100}ms` }}
                  onClick={() => navigate(category.link)}
                >
                  <div className="flex-grow">
                    <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center text-white mb-5 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                      {category.icon}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">{category.title}</h3>
                    <p className="text-gray-400 mb-4 text-sm leading-relaxed">{category.description}</p>
                    <div className="space-y-1.5">
                      {category.algorithms.map((algo, algoIndex) => (
                        <div key={algoIndex} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-400/60 rounded-full"></div>
                          <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">{algo}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <button 
                      onClick={(e) => handleExplainClick(e, category)} 
                      className="text-sm font-medium text-purple-400/80 hover:text-purple-300 flex items-center gap-1.5 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Explain with AI
                    </button>
                    <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 relative">
          <div className="absolute inset-0 dot-grid-bg opacity-30"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 scroll-animate">
              <span className="tag tag-blue mb-6 inline-flex">
                <Zap className="w-4 h-4" />
                Features
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Why Choose AlgoFlow?
              </h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Learn algorithms the visual way with our comprehensive, interactive platform
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="scroll-animate text-center group p-6"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-5 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 relative section-glow">
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 scroll-animate">
              <span className="tag tag-green mb-6 inline-flex">
                <MousePointerClick className="w-4 h-4" />
                Getting Started
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                How It Works
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Three simple steps to start learning algorithms visually
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {howItWorks.map((item, index) => (
                <div 
                  key={index} 
                  className="scroll-animate relative"
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  {/* Connector line */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-gradient-to-r from-purple-500/30 to-transparent"></div>
                  )}
                  <div className="text-center">
                    <div className="relative inline-flex mb-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-3xl flex items-center justify-center border border-purple-500/20 group-hover:border-purple-500/40 transition-colors">
                        {item.icon}
                      </div>
                      <span className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-purple-500/30">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-14 scroll-animate">
              <button 
                className="btn-primary text-lg"
                onClick={() => navigate('/algo-selection')}
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* AI Learning Path Section */}
        <LearningPath />

        {/* Footer */}
        <footer id="about" className="border-t border-white/5 py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">AlgoFlow</span>
                </div>
                <p className="text-gray-500 leading-relaxed max-w-sm">
                  Making algorithms accessible through interactive visualizations. 
                  Learn, explore, and master data structures and algorithms.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Algorithms</h4>
                <ul className="space-y-3 text-gray-500">
                  <li><a href="/sorting-visualizer" className="hover:text-purple-400 transition-colors text-sm">Sorting</a></li>
                  <li><a href="/searching-visualizer" className="hover:text-purple-400 transition-colors text-sm">Searching</a></li>
                  <li><a href="/visualizer/graph" className="hover:text-purple-400 transition-colors text-sm">Graph</a></li>
                  <li><a href="/visualizer/tree" className="hover:text-purple-400 transition-colors text-sm">Tree</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Resources</h4>
                <ul className="space-y-3 text-gray-500">
                  <li><a href="#algorithms" className="hover:text-purple-400 transition-colors text-sm">Algorithm Library</a></li>
                  <li><a href="#how-it-works" className="hover:text-purple-400 transition-colors text-sm">How It Works</a></li>
                  <li><a href="#features" className="hover:text-purple-400 transition-colors text-sm">Features</a></li>
                  <li><a href="#ai-path" className="hover:text-purple-400 transition-colors text-sm">AI Learning Path</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-gray-600 text-sm">&copy; 2025 AlgoFlow. All rights reserved.</p>
              <p className="text-gray-600 text-sm">Built with React, p5.js & ❤️</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
