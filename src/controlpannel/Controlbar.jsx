import React from 'react';
import { PlayCircle, RotateCcw } from 'lucide-react';

const Controlbar = ({
  onStart,
  onRestart,
  onSpeedChange,
  disabled,
  speed
}) => (
  <div className="flex-shrink-0 bg-gray-900/50 border border-gray-800 rounded-lg p-4 mb-6 flex items-center justify-between gap-4">
    <span className="text-sm text-gray-400">Controls</span>
    <div className="flex items-center gap-4">
      <label className="flex items-center gap-2 text-sm text-gray-300">
        Speed
        <input
          type="range"
          min="1"
          max="100"
          value={speed}
          onChange={e => onSpeedChange(Number(e.target.value))}
          className="accent-purple-500"
        />
      </label>
      <button
        className="group bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-2 border border-purple-500/20"
        onClick={onRestart}
        disabled={disabled}
        title="Restart"
      >
        <RotateCcw className="w-5 h-5" />
        <span>Restart</span>
      </button>
      <button
        className="group bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-2 border border-purple-500/20"
        onClick={onStart}
        disabled={disabled}
        title="Start"
      >
        <PlayCircle className="w-5 h-5"/>
        <span>Start</span>
      </button>
    </div>
  </div>
);

export default Controlbar;
