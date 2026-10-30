import React, { useState } from 'react';
import { MPMEvent } from '../types';
import { Calendar, MapPin, ArrowLeft, Share2, Check, ExternalLink, Play } from 'lucide-react';

interface Props {
  event: MPMEvent | undefined;
  allEvents: MPMEvent[];
  onNavigate: (path: string) => void;
  whatsappGroupUrl: string;
}

export const EventDetailPage: React.FC<Props> = ({
  event,
  allEvents,
  onNavigate,
  whatsappGroupUrl,
}) => {
  const [copied, setCopied] = useState(false);

  if (!event) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-[#f9fafb]">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
        <p className="text-gray-600 mb-6 max-w-md">
          The requested news or event record could not be found or has been unpublished.
        </p>
        <button
          onClick={() => onNavigate('/events')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#008037] text-white font-semibold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </button>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.summary,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const relatedEvents = allEvents
    .filter((e) => e.id !== event.id)
    .slice(0, 2);

  return (
    <article className="bg-[#f9fafb] min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('/events')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#008037] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Events &amp; News</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-xs font-semibold text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>

        {/* Title and Metadata */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span className="font-semibold text-[#008037]">{event.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {event.eventDate}
            </span>
            {event.location && (
              <>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {event.location}
                </span>
              </>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-snug">
            {event.title}
          </h1>

          <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed border-l-3 border-[#008037] pl-4 italic">
            {event.summary}
          </p>
        </div>

        {/* Featured Image */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-gray-200/80">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full max-h-[500px] object-cover"
          />
        </div>

        {/* YouTube Video Embed if available */}
        {event.youtubeId && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#008037] font-bold text-sm">
              <Play className="w-4 h-4 fill-current text-red-600" />
              <span>Official Video Coverage</span>
            </div>
            <div className="relative aspect-16/9 w-full rounded-xl overflow-hidden bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${event.youtubeId}`}
                title={event.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Main Body Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-xs">
          <div className="prose prose-emerald max-w-none text-gray-800 text-base sm:text-lg leading-relaxed space-y-6">
            {event.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Verification Sign-off */}
          <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-gray-500">
            <div>
              Published by <strong className="text-gray-800">MPM Media Bureau</strong>
              <span className="block mt-0.5">Voice for Delta Grassroot Development Initiative</span>
            </div>
            <a
              href={whatsappGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#008037] font-bold hover:underline"
            >
              <span>Join community dialogue on WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Related Stories */}
        {relatedEvents.length > 0 && (
          <div className="pt-8 space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Related Movement News</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedEvents.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onNavigate(`/events/${rel.slug}`)}
                  className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-2xs hover:shadow-sm cursor-pointer transition-all flex gap-4 items-center group"
                >
                  <img
                    src={rel.imageUrl}
                    alt={rel.title}
                    className="w-24 h-24 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="space-y-1">
                    <span className="text-xs text-gray-400">{rel.eventDate}</span>
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#008037] line-clamp-2 transition-colors">
                      {rel.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
