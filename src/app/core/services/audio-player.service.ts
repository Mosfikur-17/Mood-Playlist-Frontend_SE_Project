import { Injectable, signal, computed } from '@angular/core';
import { Playlist, Track } from '../models/playlist.model';

export type AmbientSoundType = 'off' | 'rain' | 'ocean' | 'cafe' | 'white-noise';

@Injectable({ providedIn: 'root' })
export class AudioPlayerService {
  // Playback Signals
  readonly currentPlaylist = signal<Playlist | null>(null);
  readonly currentTrack = signal<Track | null>(null);
  readonly currentTrackIndex = signal<number>(0);
  readonly isPlaying = signal<boolean>(false);
  readonly currentTime = signal<number>(0);
  readonly duration = signal<number>(180); // Default track duration in seconds
  readonly volume = signal<number>(80);
  readonly isMuted = signal<boolean>(false);
  readonly isShuffle = signal<boolean>(false);
  readonly isLoop = signal<boolean>(false);
  readonly ambientSound = signal<AmbientSoundType>('off');

  readonly progressPercentage = computed(() => {
    const dur = this.duration();
    return dur > 0 ? (this.currentTime() / dur) * 100 : 0;
  });

  // Web Audio Context & Synthesizer Node references
  private audioCtx: AudioContext | null = null;
  private oscNode1: OscillatorNode | null = null;
  private oscNode2: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private ambientGainNode: GainNode | null = null;
  private ambientNoiseSource: AudioBufferSourceNode | null = null;
  private playbackTimer: any = null;

  constructor() {
    // Synchronize volume updates
  }

  private initAudioContext(): void {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playPlaylist(playlist: Playlist, startIndex = 0): void {
    this.currentPlaylist.set(playlist);
    const tracks = playlist.tracksList ?? [];
    if (tracks.length > 0) {
      const idx = Math.min(startIndex, tracks.length - 1);
      this.playTrack(tracks[idx], playlist, idx);
    } else {
      // Fallback synthetic track if list is empty
      const fallbackTrack: Track = {
        id: `${playlist.id}-main`,
        title: `${playlist.title} Flow`,
        artist: 'Mood Engine',
        duration: playlist.duration,
        mood: playlist.mood,
        bpm: 72,
        audioFreq: 220
      };
      this.playTrack(fallbackTrack, playlist, 0);
    }
  }

  playTrack(track: Track, playlist?: Playlist, index?: number): void {
    this.initAudioContext();
    if (playlist) {
      this.currentPlaylist.set(playlist);
    }
    this.currentTrack.set(track);
    if (index !== undefined) {
      this.currentTrackIndex.set(index);
    }
    this.currentTime.set(0);
    this.duration.set(210); // 3 minutes standard preview track
    this.isPlaying.set(true);

    this.startSynthAudio(track);
    this.startTimer();
  }

  togglePlay(): void {
    if (!this.currentTrack()) {
      return;
    }
    const nextState = !this.isPlaying();
    this.isPlaying.set(nextState);

    if (nextState) {
      this.initAudioContext();
      if (this.currentTrack()) {
        this.startSynthAudio(this.currentTrack()!);
      }
      this.startTimer();
    } else {
      this.stopSynthAudio();
      this.stopTimer();
    }
  }

  seek(seconds: number): void {
    this.currentTime.set(Math.max(0, Math.min(seconds, this.duration())));
  }

  setVolume(val: number): void {
    this.volume.set(val);
    if (this.gainNode && this.audioCtx) {
      const vol = this.isMuted() ? 0 : val / 100;
      this.gainNode.gain.setValueAtTime(vol * 0.15, this.audioCtx.currentTime);
    }
  }

  toggleMute(): void {
    this.isMuted.set(!this.isMuted());
    this.setVolume(this.volume());
  }

  toggleShuffle(): void {
    this.isShuffle.set(!this.isShuffle());
  }

  toggleLoop(): void {
    this.isLoop.set(!this.isLoop());
  }

  nextTrack(): void {
    const pl = this.currentPlaylist();
    if (!pl || !pl.tracksList || pl.tracksList.length === 0) return;
    let nextIdx = this.currentTrackIndex() + 1;
    if (nextIdx >= pl.tracksList.length) {
      nextIdx = 0;
    }
    this.playTrack(pl.tracksList[nextIdx], pl, nextIdx);
  }

  previousTrack(): void {
    const pl = this.currentPlaylist();
    if (!pl || !pl.tracksList || pl.tracksList.length === 0) return;
    let prevIdx = this.currentTrackIndex() - 1;
    if (prevIdx < 0) {
      prevIdx = pl.tracksList.length - 1;
    }
    this.playTrack(pl.tracksList[prevIdx], pl, prevIdx);
  }

  setAmbientSound(type: AmbientSoundType): void {
    this.ambientSound.set(type);
    this.initAudioContext();
    this.playAmbientNoise(type);
  }

  private startTimer(): void {
    this.stopTimer();
    this.playbackTimer = setInterval(() => {
      if (this.isPlaying()) {
        const next = this.currentTime() + 1;
        if (next >= this.duration()) {
          if (this.isLoop()) {
            this.currentTime.set(0);
          } else {
            this.nextTrack();
          }
        } else {
          this.currentTime.set(next);
        }
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.playbackTimer) {
      clearInterval(this.playbackTimer);
      this.playbackTimer = null;
    }
  }

  private startSynthAudio(track: Track): void {
    this.stopSynthAudio();
    if (!this.audioCtx) return;

    try {
      const baseFreq = track.audioFreq || this.getFreqForMood(track.mood);
      this.oscNode1 = this.audioCtx.createOscillator();
      this.oscNode2 = this.audioCtx.createOscillator();
      this.gainNode = this.audioCtx.createGain();

      this.oscNode1.type = 'sine';
      this.oscNode1.frequency.setValueAtTime(baseFreq, this.audioCtx.currentTime);

      this.oscNode2.type = 'triangle';
      this.oscNode2.frequency.setValueAtTime(baseFreq * 1.5, this.audioCtx.currentTime);

      const vol = this.isMuted() ? 0 : (this.volume() / 100) * 0.12;
      this.gainNode.gain.setValueAtTime(vol, this.audioCtx.currentTime);

      this.oscNode1.connect(this.gainNode);
      this.oscNode2.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      this.oscNode1.start();
      this.oscNode2.start();
    } catch (e) {
      console.warn('Audio synthesis fallback', e);
    }
  }

  private stopSynthAudio(): void {
    if (this.oscNode1) {
      try { this.oscNode1.stop(); this.oscNode1.disconnect(); } catch {}
      this.oscNode1 = null;
    }
    if (this.oscNode2) {
      try { this.oscNode2.stop(); this.oscNode2.disconnect(); } catch {}
      this.oscNode2 = null;
    }
  }

  private playAmbientNoise(type: AmbientSoundType): void {
    if (this.ambientNoiseSource) {
      try { this.ambientNoiseSource.stop(); this.ambientNoiseSource.disconnect(); } catch {}
      this.ambientNoiseSource = null;
    }

    if (type === 'off' || !this.audioCtx) return;

    try {
      const bufferSize = this.audioCtx.sampleRate * 2; // 2 seconds pink noise buffer
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.03;
        b6 = white * 0.115926;
      }

      this.ambientNoiseSource = this.audioCtx.createBufferSource();
      this.ambientNoiseSource.buffer = buffer;
      this.ambientNoiseSource.loop = true;

      this.ambientGainNode = this.audioCtx.createGain();
      const gainVal = type === 'rain' ? 0.08 : type === 'ocean' ? 0.05 : 0.04;
      this.ambientGainNode.gain.setValueAtTime(gainVal, this.audioCtx.currentTime);

      this.ambientNoiseSource.connect(this.ambientGainNode);
      this.ambientGainNode.connect(this.audioCtx.destination);
      this.ambientNoiseSource.start();
    } catch (e) {
      console.warn('Ambient noise error', e);
    }
  }

  private getFreqForMood(mood: string): number {
    const m = mood.toLowerCase();
    if (m.includes('focus')) return 220; // A3
    if (m.includes('happy')) return 293.66; // D4
    if (m.includes('relax') || m.includes('calm')) return 196; // G3
    if (m.includes('energetic') || m.includes('energy')) return 329.63; // E4
    if (m.includes('sad') || m.includes('night')) return 174.61; // F3
    return 261.63; // C4
  }
}
