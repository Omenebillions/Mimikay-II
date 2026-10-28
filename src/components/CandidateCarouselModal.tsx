import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Fingerprint,
  CheckCircle2,
} from 'lucide-react';
import { APCCandidate } from '../types';
import { APC_LOGO_DATA_URL } from '../data/apcLogo';

interface Props {
  candidates: APCCandidate[];
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

// Authentic All Progressives Congress (APC) Logo Component using user-supplied logo
const APCLogo: React.FC<{ className?: string }> = ({ className = 'h-8' }) => {
  return (
    <div className={`inline-flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-gray-200 shadow-xs ${className}`}>
      <img
        src={APC_LOGO_DATA_URL}
        alt="APC - All Progressives Congress Logo"
        className="h-7 w-auto object-contain flex-shrink-0 rounded-xs"
      />
      <span className="font-black text-xs tracking-wider text-[#0072bc]">APC</span>
    </div>
  );
};

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

  // Touch & Mouse Drag Swipe handling (swipable from left to right)
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
      if (diff > 45) {
        handleNext();
      } else if (diff < -45) {
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
      if (diff > 50) {
        handleNext();
      } else if (diff < -50) {
        handlePrev();
      }
    }
    setDragStartX(null);
    setDragCurrentX(null);
  };

  const handleCta = () => {
    if (!current.ctaUrl) return;
    if (current.ctaUrl.startsWith('/') && onNavigate) {
      onNavigate(current.ctaUrl);
      onClose();
    } else {
      window.open(current.ctaUrl, '_blank', 'noopener,noreferrer');
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="candidate-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs select-none"
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
        className="relative bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col cursor-grab active:cursor-grabbing animate-in zoom-in-95 duration-200"
      >
        {/* Top Header Bar with APC Logo, VOTE banner & Fingerprint stamp */}
        <div className="bg-[#008037] text-white px-4 sm:px-6 py-3 flex items-center justify-between border-b border-[#00682b]">
          <div className="flex items-center gap-2.5">
            {/* Official APC Logo */}
            <APCLogo />

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs uppercase font-black tracking-wider text-amber-300 block leading-tight">
                  VOTE APC
                </span>
                <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.2 rounded font-bold">
                  2027
                </span>
              </div>
              <span className="text-[11px] text-emerald-100 font-medium hidden sm:block">
                Mimikay Political Movement Endorsed Slate
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Fingerprint Ballot Stamp in header */}
            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20">
              <Fingerprint className="w-4 h-4 text-emerald-300 stroke-[2.3]" />
              <span className="text-[11px] font-black tracking-wider text-white uppercase">
                VOTE
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Candidate Image & Visual Identity with Fingerprint Watermark */}
        <div className="relative h-64 sm:h-72 w-full bg-gray-900 overflow-hidden">
          <img
            src={current.imageUrl}
            alt={current.name}
            className="w-full h-full object-cover object-top transition-transform duration-300"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

          {/* Top Indicators: Candidate Index & VOTE APC Fingerprint Stamp */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <div className="bg-black/60 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
              <span>Candidate {currentIndex + 1} of {candidates.length}</span>
            </div>

            {/* Prominent VOTE Ballot Thumbprint Stamp */}
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-emerald-600 text-white px-3 py-1 rounded-full shadow-lg border border-white/30 animate-pulse">
              <Fingerprint className="w-4 h-4 text-white stroke-[2.5]" />
              <span className="text-xs font-black tracking-widest uppercase">
                VOTE APC
              </span>
            </div>
          </div>

          {/* Swipe Left/Right Hint */}
          <div className="absolute top-12 right-3 bg-black/40 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full hidden sm:block border border-white/10">
            ⇄ Swipe left / right
          </div>

          {/* Bottom Candidate Details on Image */}
          <div className="absolute bottom-3 left-4 right-4 text-white space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-[#008037] text-white px-2 py-0.5 rounded-md shadow-xs">
                <CheckCircle2 className="w-3 h-3 text-emerald-200" />
                <span>OFFICIAL ENDORSEMENT</span>
              </span>
              <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                {current.party}
              </span>
            </div>

            <h3
              id="candidate-modal-title"
              className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight"
            >
              {current.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-200 font-medium">
              {current.office}
            </p>
          </div>
        </div>

        {/* Candidate Details & Resolution with Thumbprint Voting Motif */}
        <div className="p-5 sm:p-7 space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#008037] uppercase tracking-wider flex items-center gap-1.5">
              <Fingerprint className="w-3.5 h-3.5 text-[#008037]" />
              <span>{current.headline}</span>
            </span>
            <p className="text-sm text-gray-700 leading-relaxed pt-1">
              {current.message}
            </p>
          </div>

          {/* Ballot Thumbprint Action Card */}
          <div className="p-3 bg-gradient-to-r from-emerald-50 via-blue-50 to-emerald-50 rounded-2xl border border-emerald-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#008037] text-white flex items-center justify-center shadow-xs flex-shrink-0">
                <Fingerprint className="w-6 h-6 text-white stroke-[2.3]" />
              </div>
              <div className="leading-tight">
                <div className="text-xs font-black text-gray-900 tracking-wide flex items-center gap-1">
                  <span>BALLOT THUMBPRINT:</span>
                  <span className="text-[#008037] font-black">VOTE APC</span>
                </div>
                <div className="text-[11px] text-gray-600 mt-0.5">
                  Stamp your voter card for grassroots progress &amp; unity
                </div>
              </div>
            </div>

            <APCLogo />
          </div>

          {/* Call to action & Navigation buttons */}
          <div className="pt-1 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleCta}
              className="w-full sm:flex-1 py-3 px-5 bg-[#008037] hover:bg-[#0a5d2c] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Fingerprint className="w-4 h-4 text-emerald-200" />
              <span>{current.ctaText || 'VOTE APC · Support Candidate'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Previous & Next Arrows */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
              <button
                type="button"
                onClick={handlePrev}
                className="p-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none"
                aria-label="Previous candidate"
                title="Previous candidate (Swipe Right)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="p-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none"
                aria-label="Next candidate"
                title="Next candidate (Swipe Left)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 pt-1">
            {candidates.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                aria-label={`Jump to candidate ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  currentIndex === i ? 'w-6 bg-[#008037]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
