export interface MPMEvent {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  youtubeId?: string;
  eventDate: string;
  location?: string;
  published: boolean;
  featured?: boolean;
  category: 'Endorsement' | 'Inauguration' | 'Consultation' | 'Infrastructure' | 'General';
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  heroHeadline: string;
  heroSubtitle: string;
  heroButtonPrimaryText: string;
  heroButtonPrimaryLink: string;
  heroButtonSecondaryText: string;
  heroButtonSecondaryLink: string;
  announcementEnabled: boolean;
  announcementText: string;
  announcementLink: string;
  announcementLinkText: string;
  blogUrl: string;
  whatsappGroupUrl: string;
  contactEmail: string;
  phone1: string;
  phone2: string;
  phone3: string;
  convenerName: string;
  convenerTitle: string;
  convenerImageUrl: string;
  tintvilleUrl: string;
  // Background SoundCloud Music
  soundCloudUrl: string;
  soundCloudEnabled: boolean;
  soundCloudAutoplay: boolean;
  soundCloudStartMuted: boolean;
  soundCloudTracks?: SoundCloudTrack[];
}

export interface SoundCloudTrack {
  id: string;
  title: string;
  url: string;
  artist?: string;
  source?: 'youtube' | 'soundcloud';
  enabled?: boolean;
  addedAt?: string;
}

export interface CampaignPopup {
  id: string;
  title: string;
  headline: string;
  message: string;
  imageUrl?: string;
  ctaText: string;
  ctaUrl: string;
  ctaType: 'whatsapp' | 'event' | 'video' | 'external';
  startDate: string; // ISO date string YYYY-MM-DD
  endDate: string;   // ISO date string YYYY-MM-DD
  enabled: boolean;
  isPaused: boolean;
  homepageOnly: boolean;
  displayDelaySeconds: number;
  dismissalFrequencyDays: number;
  createdAt: string;
}

export interface CorePillar {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface APCCandidate {
  id: string;
  name: string;
  office: string;
  party: string;
  headline: string;
  message: string;
  imageUrl: string;
  ctaText: string;
  ctaUrl: string;
  orderIndex: number;
  enabled: boolean;
}

