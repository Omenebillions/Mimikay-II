import React, { useState } from 'react';
import { SiteSettings } from '../types';
import { ExternalLink, X, Flame } from 'lucide-react';

interface Props {
  settings: SiteSettings;
}

export const AnnouncementStrip: React.FC<Props> = ({ settings }) => {
  const [dismissed, setDismissed] = useState(false);

  if (!settings.announcementEnabled || dismissed) {
    return null;
  }

  const marqueeItem = (
    <div className="flex items-center gap-8 px-6">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-white flex-shrink-0">
          <Flame className="w-3 h-3 text-amber-300 fill-amber-300" />
        </span>
        <span className="font-medium text-white/95 tracking-wide">
          Stay updated with the latest political news with our blog &mdash;
        </span>
        <a
          href={settings.blogUrl || 'https://kangaroo.ng'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-bold text-white bg-white/15 hover:bg-white/25 px-2.5 py-0.5 rounded transition-colors underline underline-offset-2 ml-1"
        >
          <span>kangaroo.ng</span>
          <ExternalLink className="w-3 h-3" />
        </a>
        <span className="text-white/80 ml-2 font-normal">
          &mdash; Your home for grassroots updates &amp; political developments!
        </span>
      </div>
      <span className="text-white/40 text-xs" aria-hidden="true">✦</span>
    </div>
  );

  return (
    <aside
      role="region"
      aria-label="Breaking Political News Marquee"
      className="bg-[#008037] text-white text-xs sm:text-sm font-medium border-b border-[#00682b] relative z-40 overflow-hidden shadow-xs"
    >
      <div className="flex items-center justify-between">
        {/* Right-to-Left Moving Marquee Stream */}
        <div className="flex-1 overflow-hidden py-2 cursor-pointer" title="Pause on hover">
          <div className="animate-marquee-rtl flex items-center whitespace-nowrap">
            {marqueeItem}
            {marqueeItem}
            {marqueeItem}
            {marqueeItem}
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none z-10 bg-[#008037]"
          aria-label="Dismiss news marquee"
          title="Dismiss marquee"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
