import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Fingerprint,
  ExternalLink,
  Play,
  Pause,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { APCCandidate } from '../types';
import { APC_LOGO_DATA_URL } from '../data/apcLogo';

interface Props {
  candidates: APCCandidate[];
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

export const CandidateCarouselModal: React.FC<Props> = ({
  candidates,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragCurrentX, setDragCurrentX] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto change duration (3.5 seconds)
  const AUTO_PLAY_INTERVAL = 3500;

  // Reset index when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setIsPaused(false);
    }
  }, [isOpen]);

  // Auto change from one image to the other automatically
  useEffect(() => {
    if (!isOpen || candidates.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % candidates.length);
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isOpen, candidates.length, isPaused, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, candidates.length]);

  if (!isOpen || candidates.length === 0) return null;

  const current = candidates[currentIndex] || candidates[0];

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % candidates.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + candidates.length) % candidates.length);
  };

  // Touch & Mouse Drag Swipe handling (smooth left/right swiping)
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setDragStartX(e.touches[0].clientX);
    setDragCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setDragCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (dragStartX !== null && dragCurrentX !== null) {
      const diff = dragStartX - dragCurrentX;
      if (diff > 35) {
        handleNext();
      } else if (diff < -35) {
        handlePrev();
      }
    }
    setDragStartX(null);
    setDragCurrentX(null);
    // Resume autoplay shortly after gesture ends
    setTimeout(() => setIsPaused(false), 2000);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStartX(e.clientX);
    setDragCurrentX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStartX !== null) {
      setDragCurrentX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    if (dragStartX !== null && dragCurrentX !== null) {
      const diff = dragStartX - dragCurrentX;
      if (diff > 35) {
        handleNext();
      } else if (diff < -35) {
        handlePrev();
      }
    }
    setDragStartX(null);
    setDragCurrentX(null);
  };

  const handleImageClick = () => {
    if (!current.ctaUrl) return;
    if (current.ctaUrl.startsWith('/') && onNavigate) {
      onNavigate(current.ctaUrl);
      onClose();
    } else {
      window.open(current.ctaUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Framer Motion image transition variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.97,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 350, damping: 30 },
        opacity: { duration: 0.28 },
        scale: { duration: 0.28 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.97,
      transition: {
        x: { type: 'spring' as const, stiffness: 350, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Campaign Pop-up"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md select-none overflow-hidden"
        onClick={onClose}
      >
        <motion.div
          ref={containerRef}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative max-w-lg sm:max-w-xl w-full flex flex-col items-center cursor-grab active:cursor-grabbing"
        >
          {/* Top Controls Overlay: APC Logo, VOTE Badge, and Close Button */}
          <div className="w-full flex items-center justify-between pb-2.5 px-1">
            <div className="flex items-center gap-2">
              {/* Subtle APC Logo & VOTE Badge with glowing accent */}
              <div className="inline-flex items-center gap-2 bg-black/70 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/25 text-white shadow-lg">
                <img
                  src={APC_LOGO_DATA_URL}
                  alt="APC Logo"
                  className="h-5 w-auto object-contain rounded-xs drop-shadow"
                />
                <span className="font-black text-xs text-amber-300 tracking-wider">APC</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <Fingerprint className="w-3.5 h-3.5 text-emerald-400 stroke-[2.4]" />
                <span className="text-[11px] font-bold tracking-wider text-white uppercase">VOTE</span>
              </div>

              {/* Slide Counter & Autoplay status */}
              {candidates.length > 1 && (
                <button
                  type="button"
                  onClick={() => setIsPaused((p) => !p)}
                  className="bg-black/70 backdrop-blur-xl text-white/90 text-xs font-semibold px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1.5 hover:bg-black/90 transition-colors"
                  title={isPaused ? 'Resume auto-slideshow' : 'Pause auto-slideshow'}
                >
                  {isPaused ? (
                    <Play className="w-3 h-3 text-amber-300 fill-amber-300" />
                  ) : (
                    <Pause className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                  )}
                  <span>
                    {currentIndex + 1} / {candidates.length}
                  </span>
                </button>
              )}
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/70 hover:bg-black/95 text-white flex items-center justify-center border border-white/25 backdrop-blur-xl transition-all shadow-lg hover:scale-105 active:scale-95 focus:outline-none"
              aria-label="Close pop-up"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Pure Image Display Container with Framer animated transitions */}
          <div
            onClick={current.ctaUrl ? handleImageClick : undefined}
            className={`relative w-full rounded-2xl overflow-hidden bg-black/50 shadow-2xl border border-white/20 flex items-center justify-center ${
              current.ctaUrl ? 'cursor-pointer group' : ''
            }`}
            style={{ maxHeight: '82vh' }}
          >
            {/* Auto-play Animated Progress Bar */}
            {candidates.length > 1 && !isPaused && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-20 overflow-hidden">
                <motion.div
                  key={currentIndex}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: AUTO_PLAY_INTERVAL / 1000, ease: 'linear' }}
                  className="h-full bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-400"
                />
              </div>
            )}

            {/* AnimatePresence for smooth sliding and fading of pop-up images */}
            <div className="relative w-full overflow-hidden flex items-center justify-center min-h-[320px] sm:min-h-[420px]">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.img
                  key={current.id || current.imageUrl}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  src={current.imageUrl}
                  alt={current.name || 'Campaign Pop-up Image'}
                  className="w-full h-auto max-h-[78vh] object-contain block mx-auto transition-transform duration-200"
                  draggable={false}
                />
              </AnimatePresence>
            </div>

            {/* Previous / Next Arrow Buttons Floating on Image */}
            {candidates.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/25 backdrop-blur-xl transition-all shadow-lg hover:scale-110 active:scale-95 focus:outline-none z-10"
                  aria-label="Previous pop-up"
                  title="Previous (Swipe Right)"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/25 backdrop-blur-xl transition-all shadow-lg hover:scale-110 active:scale-95 focus:outline-none z-10"
                  aria-label="Next pop-up"
                  title="Next (Swipe Left)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Subtle link badge if URL is attached */}
            {current.ctaUrl && (
              <div className="absolute bottom-3 right-3 bg-black/75 hover:bg-black/95 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full border border-white/25 backdrop-blur-xl flex items-center gap-1.5 shadow-md z-10 transition-transform group-hover:scale-105">
                <span>{current.ctaText || 'Learn More'}</span>
                <ExternalLink className="w-3 h-3 text-amber-300" />
              </div>
            )}
          </div>

          {/* Bottom Swipe Dots Indicator */}
          {candidates.length > 1 && (
            <div className="flex items-center justify-center gap-2 pt-3">
              {candidates.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setDirection(i > currentIndex ? 1 : -1);
                    setCurrentIndex(i);
                  }}
                  aria-label={`Jump to pop-up ${i + 1}`}
                  className="relative p-1 focus:outline-none"
                >
                  <span
                    className={`block h-2 rounded-full transition-all duration-300 ${
                      currentIndex === i
                        ? 'w-7 bg-gradient-to-r from-emerald-400 to-amber-300 shadow-md'
                        : 'w-2 bg-white/35 hover:bg-white/60'
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
