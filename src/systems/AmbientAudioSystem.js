export class AmbientAudioSystem {
  constructor() {
    this.context = null;
    this.masterGain = null;
    this.enabled = false;
    this.initialized = false;

    this.oscillators = [];
    this.lfo = null;
    this.noiseSource = null;
    this.noiseGain = null;
    this.filter = null;
  }

  ensureContext() {
    if (this.context) {
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    this.context = new AudioContextClass();
    this.masterGain = this.context.createGain();
    this.masterGain.gain.value = 0;
    this.masterGain.connect(this.context.destination);
  }

  createNoiseBuffer(duration = 2) {
    const length = Math.floor(this.context.sampleRate * duration);
    const buffer = this.context.createBuffer(1, length, this.context.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * 0.25;
    }

    return buffer;
  }

  initializeGraph() {
    if (!this.context || this.initialized) {
      return;
    }

    this.filter = this.context.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.value = 620;
    this.filter.Q.value = 0.8;

    const droneFrequencies = [110, 164.81, 220];

    this.oscillators = droneFrequencies.map((frequency, index) => {
      const oscillator = this.context.createOscillator();
      oscillator.type = index % 2 === 0 ? 'sine' : 'triangle';
      oscillator.frequency.value = frequency;

      const gain = this.context.createGain();
      gain.gain.value = 0.02 + index * 0.007;

      oscillator.connect(gain);
      gain.connect(this.filter);
      oscillator.start();

      return { oscillator, gain };
    });

    const noiseBuffer = this.createNoiseBuffer(3);
    this.noiseSource = this.context.createBufferSource();
    this.noiseSource.buffer = noiseBuffer;
    this.noiseSource.loop = true;

    this.noiseGain = this.context.createGain();
    this.noiseGain.gain.value = 0.018;

    this.noiseSource.connect(this.noiseGain);
    this.noiseGain.connect(this.filter);
    this.noiseSource.start();

    this.lfo = this.context.createOscillator();
    this.lfo.type = 'sine';
    this.lfo.frequency.value = 0.08;

    const lfoGain = this.context.createGain();
    lfoGain.gain.value = 190;

    this.lfo.connect(lfoGain);
    lfoGain.connect(this.filter.frequency);
    this.lfo.start();

    this.filter.connect(this.masterGain);
    this.initialized = true;
  }

  async resumeContext() {
    this.ensureContext();

    if (!this.context) {
      return;
    }

    if (this.context.state === 'suspended') {
      await this.context.resume();
    }

    this.initializeGraph();
  }

  async setEnabled(value) {
    await this.resumeContext();

    if (!this.context || !this.masterGain) {
      this.enabled = false;
      return this.enabled;
    }

    this.enabled = value;
    const now = this.context.currentTime;

    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(value ? 0.2 : 0, now + 1.2);

    return this.enabled;
  }

  async toggle() {
    return this.setEnabled(!this.enabled);
  }

  async playCue(frequency = 660) {
    await this.resumeContext();

    if (!this.context || !this.masterGain) {
      return;
    }

    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, now);

    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

    oscillator.connect(gain);
    gain.connect(this.masterGain);
    oscillator.start(now);
    oscillator.stop(now + 0.45);
  }
}
