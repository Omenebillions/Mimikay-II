import React from 'react';
import { ArrowRight, Calendar, MapPin, Users, CheckCircle2, Play, ExternalLink, Fingerprint } from 'lucide-react';
import { SiteSettings, MPMEvent, CorePillar } from '../types';
import { APC_LOGO_DATA_URL } from '../data/apcLogo';

interface Props {
  settings: SiteSettings;
  pillars: CorePillar[];
  events: MPMEvent[];
  onNavigate: (path: string) => void;
  onOpenCandidatesModal?: () => void;
}

export const HomePage: React.FC<Props> = ({
  settings,
  pillars,
  events,
  onNavigate,
  onOpenCandidatesModal,
}) => {
  // Find featured or first event with youtube embed
  const featuredVideoEvent = events.find((e) => e.youtubeId) || events[0];
  const recentEvents = events.slice(0, 3);

  const heroBg = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhUItLaqR0U0TP-3-Yx526JKmZHBmzLGjXodROIXgXfaIh4Dk4-hoPDUQNwODXqNDDDjgSYCtMNu6r51ENSLus6LwxZoXUpdSeQETvrQ2jF7IiPM6iaSFsj5aDTj8p2uMsal6tKRUd5oo_9DGCcqwHL_gK367P_GywT2ZvzWMGGveAI9_MceJre25_2yNI/s808/The%20Mimikay%20Political%20Movement,%20led%20by%20Hon.%20Oghenekaro%20Akpososo,%20has%20commended%20Delta%20State%20Gover.jpg';

  return (
    <div className="space-y-0">
      {/* 2. Hero Section */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center text-white overflow-hidden">
        {/* Background Image with Dark Readable Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url(${heroBg})` }}
          aria-hidden="true"
        />
        {/* Multi-stage gradient overlay for optimal text contrast and brand identity */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/60" />
        <div className="absolute inset-0 bg-[#008037]/20 mix-blend-multiply" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Voice for Delta Grassroot Development Initiative</span>
            </div>

            {onOpenCandidatesModal && (
              <button
                type="button"
                onClick={onOpenCandidatesModal}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs sm:text-sm font-bold backdrop-blur-md transition-all shadow-xs cursor-pointer"
              >
                <img src={APC_LOGO_DATA_URL} alt="APC" className="h-4 w-auto object-contain rounded-2xs" />
                <Fingerprint className="w-4 h-4 text-emerald-300 stroke-[2.3]" />
                <span>VOTE APC Candidates</span>
                <span className="text-[10px] bg-amber-400 text-black px-1.5 py-0.2 rounded font-extrabold uppercase">
                  Swipe
                </span>
              </button>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
            {settings.heroHeadline}
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg lg:text-xl text-gray-200 font-normal leading-relaxed">
            {settings.heroSubtitle}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/events')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#008037] hover:bg-[#0a5d2c] text-white font-semibold text-base rounded-xl shadow-lg shadow-black/20 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#008037] focus:ring-offset-2"
            >
              <span>{settings.heroButtonPrimaryText || 'Explore Our Events'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {onOpenCandidatesModal && (
              <button
                type="button"
                onClick={onOpenCandidatesModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-base rounded-xl shadow-lg transition-all duration-200"
              >
                <img src={APC_LOGO_DATA_URL} alt="APC" className="h-6 w-auto object-contain rounded-xs shadow-2xs" />
                <Fingerprint className="w-5 h-5 text-black stroke-[2.4]" />
                <span>VOTE APC Candidates</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => onNavigate('/about')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/15 hover:bg-white/25 text-white font-semibold text-base rounded-xl backdrop-blur-sm border border-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span>{settings.heroButtonSecondaryText || 'Learn About MPM'}</span>
            </button>
          </div>

          <div className="pt-6 flex items-center justify-center gap-6 text-xs sm:text-sm text-gray-300">
            <span>Hon. Oghenekaro Akpososo, Convener</span>
            <span aria-hidden="true">·</span>
            <span>Delta State &amp; National Mobilization</span>
          </div>
        </div>
      </section>

      {/* 3. Short Introduction to MPM and Grassroots Purpose */}
      <section className="bg-white py-16 sm:py-20 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="text-xs uppercase tracking-widest text-[#008037] font-bold">
            Who We Are
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Grassroots Power for Lasting Community Impact
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            The <strong className="text-gray-900">Mimikay Political Movement (MPM)</strong> is a coalition of dedicated citizens, community leaders, mothers, fathers, and energetic youths united by a single mission: the holistic revitalization of our towns and wards through active, responsible civic participation.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#008037]" />
              <span className="font-medium">Active Citizen Participation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#008037]" />
              <span className="font-medium">Inclusive Ward Leadership</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#008037]" />
              <span className="font-medium">Accountable Development</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Three Polished Pillar Cards: Unity, Progress, Good Governance */}
      <section className="bg-[#f4f7f6] py-18 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#008037] font-bold">
              Foundational Principles
            </span>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Our Core Pillars
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              The three core tenets that guide every engagement, consultation, and policy endorsement by the Mimikay Political Movement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar) => (
              <div
                key={pillar.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200/70 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
              >
                <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
                  <img
                    src={pillar.imageUrl}
                    alt={pillar.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <span className="text-white text-xs font-semibold uppercase tracking-wider bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-xs">
                      Pillar
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-[#008037] font-semibold">
                    <span>MPM Grassroots Agenda</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured Latest Announcement with YouTube Video */}
      <section className="bg-white py-18 sm:py-24 border-y border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#008037] font-bold">
                High-Impact Announcement
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mt-1">
                Featured Video &amp; Resolution
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/events')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#008037] hover:underline"
            >
              <span>View All Press Releases</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-[#f9fafb] rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm lg:grid lg:grid-cols-12 items-stretch">
            {/* Video Column (YouTube 7sXgMgx5Wq4) */}
            <div className="lg:col-span-7 bg-black relative flex items-center justify-center min-h-[320px] sm:min-h-[400px]">
              <iframe
                src={`https://www.youtube.com/embed/${featuredVideoEvent.youtubeId || '7sXgMgx5Wq4'}`}
                title="Mimikay Political Movement Video Briefing"
                className="w-full h-full min-h-[340px] sm:min-h-[400px] border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Content Column */}
            <div className="lg:col-span-5 p-7 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <span>Press Statement</span>
                  <span aria-hidden="true">·</span>
                  <span>Ughelli, Delta State</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                  {featuredVideoEvent.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  The <strong>Mimikay Political Movement</strong>, led by Hon. Oghenekaro Akpososo, has reaffirmed its strong support for <strong>President Bola Ahmed Tinubu</strong> and <strong>Governor Sheriff Oborevwori</strong>, while officially endorsing <strong>Senator Ede Dafinone</strong> for a second term in Delta Central.
                </p>
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 text-xs sm:text-sm text-emerald-900 space-y-1">
                  <div className="font-semibold text-[#008037]">Key Resolution</div>
                  <p>
                    Declaration adopted unanimously at Oharisi Primary School, Ughelli, praising accessible legislative governance.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => onNavigate(`/events/${featuredVideoEvent.slug}`)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#008037] hover:bg-[#0a5d2c] text-white font-semibold text-sm rounded-xl shadow-xs transition-colors"
                >
                  <span>Read Full Declaration</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('/events')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-gray-200 font-semibold text-sm rounded-xl transition-colors"
                >
                  <span>More Events</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Latest Events and News in a Responsive Card Grid */}
      <section className="bg-[#f9fafb] py-18 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#008037] font-bold">
              Activities &amp; News
            </span>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Latest Movement Updates
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Verified reports, consultative missions, and grassroots milestones from across Delta State.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentEvents.map((evt) => (
              <article
                key={evt.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200/70 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col"
              >
                <div className="relative h-52 w-full bg-gray-100 overflow-hidden">
                  <img
                    src={evt.imageUrl}
                    alt={evt.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  {evt.category && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-gray-900 text-xs font-semibold px-2.5 py-1 rounded-md shadow-xs">
                      {evt.category}
                    </div>
                  )}
                  {evt.youtubeId && (
                    <div className="absolute bottom-3 right-3 bg-red-600/90 text-white text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                      <Play className="w-3 h-3 fill-current" />
                      <span>Video</span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{evt.eventDate}</span>
                      {evt.location && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="truncate">{evt.location}</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 hover:text-[#008037] transition-colors">
                      <button
                        onClick={() => onNavigate(`/events/${evt.slug}`)}
                        className="text-left font-bold"
                      >
                        {evt.title}
                      </button>
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                      {evt.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <button
                      onClick={() => onNavigate(`/events/${evt.slug}`)}
                      className="text-xs font-bold text-[#008037] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Read Story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs text-gray-400">MPM Press</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => onNavigate('/events')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-800 hover:text-[#008037] border border-gray-300 font-semibold text-sm rounded-xl shadow-xs hover:border-[#008037] transition-colors"
            >
              <span>View All 4 Stories &amp; Archives</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. Prominent Community Engagement Section Linking to WhatsApp */}
      <section className="bg-gradient-to-br from-[#008037] via-[#0a5d2c] to-[#004d20] text-white py-20 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md mb-2">
            <Users className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Stand With MPM: Transform Delta From The Grassroots Up
          </h2>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-emerald-100 leading-relaxed font-normal">
            True democracy happens when citizens actively engage. Join thousands of dedicated community members in our official WhatsApp group to participate in ward assemblies, receive real-time updates, and shape community policy.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={settings.whatsappGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#008037] hover:bg-emerald-50 font-bold text-base rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="WhatsApp"
                className="w-5 h-5"
              />
              <span>Join Official WhatsApp Community</span>
              <ExternalLink className="w-4 h-4 text-[#008037]" />
            </a>

            <button
              onClick={() => onNavigate('/contact')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-base rounded-xl backdrop-blur-sm border border-white/20 transition-all duration-200"
            >
              <span>Contact Ward Coordinator</span>
            </button>
          </div>

          <div className="pt-4 text-xs text-emerald-200/80">
            Official Group Link: <span className="underline">{settings.whatsappGroupUrl}</span>
          </div>
        </div>
      </section>
    </div>
  );
};
