import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Fingerprint,
  ExternalLink,
} from 'lucide-react';
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
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragCurrentX, setDragCurrentX] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset index when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, candidates.length]);

  if (!isOpen || candidates.length === 0) return null;

  const current = candidates[currentIndex] || candidates[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % candidates.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + candidates.length) % candidates.length);
  };

  // Touch & Mouse Drag Swipe handling (smooth left/right swiping)
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartX(e.touches[0].clientX);
    setDragCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setDragCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (dragStartX !== null && dragCurrentX !== null) {
      const diff = dragStartX - dragCurrentX;
      if (diff > 40) {
        handleNext();
      } else if (diff < -40) {
        handlePrev();
      }
    }
    setDragStartX(null);
    setDragCurrentX(null);
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
      if (diff > 40) {
        handleNext();
      } else if (diff < -40) {
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Campaign Pop-up"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm select-none"
      onClick={onClose}
    >
      <div
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="relative max-w-lg sm:max-w-xl w-full flex flex-col items-center cursor-grab active:cursor-grabbing animate-in zoom-in-95 duration-200"
      >
        {/* Top Controls Overlay: APC Logo, VOTE Badge, and Close Button */}
        <div className="w-full flex items-center justify-between pb-2.5 px-1">
          <div className="flex items-center gap-2">
            {/* Subtle APC Logo & VOTE Badge */}
            <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white shadow-md">
              <img
                src={APC_LOGO_DATA_URL}
                alt="APC Logo"
                className="h-5 w-auto object-contain rounded-xs"
              />
              <span className="font-black text-xs text-amber-300 tracking-wider">APC</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <Fingerprint className="w-3.5 h-3.5 text-emerald-400 stroke-[2.4]" />
              <span className="text-[11px] font-bold tracking-wider text-white uppercase">VOTE</span>
            </div>

            {/* Slide Index Counter */}
            {candidates.length > 1 && (
              <div className="bg-black/60 backdrop-blur-md text-white/90 text-xs font-semibold px-2.5 py-1 rounded-full border border-white/15">
                {currentIndex + 1} / {candidates.length}
              </div>
            )}
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-colors shadow-lg focus:outline-none"
            aria-label="Close pop-up"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pure Image Display Container (No Extra Text / Clutter) */}
        <div
          onClick={current.ctaUrl ? handleImageClick : undefined}
          className={`relative w-full rounded-2xl overflow-hidden bg-black/40 shadow-2xl border border-white/15 flex items-center justify-center ${
            current.ctaUrl ? 'cursor-pointer group' : ''
          }`}
          style={{ maxHeight: '82vh' }}
        >
          <img
            src={current.imageUrl}
            alt={current.name || 'Campaign Pop-up Image'}
            className="w-full h-auto max-h-[78vh] object-contain block mx-auto transition-transform duration-200"
            draggable={false}
          />

          {/* Previous / Next Arrow Buttons Floating on Image */}
          {candidates.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all shadow-lg focus:outline-none"
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
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all shadow-lg focus:outline-none"
                aria-label="Next pop-up"
                title="Next (Swipe Left)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Subtle link badge if URL is attached */}
          {current.ctaUrl && (
            <div className="absolute bottom-3 right-3 bg-black/70 hover:bg-black/90 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-md flex items-center gap-1.5 shadow-md">
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
                onClick={() => setCurrentIndex(i)}
                aria-label={`Jump to pop-up ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-200 ${
                  currentIndex === i
                    ? 'w-6 bg-white shadow-md'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}

        {/* Small subtle mobile swipe hint */}
        <div className="text-[11px] text-white/60 pt-1 tracking-wide">
          ⇄ Swipe left or right
        </div>
      </div>
    </div>
  );
};
