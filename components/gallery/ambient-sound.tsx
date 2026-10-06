'use client';

import React, { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useGallery } from '@/lib/gallery-context';

export function AmbientSound() {
  const { settings, view } = useGallery();
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    if (!soundRef.current && settings.ambientSound) {
      soundRef.current = new Howl({
        src: [
          'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
        ],
        loop: true,
        volume: 0,
        html5: false,
      });
    }

    if (soundRef.current) {
      if (settings.ambientSound && view !== 'landing') {
        soundRef.current.play();
        soundRef.current.fade(
          soundRef.current.volume(),
          settings.soundVolume,
          1500,
        );
      } else {
        if (soundRef.current.playing()) {
          soundRef.current.fade(
            soundRef.current.volume(),
            0,
            800,
          );
          setTimeout(() => {
            soundRef.current?.pause();
          }, 850);
        }
      }
    }

    return () => {};
  }, [settings.ambientSound, settings.soundVolume, view]);

  useEffect(() => {
    return () => {
      soundRef.current?.unload();
    };
  }, []);

  return null;
}
