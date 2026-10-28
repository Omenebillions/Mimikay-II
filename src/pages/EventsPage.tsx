import React, { useState } from 'react';
import { MPMEvent } from '../types';
import { Calendar, MapPin, Play, Search, ArrowRight, Tag } from 'lucide-react';

interface Props {
  events: MPMEvent[];
  onNavigate: (path: string) => void;
}

export const EventsPage: React.FC<Props> = ({ events, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Endorsement', 'Inauguration', 'Consultation', 'Infrastructure'];

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evt.location && evt.location.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || evt.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-[#f9fafb] min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="border-b border-gray-200 pb-8 space-y-2">
          <div className="text-xs uppercase tracking-widest text-[#008037] font-bold">
            Movement Archive &amp; Press
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Events &amp; Official News
          </h1>
          <p className="text-gray-600 text-base max-w-2xl">
            Official records, consultations, project groundbreakings, and endorsements from the Mimikay Political Movement.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#008037] ${
                  selectedCategory === cat
                    ? 'bg-[#008037] text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search news &amp; events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008037] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
            <Tag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">No events found</h3>
            <p className="text-sm text-gray-500 mt-1">
              Try adjusting your search criteria or resetting the category filter.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredEvents.map((evt) => (
              <article
                key={evt.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col"
              >
                {/* Image Container with Consistent Aspect Ratio (16:9) */}
                <div className="relative aspect-16/9 w-full bg-gray-100 overflow-hidden group">
                  <img
                    src={evt.imageUrl}
                    alt={evt.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Category Chip */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-gray-900 text-xs font-semibold px-2.5 py-1 rounded-md shadow-xs">
                    {evt.category}
                  </div>

                  {/* Video Badge */}
                  {evt.youtubeId && (
                    <div className="absolute bottom-3 right-3 bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch Video</span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    {/* Metadata line without pills */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{evt.eventDate}</span>
                      {evt.location && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="truncate">{evt.location}</span>
                        </>
                      )}
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 tracking-tight leading-snug group-hover:text-[#008037] transition-colors">
                      <button
                        onClick={() => onNavigate(`/events/${evt.slug}`)}
                        className="text-left font-bold hover:text-[#008037]"
                      >
                        {evt.title}
                      </button>
                    </h2>

                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {evt.summary}
                    </p>
                  </div>

                  {/* Card Action */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <button
                      onClick={() => onNavigate(`/events/${evt.slug}`)}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-[#008037] hover:underline"
                    >
                      <span>Read Full Report</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <span className="text-xs text-gray-400">MPM Communiqué</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
