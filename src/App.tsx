import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { store } from './services/store';
import { MPMEvent, SiteSettings, CampaignPopup, CorePillar, APCCandidate } from './types';

// Components
import { AnnouncementStrip } from './components/AnnouncementStrip';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppFloat } from './components/WhatsAppFloat';
import { CampaignModal } from './components/CampaignModal';
import { CandidateCarouselModal } from './components/CandidateCarouselModal';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { MissionPage } from './pages/MissionPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [settings, setSettings] = useState<SiteSettings>(() => store.getSettings());
  const [events, setEvents] = useState<MPMEvent[]>(() => store.getEvents(true));
  const [campaigns, setCampaigns] = useState<CampaignPopup[]>(() => store.getCampaigns());
  const [candidates, setCandidates] = useState<APCCandidate[]>(() => store.getCandidates(true));
  const [pillars] = useState<CorePillar[]>(() => store.getPillars());

  // 5 APC Candidates swipable modal state
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);

  // Auto trigger the candidates modal EVERY TIME the home page is loaded
  useEffect(() => {
    const isHome = currentPath === '/' || currentPath === '';
    if (isHome) {
      const timer = setTimeout(() => {
        setIsCandidateModalOpen(true);
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setIsCandidateModalOpen(false);
    }
  }, [currentPath]);

  // Listen to store updates
  useEffect(() => {
    const handleSettingsUpdated = () => setSettings(store.getSettings());
    const handleEventsUpdated = () => setEvents(store.getEvents(true));
    const handleCampaignsUpdated = () => setCampaigns(store.getCampaigns());
    const handleCandidatesUpdated = () => setCandidates(store.getCandidates(true));

    window.addEventListener('mpm-settings-updated', handleSettingsUpdated);
    window.addEventListener('mpm-events-updated', handleEventsUpdated);
    window.addEventListener('mpm-campaigns-updated', handleCampaignsUpdated);
    window.addEventListener('mpm-candidates-updated', handleCandidatesUpdated);

    // Browser history back/forward navigation
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('mpm-settings-updated', handleSettingsUpdated);
      window.removeEventListener('mpm-events-updated', handleEventsUpdated);
      window.removeEventListener('mpm-campaigns-updated', handleCampaignsUpdated);
      window.removeEventListener('mpm-candidates-updated', handleCandidatesUpdated);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const refreshData = () => {
    setSettings(store.getSettings());
    setEvents(store.getEvents(true));
    setCampaigns(store.getCampaigns());
    setCandidates(store.getCandidates(true));
  };

  const handleCloseCandidateModal = () => {
    setIsCandidateModalOpen(false);
  };

  // Route matching
  const renderCurrentRoute = () => {
    // 1. Admin Portal
    if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
      return (
        <AdminPage
          settings={settings}
          events={events}
          campaigns={campaigns}
          onNavigate={navigateTo}
          onRefresh={refreshData}
        />
      );
    }

    // 2. Event Detail Page: /events/:slug
    if (currentPath.startsWith('/events/')) {
      const slug = currentPath.replace('/events/', '').trim();
      const event = store.getEventBySlug(slug);
      return (
        <EventDetailPage
          event={event}
          allEvents={events.filter((e) => e.published)}
          onNavigate={navigateTo}
          whatsappGroupUrl={settings.whatsappGroupUrl}
        />
      );
    }

    // 3. Events Listing: /events
    if (currentPath === '/events') {
      return (
        <EventsPage
          events={events.filter((e) => e.published)}
          onNavigate={navigateTo}
        />
      );
    }

    // 4. About Us: /about
    if (currentPath === '/about') {
      return (
        <AboutPage
          settings={settings}
          onNavigate={navigateTo}
        />
      );
    }

    // 5. Mission: /mission
    if (currentPath === '/mission') {
      return (
        <MissionPage
          onNavigate={navigateTo}
        />
      );
    }

    // 6. Contact: /contact
    if (currentPath === '/contact') {
      return (
        <ContactPage
          settings={settings}
        />
      );
    }

    // Default: Home Page: /
    return (
      <HomePage
        settings={settings}
        pillars={pillars}
        events={events.filter((e) => e.published)}
        onNavigate={navigateTo}
        onOpenCandidatesModal={() => setIsCandidateModalOpen(true)}
      />
    );
  };

  const isPublicPage = !currentPath.startsWith('/admin');
  const isHomepage = currentPath === '/' || currentPath === '';

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f9fafb] text-[#1f2937]">
      {/* Accessible skip to main content for screen readers and keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#008037] focus:text-white focus:rounded-md focus:shadow-md"
      >
        Skip to main content
      </a>

      {/* Breaking Political News Marquee (Moves from Right to Left) */}
      {isPublicPage && <AnnouncementStrip settings={settings} />}

      {/* Primary Sticky Header & Navigation */}
      {isPublicPage && (
        <Navbar
          currentPath={currentPath}
          onNavigate={navigateTo}
          settings={settings}
        />
      )}

      {/* Main Page Body with Framer-like transition flow */}
      <main id="main-content" className="flex-1 focus:outline-none overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderCurrentRoute()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Public Footer */}
      {isPublicPage && (
        <Footer
          settings={settings}
          onNavigate={navigateTo}
        />
      )}

      {/* WhatsApp Community Floating Button */}
      {isPublicPage && (
        <WhatsAppFloat
          whatsappUrl={settings.whatsappGroupUrl}
        />
      )}

      {/* Swipable 5 APC Candidates Landing Page Pop-Up Carousel */}
      {isPublicPage && isHomepage && (
        <CandidateCarouselModal
          candidates={candidates}
          isOpen={isCandidateModalOpen}
          onClose={handleCloseCandidateModal}
          onNavigate={navigateTo}
        />
      )}

      {/* Secondary Dynamic Campaign Announcement Pop-up Modal */}
      {isPublicPage && !isCandidateModalOpen && (
        <CampaignModal
          isHomepage={isHomepage}
          onNavigate={navigateTo}
        />
      )}
    </div>
  );
}
