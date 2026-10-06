'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Volume2, VolumeX, Settings as SettingsIcon } from 'lucide-react';
import { useGallery } from '@/lib/gallery-context';
import { cn } from '@/lib/utils';

export function Navbar() {
  const {
    view,
    setView,
    settings,
    updateSettings,
    showSettings,
    setShowSettings,
  } = useGallery();

  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: { label: string; view: 'exhibitions' | 'artists' }[] = [
    { label: 'Exhibitions', view: 'exhibitions' },
    { label: 'Artists', view: 'artists' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="glass">
          <div className="mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
            <button
              onClick={() => setView('landing')}
              className="flex items-center gap-3 group"
            >
              <span
                className="font-serif text-2xl md:text-3xl font-light tracking-luxe text-foreground"
                style={{ letterSpacing: '0.25em' }}
              >
                AETHER
              </span>
            </button>

            <div className="hidden md:flex items-center gap-10">
              {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => setView(item.view)}
                  className={cn(
                    'text-[11px] tracking-wide-luxe uppercase transition-colors duration-300 luxury-underline',
                    view === item.view
                      ? 'text-accent'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2">
              <IconButton
                label={settings.ambientSound ? 'Mute Sound' : 'Enable Sound'}
                active={settings.ambientSound}
                onClick={() => updateSettings({ ambientSound: !settings.ambientSound })}
              >
                {settings.ambientSound ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </IconButton>
              <IconButton label="Settings" active={showSettings} onClick={() => setShowSettings(!showSettings)}>
                <SettingsIcon size={16} />
              </IconButton>
            </div>

            <button
              className="md:hidden text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 left-0 right-0 z-40 md:hidden"
          >
            <div className="glass mx-4 rounded-sm overflow-hidden">
              <div className="flex flex-col p-4">
                {navItems.map((item) => (
                  <button
                    key={item.view}
                    onClick={() => {
                      setView(item.view);
                      setMobileOpen(false);
                    }}
                    className={cn(
                      'text-sm tracking-wide-luxe uppercase py-3 text-left transition-colors',
                      view === item.view ? 'text-accent' : 'text-muted-foreground',
                    )}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                  <IconButton
                    label={settings.ambientSound ? 'Mute' : 'Sound'}
                    active={settings.ambientSound}
                    onClick={() => updateSettings({ ambientSound: !settings.ambientSound })}
                  >
                    {settings.ambientSound ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </IconButton>
                  <IconButton label="Settings" active={showSettings} onClick={() => setShowSettings(!showSettings)}>
                    <SettingsIcon size={16} />
                  </IconButton>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function IconButton({
  children,
  label,
  active,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={cn(
        'p-2 rounded-sm transition-all duration-300',
        active
          ? 'text-accent bg-accent/10'
          : 'text-muted-foreground hover:text-foreground hover:bg-white/5',
      )}
    >
      {children}
    </button>
  );
}
