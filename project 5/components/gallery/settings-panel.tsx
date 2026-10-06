'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, Sparkles } from 'lucide-react';
import { useGallery } from '@/lib/gallery-context';
import { cn } from '@/lib/utils';

export function SettingsPanel() {
  const { showSettings, setShowSettings, settings, updateSettings } = useGallery();

  return (
    <AnimatePresence>
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 30 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-20 right-4 md:right-6 z-40 w-[280px] md:w-[320px] max-w-sm"
        >
          <div className="glass rounded-sm overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-white/5">
              <span className="text-[10px] tracking-luxe uppercase text-muted-foreground">
                Settings
              </span>
              <button
                onClick={() => setShowSettings(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-6">
              <SettingRow icon={<Volume2 size={16} />} label="Ambient Sound">
                <Toggle
                  checked={settings.ambientSound}
                  onChange={(v) => updateSettings({ ambientSound: v })}
                />
              </SettingRow>

              {settings.ambientSound && (
                <SettingRow icon={<Volume2 size={16} />} label="Volume">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.soundVolume * 100}
                    onChange={(e) =>
                      updateSettings({ soundVolume: Number(e.target.value) / 100 })
                    }
                    className="w-24 accent-accent"
                  />
                </SettingRow>
              )}

              <div className="h-px bg-white/5" />

              <SettingRow icon={<Sparkles size={16} />} label="Reduced Motion">
                <Toggle
                  checked={settings.reducedMotion}
                  onChange={(v) => updateSettings({ reducedMotion: v })}
                />
              </SettingRow>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SettingRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-xs text-foreground/90">{label}</span>
      </div>
      {children}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        'relative w-10 h-5 rounded-full transition-all duration-300',
        checked ? 'bg-accent/40' : 'bg-white/10',
      )}
    >
      <motion.div
        className="absolute top-0.5 w-4 h-4 rounded-full bg-foreground"
        animate={{ left: checked ? '22px' : '2px' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />
    </button>
  );
}
