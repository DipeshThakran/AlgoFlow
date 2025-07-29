import React, { useState } from 'react';
import P5Wrapper from './components/P5Wrapper';
import dijkstraSketch from './algorithms/dijkstra';


function App() {
  const [selectedAlgo, setSelectedAlgo] = useState('dijkstra');

  const sketchMap = {
    dijkstra: dijkstraSketch,
    
    // add others
  };

  return (
    <div className="flex">
      <div className="w-1/4 p-4 bg-gray-100">
        <h1 className="text-xl font-bold">Select Algorithm</h1>
        <button onClick={() => setSelectedAlgo('dijkstra')}>Dijkstra</button>
      </div>
      <div className="flex-1 p-4">
        <P5Wrapper sketch={sketchMap[selectedAlgo]} />
      </div>
    </div>
  );
}

export default App;
