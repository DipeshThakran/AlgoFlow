import React from 'react';
import { PlayCircle, RotateCcw } from 'lucide-react';

const Controlbar = ({
  onStart,
  onRestart,
  onSpeedChange,
  disabled,
  speed
}) => (
  <div className="flex-shrink-0 glass-card p-4 mb-5 flex items-center justify-between gap-4 flex-wrap">
    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Controls</span>
    <div className="flex items-center gap-3 flex-wrap">
      <label className="flex items-center gap-2 text-sm text-gray-400">
        Speed
        <input
          type="range"
          min="1"
          max="100"
          value={speed}
          onChange={e => onSpeedChange(Number(e.target.value))}
          className="w-24"
        />
        <span className="text-xs text-purple-400 font-mono w-8">{speed}x</span>
      </label>
      <button
        className="btn-ghost text-sm py-2"
        onClick={onRestart}
        disabled={disabled}
        title="Restart"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Restart</span>
      </button>
      <button
        className="btn-primary text-sm py-2"
        onClick={onStart}
        disabled={disabled}
        title="Start"
      >
        <PlayCircle className="w-4 h-4"/>
        <span>Start</span>
      </button>
    </div>
  </div>
);

export default Controlbar;
