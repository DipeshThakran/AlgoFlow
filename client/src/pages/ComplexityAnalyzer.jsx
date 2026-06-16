import React, { useState, useEffect } from 'react';
import { Code2, Cpu, Activity, PlayCircle, Info, Loader2, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const loadingMessages = [
  "Parsing Abstract Syntax Tree...",
  "Analyzing control flow graphs...",
  "Calculating loop iterations...",
  "Evaluating memory allocations...",
  "Synthesizing Big-O estimation...",
  "Finalizing complexity report..."
];

const ComplexityAnalyzer = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getGraphPath = (complexity) => {
    if (!complexity) return "M0,95 L100,5"; // Default to O(N)
    
    const tc = complexity.toUpperCase().replace(/\s+/g, '');
    
    // Constant time: O(1), O(c)
    if (tc.includes('1') || tc.includes('CONSTANT') || tc === 'O(C)' || tc === 'O(I)' || tc === 'O(L)') {
      return "M0,95 L100,95"; // Horizontal line
    }
    
    // Quadratic / Cubic: O(N^2), O(N*M)
    if (tc.includes('^') || tc.includes('*') || tc.includes('N²')) {
      return "M0,95 Q40,80 60,5"; // Steep curve
    }
    
    // O(N log N)
    if (tc.includes('NLOG')) {
      return "M0,95 Q50,60 80,5"; // Mid curve
    }
    
    // O(log N)
    if (tc.includes('LOG')) {
      return "M0,95 Q50,50 100,40"; // Gentle curve
    }
    
    // Default to O(N) linear
    return "M0,95 L100,5"; 
  };

  useEffect(() => {
    let interval;
    if (loading) {
      setLoadingMessageIndex(0);
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => Math.min(prev + 1, loadingMessages.length - 1));
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Please paste some code to analyze.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('/api/analyze-complexity', {
        code,
        language
      });
      
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || 
        'Failed to connect to the analysis server. Make sure the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex-shrink-0 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/algo-selection')}
                className="btn-ghost px-2 py-1 text-xs"
              >
                ← Back
              </button>
              <Cpu className="w-6 h-6 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">Complexity Analyzer</h1>
            </div>
            
            {/* Disclaimer Tooltip */}
            <div className="group relative flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs px-3 py-1.5 rounded-full cursor-help">
              <Info className="w-4 h-4" />
              <span>AI-Powered Estimation</span>
              <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-gray-900 border border-white/10 rounded-lg text-gray-300 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-left">
                Powered by Gemini AI reasoning rather than static analysis. Results are an estimate, especially for highly unusual or obfuscated code.
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column: Input */}
          <div className="glass-card p-5 flex flex-col h-[600px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-purple-400" />
                Paste Code Snippet
              </h2>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-black/30 border border-white/10 rounded-lg text-xs text-white px-3 py-1.5 outline-none focus:border-purple-500 transition-colors"
              >
                <option value="">Auto-detect</option>
                <option value="javascript">JavaScript / TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
              </select>
            </div>
            
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Paste your algorithm or function here..."
              className="flex-1 w-full bg-[#0a0a16] border border-white/5 rounded-lg p-4 text-gray-300 font-mono text-sm resize-none focus:outline-none focus:border-purple-500/50 transition-colors"
              spellCheck={false}
            />
            
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              {error ? (
                <span className="text-red-400 text-xs max-w-[60%]">{error}</span>
              ) : (
                <span className="text-gray-500 text-xs">Supported languages: Any major programming language.</span>
              )}
              <button 
                className="btn-primary py-2 px-6 flex items-center gap-2 shadow-lg shadow-purple-500/20"
                onClick={handleAnalyze}
                disabled={loading || !code.trim()}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
                <span>{loading ? 'Analyzing...' : 'Analyze'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="glass-card p-5 flex flex-col h-[600px] relative overflow-hidden">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-6">
              <Activity className="w-4 h-4 text-green-400" />
              Analysis Results
            </h2>

            {loading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0a16]/80 backdrop-blur-md">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                  <Loader2 className="w-10 h-10 text-purple-400 animate-spin relative z-10 mb-6" />
                </div>
                <div className="h-6 overflow-hidden relative w-full flex justify-center">
                  <p key={loadingMessageIndex} className="text-sm font-mono text-purple-300 animate-fade-in-up">
                    {loadingMessages[loadingMessageIndex]}
                  </p>
                </div>
                <div className="w-48 h-1 bg-white/10 rounded-full mt-6 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-600 to-blue-500 animate-progress"></div>
                </div>
              </div>
            )}

            {!result && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500">
                <Cpu className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm">Submit your code to see the estimated<br/>time and space complexity.</p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-6 overflow-y-auto pr-2 pb-4">
                
                {/* Language Tag */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Detected Language:</span>
                  <span className="bg-white/10 text-white text-xs px-2.5 py-1 rounded border border-white/5 font-mono">
                    {result.language}
                  </span>
                </div>

                {/* Efficiency Card */}
                <div className="bg-[#1c1c24] border border-white/5 rounded-xl p-6 relative overflow-hidden group">
                  <div className="flex items-center gap-2 mb-6 z-10 relative">
                    <Zap className="w-5 h-5 text-purple-500" />
                    <h3 className="text-lg font-semibold text-purple-500">Time Complexity</h3>
                  </div>

                  <div className="flex justify-between items-start z-10 relative">
                    <div className="space-y-3 flex-1 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Current complexity:</span>
                        <span className="text-sm font-mono text-white font-medium">{result.currentTimeComplexity}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Suggested complexity:</span>
                        <span className="text-sm font-mono text-green-500 font-medium">{result.suggestedTimeComplexity}</span>
                      </div>
                      <div className="flex items-start gap-2 mt-2">
                        <span className="text-sm text-gray-400 shrink-0">Suggestions:</span>
                        <span className="text-sm text-white leading-relaxed">
                          {result.suggestions}
                        </span>
                      </div>
                    </div>

                    {/* SVG Graph Visualization */}
                    <div className="w-32 h-32 relative shrink-0 border-l border-b border-white/10 opacity-80 group-hover:opacity-100 transition-opacity">
                      <div className="absolute -top-6 -right-2 text-white font-mono text-xs z-20">
                        {result.currentTimeComplexity}
                      </div>
                      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="highlightGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#d8b4fe" />
                            <stop offset="100%" stopColor="#e9d5ff" />
                          </linearGradient>
                        </defs>
                        {/* Background Curves */}
                        <path d="M0,95 L100,95" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                        <path d="M0,95 Q50,50 100,40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                        <path d="M0,95 L100,5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                        <path d="M0,95 Q50,60 80,5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                        <path d="M0,95 Q40,80 60,5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                        
                        {/* Highlighted Curve */}
                        <path 
                          d={getGraphPath(result.currentTimeComplexity)} 
                          fill="none" 
                          stroke="url(#highlightGrad)" 
                          strokeWidth="2.5" 
                          className="drop-shadow-lg" 
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Space Complexity Section */}
                <div className="bg-[#1c1c24] border border-white/5 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Activity className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-blue-400">Space Complexity</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                      <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-2">Current Space</h3>
                      <div className="text-xl font-mono text-blue-400 font-bold tracking-tight">
                        {result.currentSpaceComplexity}
                      </div>
                    </div>

                    <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                      <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-2">Suggested Space</h3>
                      <div className="text-xl font-mono text-green-500 font-bold tracking-tight">
                        {result.suggestedSpaceComplexity}
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ComplexityAnalyzer;
