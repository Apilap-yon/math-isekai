import { useEffect, useRef, useCallback, useState } from 'react';
import { Howl, Howler } from 'howler';
import bgmFile from './sigmamusicart-background-music-inspiring-525840.mp3';

type BgmTrack = 'intro' | 'quiz' | 'result';

const BGM_SOURCES: Record<BgmTrack, string> = {
  intro:  bgmFile,
  quiz:   bgmFile,
  result: bgmFile,
};

const SFX_SOURCES: Record<string, string> = {};

export function useAudio() {
  const bgmRef = useRef<Howl | null>(null);
  const currentTrackRef = useRef<BgmTrack | null>(null);
  const pendingTrackRef = useRef<BgmTrack | null>(null);
  const sfxRef = useRef<Record<string, Howl>>({});
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  // ติดตามว่าผู้ใช้เคย interact แล้วหรือยัง (แก้ browser autoplay policy)
  const unlockedRef = useRef(false);

  // Preload SFX
  useEffect(() => {
    sfxRef.current = {
      select:  new Howl({ src: [SFX_SOURCES.select],  volume: 0.6 }),
      correct: new Howl({ src: [SFX_SOURCES.correct], volume: 0.6 }),
      fanfare: new Howl({ src: [SFX_SOURCES.fanfare], volume: 0.7 }),
    };
    return () => {
      Object.values(sfxRef.current).forEach(s => s.unload());
    };
  }, []);

  const startBgmHowl = useCallback((track: BgmTrack) => {
    if (mutedRef.current) return;

    const old = bgmRef.current;
    if (old) {
      old.fade(old.volume(), 0, 700);
      setTimeout(() => old.unload(), 800);
    }

    const howl = new Howl({
      src: [BGM_SOURCES[track]],
      loop: true,
      volume: 0,
    });
    bgmRef.current = howl;
    howl.play();
    howl.fade(0, 0.35, 800);
  }, []);

  const playBgm = useCallback((track: BgmTrack) => {
    if (currentTrackRef.current === track) return;
    currentTrackRef.current = track;

    if (!unlockedRef.current) {
      // เก็บไว้รอ user กดก่อน
      pendingTrackRef.current = track;
      return;
    }
    startBgmHowl(track);
  }, [startBgmHowl]);

  // เรียกครั้งเดียวตอน user กด (unlock autoplay)
  const unlockAudio = useCallback(() => {
    if (unlockedRef.current) return;
    unlockedRef.current = true;
    if (pendingTrackRef.current) {
      startBgmHowl(pendingTrackRef.current);
      pendingTrackRef.current = null;
    }
  }, [startBgmHowl]);

  const playSfx = useCallback((name: keyof typeof SFX_SOURCES) => {
    if (mutedRef.current) return;
    sfxRef.current[name]?.play();
  }, []);

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const next = !prev;
      mutedRef.current = next;
      Howler.mute(next);
      // Resume BGM ถ้า unmute
      if (!next && bgmRef.current && !bgmRef.current.playing()) {
        bgmRef.current.play();
      }
      return next;
    });
  }, []);

  useEffect(() => {
    return () => { bgmRef.current?.unload(); };
  }, []);

  return { playBgm, playSfx, toggleMute, unlockAudio, muted };
}
