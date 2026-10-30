import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Calendar, ArrowRight } from 'lucide-react';
import { CampaignPopup } from '../types';
import { store } from '../services/store';

interface Props {
  isHomepage: boolean;
  onNavigate?: (path: string) => void;
  // If previewCampaign is provided, force render as a live preview modal in admin
  previewCampaign?: CampaignPopup | null;
  onClosePreview?: () => void;
}

export const CampaignModal: React.FC<Props> = ({
  isHomepage,
  onNavigate,
  previewCampaign,
  onClosePreview,
}) => {
  const [campaign, setCampaign] = useState<CampaignPopup | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Normal public site trigger
  useEffect(() => {
    if (previewCampaign) {
      setCampaign(previewCampaign);
      setIsOpen(true);
      return;
    }

    const active = store.getActiveCampaign(isHomepage);
    if (!active) {
      setCampaign(null);
      setIsOpen(false);
      return;
    }

    const delay = (active.displayDelaySeconds ?? 3) * 1000;
    const timer = setTimeout(() => {
      setCampaign(active);
      setIsOpen(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [isHomepage, previewCampaign]);

  // Keyboard accessibility: ESC key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, campaign]);

  const handleDismiss = () => {
    setIsOpen(false);
    if (previewCampaign && onClosePreview) {
      onClosePreview();
    } else if (campaign) {
      store.dismissCampaign(campaign.id);
    }
  };

  const handleCtaClick = () => {
    if (!campaign) return;

    if (campaign.ctaUrl.startsWith('/') && onNavigate) {
      onNavigate(campaign.ctaUrl);
    } else {
      window.open(campaign.ctaUrl, '_blank', 'noopener,noreferrer');
    }

    handleDismiss();
  };

  if (!isOpen || !campaign) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="campaign-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleDismiss}
    >
      <div
        className="relative bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Dismiss Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3.5 right-3.5 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close announcement"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Campaign Image if available */}
        {campaign.imageUrl && (
          <div className="relative h-48 sm:h-56 w-full bg-emerald-950 overflow-hidden">
            <img
              src={campaign.imageUrl}
              alt={campaign.headline}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <span className="text-xs uppercase tracking-wider text-emerald-300 font-bold">
                Special Movement Announcement
              </span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-4">
          <div>
            <h3
              id="campaign-modal-title"
              className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug tracking-tight"
            >
              {campaign.headline}
            </h3>
          </div>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            {campaign.message}
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={handleCtaClick}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 text-sm font-semibold text-white bg-[#008037] hover:bg-[#0a5d2c] rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#008037]"
            >
              <span>{campaign.ctaText || 'Learn More'}</span>
              {campaign.ctaUrl.startsWith('http') ? (
                <ExternalLink className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              className="py-3 px-4 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Remind Me Later
            </button>
          </div>

          {/* Quiet dismissal disclosure */}
          <div className="text-center">
            <span className="text-xs text-gray-400">
              Suppressed for {campaign.dismissalFrequencyDays} day{campaign.dismissalFrequencyDays > 1 ? 's' : ''} once dismissed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
