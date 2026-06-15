/**
 * Global Web Audio API Synthesizer for AlgoFlow Visualizations
 */

class AudioSystem {
  constructor() {
    this.audioCtx = null;
    this.masterGain = null;
    this.isMuted = false;
  }

  init() {
    if (this.audioCtx) return;
    
    // Create audio context on first use (must be triggered by user interaction)
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      this.audioCtx = new AudioContext();
      this.masterGain = this.audioCtx.createGain();
      
      // Default volume
      this.masterGain.gain.value = 0.1;
      this.masterGain.connect(this.audioCtx.destination);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  setVolume(vol) {
    if (this.masterGain) {
      // Clamp between 0.0 and 1.0
      this.masterGain.gain.value = Math.max(0, Math.min(1, vol));
    }
  }

  /**
   * Plays a synthesized beep.
   * @param {number} frequency - Frequency in Hz
   * @param {number} duration - Duration in seconds
   * @param {string} type - Oscillator type: 'sine', 'square', 'sawtooth', 'triangle'
   */
  playTone(frequency, duration = 0.05, type = 'sine') {
    if (this.isMuted) return;
    if (!this.audioCtx) this.init();
    if (!this.audioCtx) return;

    // Resume context if suspended (browser autoplay policy)
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

    // Envelope to prevent clicking/popping
    gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, this.audioCtx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(this.masterGain);

    osc.start(this.audioCtx.currentTime);
    osc.stop(this.audioCtx.currentTime + duration);
  }

  /**
   * Helper to play a sound based on an array value mapping.
   * For sorting arrays, larger values = higher pitch.
   */
  playSortTone(value, minValue = 10, maxValue = 350) {
    // Map value to a frequency range (e.g., 200Hz to 1200Hz)
    const minFreq = 200;
    const maxFreq = 1200;
    
    // Avoid division by zero
    const range = Math.max(1, maxValue - minValue);
    const normalized = Math.max(0, Math.min(1, (value - minValue) / range));
    
    const freq = minFreq + (normalized * (maxFreq - minFreq));
    this.playTone(freq, 0.05, 'triangle');
  }

  /**
   * Helper to play a short "pop" for graph traversal.
   */
  playNodeVisitTone() {
    this.playTone(800, 0.08, 'sine');
  }
  
  playEdgeTone() {
    this.playTone(400, 0.04, 'triangle');
  }
}

// Export a singleton instance
export const audioSystem = new AudioSystem();
