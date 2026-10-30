import { MPMEvent, SiteSettings, CampaignPopup, CorePillar, APCCandidate, SoundCloudTrack } from '../types';
import {
  SEED_EVENTS,
  SEED_SETTINGS,
  SEED_CAMPAIGNS,
  SEED_PILLARS,
  SEED_CANDIDATES,
  SEED_SOUNDCLOUD_TRACKS,
} from '../data/seedData';

const STORAGE_KEYS = {
  EVENTS: 'mpm_events_data_v1',
  SETTINGS: 'mpm_settings_data_v1',
  CAMPAIGNS: 'mpm_campaigns_data_v1',
  CANDIDATES: 'mpm_candidates_data_v1',
  SOUNDCLOUD_TRACKS: 'mpm_soundcloud_tracks_v1',
  DISMISSED_CAMPAIGNS: 'mpm_dismissed_campaigns_v1',
  ADMIN_AUTH: 'mpm_admin_authenticated_v1',
  ADMIN_EMAIL: 'mpm_admin_email_v1',
};

// Clean any accidental base64 image strings to ensure zero base64 database storage
function sanitizeImageUrl(url: string | undefined, fallback: string): string {
  if (!url) return fallback;
  // If url is a large base64 image, discard it and return the authentic Blogger fallback
  if (url.startsWith('data:image/') && url.length > 500) {
    return fallback;
  }
  return url;
}

class StoreService {
  private events: MPMEvent[] = [];
  private settings: SiteSettings = SEED_SETTINGS;
  private campaigns: CampaignPopup[] = [];
  private candidates: APCCandidate[] = [];
  private soundCloudTracks: SoundCloudTrack[] = [];
  private initialized = false;

  constructor() {
    this.init();
  }

  public init(): void {
    if (typeof window === 'undefined') return;

    try {
      // 1. Load Settings
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) {
        this.settings = { ...SEED_SETTINGS, ...JSON.parse(savedSettings) };
      } else {
        this.settings = { ...SEED_SETTINGS };
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
      }

      // 2. Load Events (idempotent seed initialization & sanitize base64)
      const savedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (savedEvents) {
        const parsed = JSON.parse(savedEvents) as MPMEvent[];
        const sanitized = parsed.map((e, idx) => ({
          ...e,
          imageUrl: sanitizeImageUrl(e.imageUrl, SEED_EVENTS[idx % SEED_EVENTS.length].imageUrl),
        }));
        const existingIds = new Set(sanitized.map((e) => e.id));
        const merged = [...sanitized];
        for (const seed of SEED_EVENTS) {
          if (!existingIds.has(seed.id)) {
            merged.push(seed);
          }
        }
        this.events = merged;
      } else {
        this.events = [...SEED_EVENTS];
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(this.events));
      }

      // 3. Load Campaigns
      const savedCampaigns = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
      if (savedCampaigns) {
        this.campaigns = JSON.parse(savedCampaigns);
      } else {
        this.campaigns = [...SEED_CAMPAIGNS];
        localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(this.campaigns));
      }

      // 4. Load Candidates Popups (purging Omo-Agege and sanitizing base64)
      const savedCandidates = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
      if (savedCandidates) {
        const parsedCand = (JSON.parse(savedCandidates) as APCCandidate[])
          .filter((c) => c.id !== 'cand-5' && !c.name?.toLowerCase().includes('omo-agege'))
          .map((c, idx) => ({
            ...c,
            imageUrl: sanitizeImageUrl(c.imageUrl, SEED_CANDIDATES[idx % SEED_CANDIDATES.length].imageUrl),
          }));
        const existingCandIds = new Set(parsedCand.map((c) => c.id));
        const mergedCand = [...parsedCand];
        for (const seed of SEED_CANDIDATES) {
          if (!existingCandIds.has(seed.id)) {
            mergedCand.push(seed);
          }
        }
        this.candidates = mergedCand;
        localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(this.candidates));
      } else {
        this.candidates = [...SEED_CANDIDATES];
        localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(this.candidates));
      }

      // 5. Load Audio Tracks (YouTube Music & SoundCloud)
      const savedTracks = localStorage.getItem(STORAGE_KEYS.SOUNDCLOUD_TRACKS);
      if (savedTracks) {
        const parsedTracks = JSON.parse(savedTracks) as SoundCloudTrack[];
        const mergedTracks = [...parsedTracks];
        for (const seed of SEED_SOUNDCLOUD_TRACKS) {
          if (!mergedTracks.some(t => t.url === seed.url || t.id === seed.id)) {
            mergedTracks.unshift(seed);
          }
        }
        this.soundCloudTracks = mergedTracks;
        localStorage.setItem(STORAGE_KEYS.SOUNDCLOUD_TRACKS, JSON.stringify(this.soundCloudTracks));
      } else {
        this.soundCloudTracks = [...SEED_SOUNDCLOUD_TRACKS];
        localStorage.setItem(STORAGE_KEYS.SOUNDCLOUD_TRACKS, JSON.stringify(this.soundCloudTracks));
      }

      // Ensure soundCloudUrl is set to the default YouTube Music APC song
      if (!this.settings.soundCloudUrl || this.settings.soundCloudUrl.includes('all-progressives-congress-apc-campaign-songs')) {
        this.settings.soundCloudUrl = SEED_SETTINGS.soundCloudUrl;
        this.settings.soundCloudEnabled = true;
        this.settings.soundCloudAutoplay = true;
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
      }

      this.initialized = true;

      // Asynchronously sync with Cloudflare D1 server-side API if available
      this.syncWithServer();
    } catch (err) {
      console.error('Error initializing MPM store:', err);
      this.settings = { ...SEED_SETTINGS };
      this.events = [...SEED_EVENTS];
      this.campaigns = [...SEED_CAMPAIGNS];
      this.candidates = [...SEED_CANDIDATES];
      this.soundCloudTracks = [...SEED_SOUNDCLOUD_TRACKS];
    }
  }

  // Background hydration from Cloudflare D1 SQL
  private async syncWithServer(): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      // 1. Fetch settings from D1
      const settingsRes = await fetch('/api/settings').catch(() => null);
      if (settingsRes && settingsRes.ok) {
        const serverSettings = await settingsRes.json();
        if (serverSettings && serverSettings.hero_headline) {
          this.settings = {
            ...this.settings,
            heroHeadline: serverSettings.hero_headline || this.settings.heroHeadline,
            heroSubtitle: serverSettings.hero_subtitle || this.settings.heroSubtitle,
            announcementText: serverSettings.announcement_text || this.settings.announcementText,
            blogUrl: serverSettings.blog_url || this.settings.blogUrl,
            whatsappGroupUrl: serverSettings.whatsapp_group_url || this.settings.whatsappGroupUrl,
            soundCloudUrl: serverSettings.soundcloud_url || this.settings.soundCloudUrl,
            soundCloudEnabled: serverSettings.soundcloud_enabled !== undefined ? Boolean(serverSettings.soundcloud_enabled) : this.settings.soundCloudEnabled,
          };
          window.dispatchEvent(new CustomEvent('mpm-settings-updated', { detail: this.settings }));
        }
      }

      // 2. Fetch events from D1
      const eventsRes = await fetch('/api/events').catch(() => null);
      if (eventsRes && eventsRes.ok) {
        const serverEvents = await eventsRes.json();
        if (Array.isArray(serverEvents) && serverEvents.length > 0) {
          const mapped: MPMEvent[] = serverEvents.map((r: any) => ({
            id: r.id,
            slug: r.slug,
            title: r.title,
            summary: r.summary,
            content: r.content,
            imageUrl: r.image_url,
            youtubeId: r.youtube_id || undefined,
            eventDate: r.event_date,
            location: r.location || '',
            published: Boolean(r.published),
            featured: Boolean(r.featured),
            category: r.category || 'General',
            createdAt: r.created_at || new Date().toISOString(),
            updatedAt: r.updated_at || new Date().toISOString(),
          }));
          this.events = mapped;
          localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(this.events));
          window.dispatchEvent(new CustomEvent('mpm-events-updated', { detail: this.events }));
        }
      }

      // 3. Fetch candidates from D1
      const candRes = await fetch('/api/candidates').catch(() => null);
      if (candRes && candRes.ok) {
        const serverCands = await candRes.json();
        if (Array.isArray(serverCands) && serverCands.length > 0) {
          const mappedCand: APCCandidate[] = serverCands.map((r: any) => ({
            id: r.id,
            name: r.name,
            office: r.office || '',
            party: r.party || 'All Progressives Congress (APC)',
            headline: r.headline || '',
            message: r.message || '',
            imageUrl: r.image_url,
            ctaText: r.cta_text || 'Learn More',
            ctaUrl: r.cta_url || '',
            orderIndex: r.order_index ?? 1,
            enabled: Boolean(r.enabled),
          }));
          this.candidates = mappedCand.filter(
            (c) => c.id !== 'cand-5' && !c.name?.toLowerCase().includes('omo-agege')
          );
          localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(this.candidates));
          window.dispatchEvent(new CustomEvent('mpm-candidates-updated', { detail: this.candidates }));
        }
      }
    } catch {
      // Graceful offline fallback
    }
  }

  private getAuthHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: 'Bearer mpm2026',
      'X-Admin-Email': this.getAdminEmail() || 'tintvillenigeria@gmail.com',
    };
  }

  public getPillars(): CorePillar[] {
    return SEED_PILLARS;
  }

  // --- SETTINGS ---
  public getSettings(): SiteSettings {
    if (!this.initialized) this.init();
    return { ...this.settings };
  }

  public updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    this.settings = { ...this.settings, ...updates };
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
      window.dispatchEvent(new CustomEvent('mpm-settings-updated', { detail: this.settings }));
      // Server-side write to Cloudflare D1
      fetch('/api/settings', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(this.settings),
      }).catch(() => null);
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
    return { ...this.settings };
  }

  // --- EVENTS ---
  public getEvents(includeUnpublished = false): MPMEvent[] {
    if (!this.initialized) this.init();
    const list = includeUnpublished ? this.events : this.events.filter((e) => e.published);
    return [...list].sort(
      (a, b) => new Date(b.eventDate || b.createdAt).getTime() - new Date(a.eventDate || a.createdAt).getTime()
    );
  }

  public getEventBySlug(slug: string): MPMEvent | undefined {
    if (!this.initialized) this.init();
    return this.events.find((e) => e.slug === slug);
  }

  public getEventById(id: string): MPMEvent | undefined {
    if (!this.initialized) this.init();
    return this.events.find((e) => e.id === id);
  }

  public saveEvent(event: Omit<MPMEvent, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): MPMEvent {
    const now = new Date().toISOString();
    let saved: MPMEvent;

    if (event.id) {
      const index = this.events.findIndex((e) => e.id === event.id);
      if (index >= 0) {
        saved = {
          ...this.events[index],
          ...event,
          id: event.id,
          updatedAt: now,
        };
        this.events[index] = saved;
      } else {
        saved = {
          ...event,
          id: event.id,
          createdAt: now,
          updatedAt: now,
        };
        this.events.unshift(saved);
      }
    } else {
      const generatedId = 'evt-' + Date.now();
      const generatedSlug = (event.slug || event.title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      saved = {
        ...event,
        id: generatedId,
        slug: generatedSlug,
        createdAt: now,
        updatedAt: now,
      };
      this.events.unshift(saved);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(this.events));
      window.dispatchEvent(new CustomEvent('mpm-events-updated', { detail: this.events }));
      // Server-side write to Cloudflare D1
      fetch('/api/events', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(saved),
      }).catch(() => null);
    } catch (err) {
      console.error('Failed to save event:', err);
    }

    return saved;
  }

  public deleteEvent(id: string): boolean {
    const beforeCount = this.events.length;
    this.events = this.events.filter((e) => e.id !== id);
    if (this.events.length !== beforeCount) {
      try {
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(this.events));
        window.dispatchEvent(new CustomEvent('mpm-events-updated', { detail: this.events }));
        // Server-side write to Cloudflare D1
        fetch(`/api/events/${id}`, {
          method: 'DELETE',
          headers: this.getAuthHeaders(),
        }).catch(() => null);
      } catch (err) {
        console.error('Failed to delete event:', err);
      }
      return true;
    }
    return false;
  }

  // --- CANDIDATES (SWIPABLE APC POPUP CAROUSEL) ---
  public getCandidates(onlyEnabled = true): APCCandidate[] {
    if (!this.initialized) this.init();
    const list = onlyEnabled ? this.candidates.filter((c) => c.enabled) : this.candidates;
    return [...list].sort((a, b) => a.orderIndex - b.orderIndex);
  }

  public saveCandidate(candidate: Omit<APCCandidate, 'id'> & { id?: string }): APCCandidate {
    let saved: APCCandidate;
    if (candidate.id) {
      const index = this.candidates.findIndex((c) => c.id === candidate.id);
      if (index >= 0) {
        saved = { ...this.candidates[index], ...candidate, id: candidate.id };
        this.candidates[index] = saved;
      } else {
        saved = { ...candidate, id: candidate.id };
        this.candidates.push(saved);
      }
    } else {
      saved = {
        ...candidate,
        id: 'cand-' + Date.now(),
        orderIndex: this.candidates.length + 1,
      };
      this.candidates.push(saved);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(this.candidates));
      window.dispatchEvent(new CustomEvent('mpm-candidates-updated', { detail: this.candidates }));
      // Server-side write to Cloudflare D1
      fetch('/api/candidates', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(saved),
      }).catch(() => null);
    } catch (err) {
      console.error('Failed to save candidate:', err);
    }
    return saved;
  }

  public deleteCandidate(id: string): boolean {
    const beforeCount = this.candidates.length;
    this.candidates = this.candidates.filter((c) => c.id !== id);
    if (this.candidates.length !== beforeCount) {
      try {
        localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(this.candidates));
        window.dispatchEvent(new CustomEvent('mpm-candidates-updated', { detail: this.candidates }));
        // Server-side write to Cloudflare D1
        fetch(`/api/candidates/${id}`, {
          method: 'DELETE',
          headers: this.getAuthHeaders(),
        }).catch(() => null);
      } catch (err) {
        console.error('Failed to delete candidate:', err);
      }
      return true;
    }
    return false;
  }

  // --- CAMPAIGNS ---
  public getCampaigns(): CampaignPopup[] {
    if (!this.initialized) this.init();
    return [...this.campaigns];
  }

  public getActiveCampaign(isHomepage = true): CampaignPopup | null {
    if (!this.initialized) this.init();
    const today = new Date().toISOString().split('T')[0];

    const active = this.campaigns.find((c) => {
      if (!c.enabled || c.isPaused) return false;
      if (c.homepageOnly && !isHomepage) return false;
      if (c.startDate && c.startDate > today) return false;
      if (c.endDate && c.endDate < today) return false;

      // Check suppression period
      if (typeof window !== 'undefined') {
        try {
          const dismissedRaw = localStorage.getItem(STORAGE_KEYS.DISMISSED_CAMPAIGNS);
          if (dismissedRaw) {
            const dismissed = JSON.parse(dismissedRaw);
            const dismissedAt = dismissed[c.id];
            if (dismissedAt) {
              const diffMs = Date.now() - dismissedAt;
              const diffDays = diffMs / (1000 * 60 * 60 * 24);
              if (diffDays < (c.dismissalFrequencyDays || 1)) {
                return false;
              }
            }
          }
        } catch {
          // continue
        }
      }

      return true;
    });

    return active || null;
  }

  public dismissCampaign(campaignId: string): void {
    if (typeof window === 'undefined') return;
    try {
      const dismissedRaw = localStorage.getItem(STORAGE_KEYS.DISMISSED_CAMPAIGNS) || '{}';
      const dismissed = JSON.parse(dismissedRaw);
      dismissed[campaignId] = Date.now();
      localStorage.setItem(STORAGE_KEYS.DISMISSED_CAMPAIGNS, JSON.stringify(dismissed));
    } catch (err) {
      console.error('Failed to record campaign dismissal:', err);
    }
  }

  public saveCampaign(campaign: Omit<CampaignPopup, 'id' | 'createdAt'> & { id?: string }): CampaignPopup {
    let saved: CampaignPopup;
    if (campaign.id) {
      const index = this.campaigns.findIndex((c) => c.id === campaign.id);
      if (index >= 0) {
        saved = { ...this.campaigns[index], ...campaign, id: campaign.id };
        this.campaigns[index] = saved;
      } else {
        saved = { ...campaign, id: campaign.id, createdAt: new Date().toISOString() };
        this.campaigns.unshift(saved);
      }
    } else {
      saved = {
        ...campaign,
        id: 'camp-' + Date.now(),
        createdAt: new Date().toISOString(),
      };
      this.campaigns.unshift(saved);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(this.campaigns));
      window.dispatchEvent(new CustomEvent('mpm-campaigns-updated', { detail: this.campaigns }));
      // Server-side write to Cloudflare D1
      fetch('/api/campaigns', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(saved),
      }).catch(() => null);
    } catch (err) {
      console.error('Failed to save campaign:', err);
    }
    return saved;
  }

  public deleteCampaign(id: string): boolean {
    const beforeCount = this.campaigns.length;
    this.campaigns = this.campaigns.filter((c) => c.id !== id);
    if (this.campaigns.length !== beforeCount) {
      try {
        localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(this.campaigns));
        window.dispatchEvent(new CustomEvent('mpm-campaigns-updated', { detail: this.campaigns }));
        // Server-side write to Cloudflare D1
        fetch(`/api/campaigns/${id}`, {
          method: 'DELETE',
          headers: this.getAuthHeaders(),
        }).catch(() => null);
      } catch (err) {
        console.error('Failed to delete campaign:', err);
      }
      return true;
    }
    return false;
  }

  // --- SOUNDCLOUD TRACKS MANAGEMENT ---
  public getSoundCloudTracks(): SoundCloudTrack[] {
    if (!this.initialized) this.init();
    return [...this.soundCloudTracks];
  }

  public saveSoundCloudTrack(
    track: Omit<SoundCloudTrack, 'id'> & { id?: string }
  ): SoundCloudTrack {
    if (!this.initialized) this.init();
    let saved: SoundCloudTrack;
    if (track.id) {
      this.soundCloudTracks = this.soundCloudTracks.map((t) =>
        t.id === track.id ? { ...t, ...track, id: track.id! } : t
      );
      saved = this.soundCloudTracks.find((t) => t.id === track.id)!;
    } else {
      saved = {
        ...track,
        id: `sc-${Date.now()}`,
        addedAt: new Date().toISOString(),
        enabled: track.enabled ?? true,
      };
      this.soundCloudTracks.unshift(saved);
    }
    try {
      localStorage.setItem(
        STORAGE_KEYS.SOUNDCLOUD_TRACKS,
        JSON.stringify(this.soundCloudTracks)
      );
      window.dispatchEvent(
        new CustomEvent('mpm-soundcloud-updated', { detail: this.soundCloudTracks })
      );
    } catch (err) {
      console.error('Failed to save soundcloud track:', err);
    }
    return saved;
  }

  public deleteSoundCloudTrack(id: string): boolean {
    if (!this.initialized) this.init();
    const initialLen = this.soundCloudTracks.length;
    this.soundCloudTracks = this.soundCloudTracks.filter((t) => t.id !== id);
    if (this.soundCloudTracks.length !== initialLen) {
      try {
        localStorage.setItem(
          STORAGE_KEYS.SOUNDCLOUD_TRACKS,
          JSON.stringify(this.soundCloudTracks)
        );
        window.dispatchEvent(
          new CustomEvent('mpm-soundcloud-updated', { detail: this.soundCloudTracks })
        );
        return true;
      } catch (err) {
        console.error('Failed to delete soundcloud track:', err);
      }
    }
    return false;
  }

  public setActiveSoundCloudUrl(url: string): void {
    this.updateSettings({ soundCloudUrl: url, soundCloudEnabled: true });
  }

  // --- SEED RESET ---
  public resetToOriginalSeed(): void {
    this.settings = { ...SEED_SETTINGS };
    this.events = [...SEED_EVENTS];
    this.campaigns = [...SEED_CAMPAIGNS];
    this.candidates = [...SEED_CANDIDATES];
    this.soundCloudTracks = [...SEED_SOUNDCLOUD_TRACKS];
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(this.events));
      localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(this.campaigns));
      localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(this.candidates));
      localStorage.setItem(STORAGE_KEYS.SOUNDCLOUD_TRACKS, JSON.stringify(this.soundCloudTracks));
      localStorage.removeItem(STORAGE_KEYS.DISMISSED_CAMPAIGNS);
      window.dispatchEvent(new CustomEvent('mpm-settings-updated', { detail: this.settings }));
      window.dispatchEvent(new CustomEvent('mpm-events-updated', { detail: this.events }));
      window.dispatchEvent(new CustomEvent('mpm-campaigns-updated', { detail: this.campaigns }));
      window.dispatchEvent(new CustomEvent('mpm-candidates-updated', { detail: this.candidates }));
      window.dispatchEvent(new CustomEvent('mpm-soundcloud-updated', { detail: this.soundCloudTracks }));
    } catch (err) {
      console.error('Failed to reset store:', err);
    }
  }

  // --- ADMIN AUTH ---
  public isAdminAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  }

  public getAdminEmail(): string {
    if (typeof window === 'undefined') return '';
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_EMAIL) || '';
  }

  public setAdminAuthenticated(auth: boolean, email = ''): void {
    if (typeof window === 'undefined') return;
    if (auth) {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_EMAIL, email || 'tintvillenigeria@gmail.com');
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_EMAIL);
    }
  }
}

export const store = new StoreService();
