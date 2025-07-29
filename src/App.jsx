import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SortingVisualizerPage from './pages/Sortingpage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sorting-visualizer" element={<SortingVisualizerPage />} />
      </Routes>
    </Router>
  )

}

export default App;