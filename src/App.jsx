import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import SortingVisualizerPage from './pages/Sortingpage';
import AlgorithmSelectionPage from './pages/Algoselection';
import SearchingVisualizerPage from './pages/Searchingpage';
import GraphVisualizerPage from './pages/GraphVisualizerPage';
import TreeVisualizerPage from './pages/TreeVisualizerPage';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.25,
};

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <div className="w-full h-full flex flex-col flex-1">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <div className="w-full h-full flex flex-col flex-1">
            <LandingPage />
          </div>
        } />
        <Route path="/algo-selection" element={
          <div className="w-full h-full flex flex-col flex-1">
            <AlgorithmSelectionPage />
          </div>
        } />
        <Route path="/sorting-visualizer" element={
          <div className="w-full h-full flex flex-col flex-1">
            <SortingVisualizerPage />
          </div>
        } />
        <Route path="/searching-visualizer" element={
          <div className="w-full h-full flex flex-col flex-1">
            <SearchingVisualizerPage />
          </div>
        } />
        <Route path="/visualizer/graph" element={
          <div className="w-full h-full flex flex-col flex-1">
            <GraphVisualizerPage />
          </div>
        } />
        <Route path="/visualizer/tree" element={
          <div className="w-full h-full flex flex-col flex-1">
            <TreeVisualizerPage />
          </div>
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;