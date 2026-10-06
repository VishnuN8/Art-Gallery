'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function LoadingScreen({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 8 + 2;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDone(true);
            onComplete?.();
          }, 600);
          return 100;
        }
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ backgroundColor: 'hsl(30 8% 7%)' }}
        >
          {/* Subtle gradient backdrop */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(196, 168, 130, 0.08) 0%, transparent 60%)',
            }}
          />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center"
          >
            <h1
              className="font-serif text-4xl md:text-6xl font-light text-foreground mb-3"
              style={{ letterSpacing: '0.25em' }}
            >
              AETHER
            </h1>
            <p className="text-[10px] md:text-xs tracking-luxe uppercase text-muted-foreground mb-12">
              Contemporary Art Gallery
            </p>

            {/* Progress bar */}
            <div className="w-48 md:w-64 h-px bg-white/10 relative overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full bg-accent"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>

            <motion.p
              className="text-[10px] tracking-wide-luxe uppercase text-muted-foreground mt-4"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Preparing the exhibition
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
