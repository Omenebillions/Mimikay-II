import React from 'react';
import {
  ArrowRight,
  Calendar,
  Users,
  CheckCircle2,
  Play,
  ExternalLink,
  Fingerprint,
  Sparkles,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { motion, type Variants } from 'motion/react';
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

  const heroBg =
    'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhUItLaqR0U0TP-3-Yx526JKmZHBmzLGjXodROIXgXfaIh4Dk4-hoPDUQNwODXqNDDDjgSYCtMNu6r51ENSLus6LwxZoXUpdSeQETvrQ2jF7IiPM6iaSFsj5aDTj8p2uMsal6tKRUd5oo_9DGCcqwHL_gK367P_GywT2ZvzWMGGveAI9_MceJre25_2yNI/s808/The%20Mimikay%20Political%20Movement,%20led%20by%20Hon.%20Oghenekaro%20Akpososo,%20has%20commended%20Delta%20State%20Gover.jpg';

  // Stagger animation container
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="space-y-0 overflow-hidden">
      {/* 1. Hero Section with Framer-like Fluid Stagger & Ambient Lighting */}
      <section className="relative min-h-[620px] lg:min-h-[700px] flex items-center justify-center text-white overflow-hidden">
        {/* Background Image with Slow Ambient Pan Effect */}
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, ease: 'easeOut' }}
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
          style={{ backgroundImage: `url(${heroBg})` }}
          aria-hidden="true"
        />

        {/* Multi-stage Framer Gradient Overlays & Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/60 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-[#008037]/25 mix-blend-multiply" />

        {/* Ambient Floating Glow Orb */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.25, 0.45, 0.25],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Top Interactive Badges */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm" />
                <span>Voice for Delta Grassroot Development Initiative</span>
              </div>

              {onOpenCandidatesModal && (
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={onOpenCandidatesModal}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/80 to-amber-600/80 hover:from-amber-500 hover:to-amber-600 border border-amber-300/40 text-black text-xs sm:text-sm font-black backdrop-blur-xl transition-all shadow-lg cursor-pointer"
                >
                  <img src={APC_LOGO_DATA_URL} alt="APC" className="h-4 w-auto object-contain rounded-2xs" />
                  <Fingerprint className="w-4 h-4 text-black stroke-[2.4]" />
                  <span>VOTE APC</span>
                  <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded font-extrabold uppercase">
                    Auto-Slide
                  </span>
                </motion.button>
              )}
            </motion.div>

            {/* Main Headline with Framer Motion Typography */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] drop-shadow-md text-balance"
            >
              {settings.heroHeadline}
            </motion.h1>

            {/* Subtitle with soft reveal */}
            <motion.p
              variants={itemVariants}
              className="max-w-3xl mx-auto text-base sm:text-lg lg:text-xl text-gray-200 font-normal leading-relaxed drop-shadow"
            >
              {settings.heroSubtitle}
            </motion.p>

            {/* CTAs with Framer Physics Hover & Tap */}
            <motion.div
              variants={itemVariants}
              className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.button
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate('/events')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#008037] hover:bg-[#0a5d2c] text-white font-bold text-base rounded-2xl shadow-xl shadow-emerald-950/40 transition-all focus:outline-none focus:ring-2 focus:ring-[#008037] focus:ring-offset-2 cursor-pointer"
              >
                <span>{settings.heroButtonPrimaryText || 'Explore Our Events'}</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              {onOpenCandidatesModal && (
                <motion.button
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={onOpenCandidatesModal}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-base rounded-2xl shadow-xl shadow-amber-950/30 transition-all cursor-pointer"
                >
                  <img
                    src={APC_LOGO_DATA_URL}
                    alt="APC"
                    className="h-6 w-auto object-contain rounded-xs shadow-2xs"
                  />
                  <Fingerprint className="w-5 h-5 text-black stroke-[2.4]" />
                  <span>VOTE APC Candidates</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              )}

              <motion.button
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate('/about')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-base rounded-2xl backdrop-blur-xl border border-white/25 transition-all focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
              >
                <span>{settings.heroButtonSecondaryText || 'Learn About MPM'}</span>
              </motion.button>
            </motion.div>

            {/* Attribution */}
            <motion.div
              variants={itemVariants}
              className="pt-6 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-gray-300"
            >
              <span className="font-semibold text-emerald-300">Hon. Oghenekaro Akpososo, Convener</span>
              <span aria-hidden="true" className="text-white/40">·</span>
              <span>Delta Central &amp; National Grassroots Mobilization</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. Short Introduction with Scroll InView Animation */}
      <section className="bg-white py-18 sm:py-24 border-b border-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6"
        >
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#008037] font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            <Sparkles className="w-3.5 h-3.5 text-[#008037]" />
            <span>Who We Are</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight text-balance">
            Grassroots Power for Lasting Community Impact
          </h2>

          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            The <strong className="text-gray-900 font-bold">Mimikay Political Movement (MPM)</strong> is a coalition of dedicated citizens, community leaders, mothers, fathers, and energetic youths united by a single mission: the holistic revitalization of our towns and wards through active, responsible civic participation.
          </p>

          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-800">
            <motion.div
              whileHover={{ y: -3 }}
              className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center gap-2.5 transition-shadow hover:shadow-xs"
            >
              <CheckCircle2 className="w-5 h-5 text-[#008037] flex-shrink-0" />
              <span className="font-semibold">Active Citizen Participation</span>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center gap-2.5 transition-shadow hover:shadow-xs"
            >
              <CheckCircle2 className="w-5 h-5 text-[#008037] flex-shrink-0" />
              <span className="font-semibold">Inclusive Ward Leadership</span>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center gap-2.5 transition-shadow hover:shadow-xs"
            >
              <CheckCircle2 className="w-5 h-5 text-[#008037] flex-shrink-0" />
              <span className="font-semibold">Accountable Development</span>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 3. Three Polished Pillar Cards with Staggered Entrance & Interactive Physics */}
      <section className="bg-[#f4f7f6] py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center max-w-2xl mx-auto mb-14 space-y-3"
          >
            <span className="text-xs uppercase tracking-widest text-[#008037] font-bold">
              Foundational Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Our Core Pillars
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              The three core tenets that guide every engagement, consultation, and policy endorsement by the Mimikay Political Movement.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, idx) => (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: 'easeOut' }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-60 w-full bg-gray-100 overflow-hidden">
                  <img
                    src={pillar.imageUrl}
                    alt={pillar.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3.5 left-4 flex items-center gap-2">
                    <span className="text-white text-xs font-bold uppercase tracking-wider bg-black/60 px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
                      Pillar 0{idx + 1}
                    </span>
                  </div>
                </div>

                <div className="p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-2 group-hover:text-[#008037] transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-[#008037] font-bold">
                    <span>MPM Grassroots Agenda</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Latest Announcement with YouTube Video & Framer Container Glow */}
      <section className="bg-white py-20 sm:py-28 border-y border-gray-200/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4"
          >
            <div>
              <span className="text-xs uppercase tracking-widest text-[#008037] font-bold">
                High-Impact Announcement
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
                Featured Video &amp; Resolution
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/events')}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#008037] hover:underline"
            >
              <span>View All Press Releases</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="bg-[#f9fafb] rounded-3xl border border-gray-200/90 overflow-hidden shadow-lg lg:grid lg:grid-cols-12 items-stretch"
          >
            {/* Video Column (YouTube 7sXgMgx5Wq4) */}
            <div className="lg:col-span-7 bg-black relative flex items-center justify-center min-h-[340px] sm:min-h-[420px]">
              <iframe
                src={`https://www.youtube.com/embed/${featuredVideoEvent.youtubeId || '7sXgMgx5Wq4'}`}
                title="Mimikay Political Movement Video Briefing"
                className="w-full h-full min-h-[340px] sm:min-h-[420px] border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Content Column */}
            <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    Press Statement
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Ughelli, Delta State</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                  {featuredVideoEvent.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  The <strong>Mimikay Political Movement</strong>, led by Hon. Oghenekaro Akpososo, has reaffirmed its strong support for <strong>President Bola Ahmed Tinubu</strong> and <strong>Governor Sheriff Oborevwori</strong>, while officially endorsing <strong>Senator Ede Dafinone</strong> for a second term in Delta Central.
                </p>
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-xs sm:text-sm text-emerald-950 space-y-1">
                  <div className="font-bold text-[#008037] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Key Resolution</span>
                  </div>
                  <p className="text-gray-700">
                    Declaration adopted unanimously at Oharisi Primary School, Ughelli, praising accessible legislative governance.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate(`/events/${featuredVideoEvent.slug}`)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#008037] hover:bg-[#0a5d2c] text-white font-bold text-sm rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  <span>Read Full Declaration</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                <button
                  onClick={() => onNavigate('/events')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-gray-200 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  <span>More Events</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. Latest Events and News in a Responsive Card Grid with Hover Animations */}
      <section className="bg-[#f9fafb] py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-14 space-y-3"
          >
            <span className="text-xs uppercase tracking-widest text-[#008037] font-bold">
              Activities &amp; News
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Latest Movement Updates
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Verified reports, consultative missions, and grassroots milestones from across Delta State.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentEvents.map((evt, idx) => (
              <motion.article
                key={evt.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.6, delay: idx * 0.12, ease: 'easeOut' }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
                  <img
                    src={evt.imageUrl}
                    alt={evt.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    loading="lazy"
                  />
                  {evt.category && (
                    <div className="absolute top-3.5 left-3.5 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-md border border-white/20">
                      {evt.category}
                    </div>
                  )}
                  {evt.youtubeId && (
                    <div className="absolute bottom-3.5 right-3.5 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                      <Play className="w-3 h-3 fill-current" />
                      <span>Video</span>
                    </div>
                  )}
                </div>

                <div className="p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
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
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-[#008037] transition-colors leading-snug">
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
                      className="text-xs font-bold text-[#008037] group-hover:underline inline-flex items-center gap-1"
                    >
                      <span>Read Story</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                    <span className="text-xs text-gray-400 font-medium">MPM Press</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('/events')}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-gray-800 hover:text-[#008037] border border-gray-300 font-bold text-sm rounded-2xl shadow-xs hover:border-[#008037] transition-all cursor-pointer"
            >
              <span>View All 4 Stories &amp; Archives</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* 6. Prominent Community Engagement Section Linking to WhatsApp with Ambient Particles */}
      <section className="bg-gradient-to-br from-[#008037] via-[#0a5d2c] to-[#004d20] text-white py-24 relative overflow-hidden">
        {/* Animated ambient ambient rings */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-white/5 pointer-events-none blur-2xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [180, 0, 180] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-emerald-400/10 pointer-events-none blur-2xl"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7 relative z-10"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex items-center justify-center w-18 h-18 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 mb-1 shadow-xl"
          >
            <Users className="w-9 h-9 text-white" />
          </motion.div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight text-balance">
            Stand With MPM: Transform Delta From The Grassroots Up
          </h2>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-emerald-100 leading-relaxed font-normal">
            True democracy happens when citizens actively engage. Join thousands of dedicated community members in our official WhatsApp group to participate in ward assemblies, receive real-time updates, and shape community policy.
          </p>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href={settings.whatsappGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4.5 bg-white text-[#008037] hover:bg-emerald-50 font-extrabold text-base rounded-2xl shadow-2xl hover:shadow-emerald-950/40 transition-all duration-200"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="WhatsApp"
                className="w-5 h-5"
              />
              <span>Join Official WhatsApp Community</span>
              <ExternalLink className="w-4 h-4 text-[#008037]" />
            </motion.a>

            <motion.button
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('/contact')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4.5 bg-white/10 hover:bg-white/20 text-white font-bold text-base rounded-2xl backdrop-blur-xl border border-white/25 transition-all duration-200 cursor-pointer"
            >
              <span>Contact Ward Coordinator</span>
            </motion.button>
          </div>

          <div className="pt-2 text-xs text-emerald-200/90 font-mono">
            Official Group Link: <span className="underline">{settings.whatsappGroupUrl}</span>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
