import { MPMEvent, SiteSettings, CampaignPopup, CorePillar } from '../types';

export const SEED_SETTINGS: SiteSettings = {
  heroHeadline: 'Advancing Grassroots Development, Unity & Democratic Leadership',
  heroSubtitle: 'The Mimikay Political Movement (MPM) is a dedicated coalition advancing community welfare, responsible governance, and purposeful leadership across Delta State and Nigeria.',
  heroButtonPrimaryText: 'Explore Our Events',
  heroButtonPrimaryLink: '/events',
  heroButtonSecondaryText: 'Learn About MPM',
  heroButtonSecondaryLink: '/about',
  announcementEnabled: true,
  announcementText: 'Stay updated with the latest political news with our blog',
  announcementLink: 'https://kangaroo.ng',
  announcementLinkText: 'kangaroo.ng',
  blogUrl: 'https://kangaroo.ng',
  whatsappGroupUrl: 'https://chat.whatsapp.com/BYxgPGIVoZyBebH2rWdbGn',
  contactEmail: 'info@mimikaypoliticalmovement.com',
  phone1: '+234 9134830720',
  phone2: '+234 7035553463',
  phone3: '+234 7060503302',
  convenerName: 'Hon. Oghenekaro Akpososo',
  convenerTitle: 'The Convener',
  convenerImageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi9O_vAsT0SyOLFjj41ygsEQwNlI8KO9JYZj125DxPgg7NiikBxn-S7n15qN8UYjfsW9uB9GKyj6O60tZnkTTr0Y30-K8RsNBYdFXb5aW8eWxz0CZ41mDB3UrZ9-f_vx66vq6RLjIVqruB-1lfFhCPRrR5Hf6iAbGZ2VwYR4fkurvj26hT7e3TZHm8z1Ps/s1080/The%20Mimikay%20Political%20Movement,%20led%20by%20Hon.%20Oghenekaro%20Akpososo,%20has%20commended%20Delta%20State%20Gover%20%282%29.jpg',
  tintvilleUrl: 'https://wa.me/2349013506747',
  soundCloudUrl: 'https://music.youtube.com/watch?v=5XYQY9bDUGY&si=Eljow2WFuiXzL_Fg',
  soundCloudEnabled: true,
  soundCloudAutoplay: true,
  soundCloudStartMuted: false,
};

export const SEED_SOUNDCLOUD_TRACKS = [
  {
    id: 'yt-1',
    title: 'APC Campaign Song (Official YouTube Music)',
    artist: 'All Progressives Congress',
    url: 'https://music.youtube.com/watch?v=5XYQY9bDUGY&si=Eljow2WFuiXzL_Fg',
    source: 'youtube' as const,
    enabled: true,
    addedAt: '2026-03-02T00:00:00Z',
  },
  {
    id: 'sc-1',
    title: 'APC Campaign Songs (Official SoundCloud Playlist)',
    artist: 'All Progressives Congress',
    url: 'https://soundcloud.com/wow-you-xp/sets/all-progressives-congress-apc-campaign-songs?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing',
    source: 'soundcloud' as const,
    enabled: true,
    addedAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'sc-2',
    title: 'Asiwaju Bola Ahmed Tinubu (Jagaban) Victory Anthem',
    artist: 'APC National Grassroots Mobilization',
    url: 'https://soundcloud.com/wow-you-xp/sets/all-progressives-congress-apc-campaign-songs',
    source: 'soundcloud' as const,
    enabled: true,
    addedAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'sc-3',
    title: 'Delta Central Unity & Grassroots Progress Anthem',
    artist: 'Mimikay Political Movement Coalition',
    url: 'https://soundcloud.com/wow-you-xp/sets/all-progressives-congress-apc-campaign-songs',
    source: 'soundcloud' as const,
    enabled: true,
    addedAt: '2026-03-01T00:00:00Z',
  },
];

export const SEED_PILLARS: CorePillar[] = [
  {
    id: 'unity',
    title: 'Unity',
    description: 'Bringing diverse communities together for shared prosperity and mutual progress.',
    imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjvBVoE-EScS5BhaWt6p6KMTp8nUgKIoVZNAWEcVQVR-7SgbqGdPPzRi_JJ5eBD_FDbzAX0dm_t659Ak-UMDfbV1UHafOuQz9fpcjD0zMwIICeeIa0ifEGaXJqZZffJ4I1yHCPCUPxYC0nkf5LA2p3fbHQlDmkHigox7c_se70cUjnjdS3xOxtoR2RsPpY/s480/images-2025-01-20T212929.259.jpeg',
  },
  {
    id: 'progress',
    title: 'Progress',
    description: 'Advocating for modern infrastructure, youth opportunity, and grassroots economic growth.',
    imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgE7gWCfjYLsWY1PPg3lNvRotyWXi1SLuptA0k6qvim632eJKAtIi4kSQAgcPdz0PuatmY4bGDgm3TzKNmgMh5DE3-dFz5spG6iPThEKwmxKw_K5Cj_-cRse0eWAg0gvcpPJJYJswxTQeKk3Y6o6Ua1F11CWPgjmd3zUZwAQWf2XhXbZKlhkFfcJEpwhVM/s1062/Delta-state-1062x598.jpg',
  },
  {
    id: 'good-governance',
    title: 'Good Governance',
    description: 'Promoting transparency, accountability, and citizen-led participatory leadership.',
    imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgHhqDs4VLHx1ACulFLyqpEJB6krpRbvDxHHnMyk7VPLcSIhUA9CaugzehXJe7NfTRTNWe_bhnOM7L0gG14PerP_OhZW4AK4pq2Qcz7LrylYgeP57zJ91cCTm6P-oLpg_DG2NvaUWIAKzw5SlY_R3YfIdDOBt027O5rNtswaKDiW48bu0_AMP2eMCeztNQ/s800/Sherrif-Oborevwori.jpeg',
  },
];

export const SEED_EVENTS: MPMEvent[] = [
  {
    id: 'evt-1',
    slug: 'mpm-endorses-senator-ede-dafinone',
    title: 'MPM Reaffirms Support for Tinubu, Governor Sheriff & Endorses Senator Ede Dafinone',
    summary: 'The Mimikay Political Movement, led by Hon. Oghenekaro Akpososo, has reaffirmed its strong support for President Bola Ahmed Tinubu and the administration of Governor Sheriff Oborevwori, while officially declaring full endorsement for Senator Ede Dafinone for a second term in Delta Central.',
    content: `The Mimikay Political Movement (MPM), led by Hon. Oghenekaro Akpososo, has reaffirmed its strong support for President Bola Ahmed Tinubu and the administration of Governor Sheriff Oborevwori, noting their steadfast commitment to national stability, economic reforms, and infrastructural development across Delta State.

The movement further declared its full endorsement of Distinguished Senator Ede Dafinone for a second term following his formal declaration in Ughelli.

The endorsement was made shortly after the major gathering held at Oharisi Primary School, where members of the movement expressed unwavering confidence in Senator Dafinone's leadership, accessibility, and high-impact representation of Delta Central Senatorial District.

Hon. Akpososo emphasized that purposeful representation requires continuity and strong synergy between grassroots organizations, state authorities, and federal legislators to bring tangible dividends of democracy to the people of Delta Central.`,
    imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEghTw8Vwqs-0fsmPQd7gEM4G6ddbewIP4jz-5eZAchHEnDWTyWyNNvir05XUpjADEKk63XNoerGqGoXTcTGe7zbpfhaY7n6BB2kyaClzRcHO7yoggysK_Q6Gma7xq3_Gvha78yj5SY2SnQnPzK-5rN_r0BkEuHNxlltDv22tzcyotw0Xe5JQd18PSSpWAY/s2048/682881636_2023485028547888_563369088969241840_n.jpg',
    youtubeId: '7sXgMgx5Wq4',
    eventDate: '2026-03-02',
    location: 'Oharisi Primary School, Ughelli, Delta Central',
    published: true,
    featured: true,
    category: 'Endorsement',
    createdAt: '2026-03-02T10:00:00Z',
    updatedAt: '2026-03-02T10:00:00Z',
  },
  {
    id: 'evt-2',
    slug: 'official-inauguration-2027-endorsement',
    title: 'Official Inauguration & 2027 Endorsement',
    summary: 'The Mimikay Political Movement officially inaugurated its leadership executive, formally endorsing President Bola Ahmed Tinubu and Governor Sheriff Oborevwori for re-election in 2027.',
    content: `The Mimikay Political Movement officially inaugurated its leadership structure at a historic gathering attended by community representatives, youth leaders, women advocates, and civic stakeholders.

During the inauguration ceremony, the movement formally declared its resolute endorsement of President Bola Ahmed Tinubu and Governor Sheriff Oborevwori for re-election in 2027.

The convener, Hon. Oghenekaro Akpososo, administered the affirmation to local ward coordinators and urged all executives to champion grassroots civic involvement, peaceful political engagement, and constructive mobilization across all wards and communities in Delta State.`,
    imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjWAbqWDgeCxoAPGcxO0BQwKxzEAGo28sBzWpHs7IEzsdniEpK2mFrdfL6GMX03Zod3h71GQlTJO_ZG57S-LLt3xIw4sd0w8QLyMxVql-kNbqKjIzSBvYsWUIo-B66fDh4-oxEoMttftlmSEhC9yd0VVIJ8Nvffxma9AVCz2PqfFN3_JMN0c4MXaE099Qo/s1280/WhatsApp%20Image%202026-02-28%20at%201.39.57%20PM%20%281%29.jpeg',
    eventDate: '2026-02-28',
    location: 'Ughelli, Delta State',
    published: true,
    featured: false,
    category: 'Inauguration',
    createdAt: '2026-02-28T14:00:00Z',
    updatedAt: '2026-02-28T14:00:00Z',
  },
  {
    id: 'evt-3',
    slug: 'strategic-leadership-visit-senator-dafinone',
    title: 'Strategic Leadership Visit to Senator Ede Dafinone',
    summary: 'Members of the Mimikay Political Movement paid a consultative visit to Senator Ede Dafinone, representing Delta Central Senatorial District, focusing on community development priorities.',
    content: `A delegation of executives and representatives of the Mimikay Political Movement paid an official consultative visit to Senator Ede Dafinone, who represents the Delta Central Senatorial District in the National Assembly.

The strategic meeting provided a collaborative platform to present grassroots community priorities, discuss empowerment initiatives for youths and women in Delta Central, and deliberate on legislative interventions that directly improve local livelihoods.

Senator Dafinone commended the MPM leadership for their commitment to constructive civic engagement, discipline, and organized grassroots advocacy.`,
    imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhOlmF_JY9OMjfcfzKhGgy36pi3uA5PAs-wUOp30Cg02c_uH2xJ-2apUVr5cDkutDeVIywo55T3MWXlUcBsrl5zVvNM5ClB78k6xWMD1Qer5wj-F90HQdwyuyLIzP3ZUcSJx_GbK5rtbVMQ-kry9pLX26ZNUylqIlBfTyPiR54qPYrpOKosFusTZH3ohhU/s1080/ad593995-48ad-4cbb-982c-130a84c79c31.jfif',
    eventDate: '2026-02-15',
    location: 'Delta Central Senatorial District Office',
    published: true,
    featured: false,
    category: 'Consultation',
    createdAt: '2026-02-15T11:30:00Z',
    updatedAt: '2026-02-15T11:30:00Z',
  },
  {
    id: 'evt-4',
    slug: 'ughelli-flyover-milestone-groundbreaking',
    title: 'Ughelli Flyover Milestone',
    summary: 'MPM delegation witnessing the groundbreaking ceremony of the vital Ughelli urban flyover project by the Executive Governor of Delta State, Rt. Hon. Sheriff Francis Orowhedor Oborevwori.',
    content: `An official MPM delegation was on ground to witness the groundbreaking milestone of the landmark Ughelli Flyover project, performed by the Executive Governor of Delta State, Rt. Hon. Sheriff Francis Orowhedor Oborevwori.

This major infrastructural project represents a transformative urban upgrade aimed at de-congesting traffic, accelerating commerce across Delta Central, and establishing sustainable modern transport corridors.

Hon. Oghenekaro Akpososo and MPM members commended Governor Oborevwori's administration for prioritising visible, high-impact infrastructure that elevates the living standards of citizens and stimulates economic growth throughout the Niger Delta region.`,
    imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjLeqNggdQctuzBAD65Deh09Z1VkDwF2eEanpDzytqbbOvcMTWsiyiJSrYZcvpZ2mIaHVlbFJQgGMw2N8zBTpE8o3FiC1KbYEIhItg1lL0N4ffQ6r1RnZT6mg_zyyKjS5eF8eNgAZHDGchgMQ9Q13YERnqbUpw5-S7z4VHCW3eihybuVkq1GXOKkCQrmBA/s1431/The%20Mimikay%20Political%20Movement,%20led%20by%20Hon.%20Oghenekaro%20Akpososo,%20has%20commended%20Delta%20State%20Gover%20%281%29.jpg',
    eventDate: '2026-01-28',
    location: 'Ughelli Ring Road / Junction, Delta State',
    published: true,
    featured: false,
    category: 'Infrastructure',
    createdAt: '2026-01-28T09:00:00Z',
    updatedAt: '2026-01-28T09:00:00Z',
  },
];

export const SEED_CAMPAIGNS: CampaignPopup[] = [
  {
    id: 'camp-1',
    title: 'Join MPM Grassroots WhatsApp Community',
    headline: 'Stand With Delta Grassroots Development',
    message: 'Be part of the active coalition transforming our communities. Connect directly with ward leaders, get verified civic updates, and participate in local empowerment programs.',
    imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjWAbqWDgeCxoAPGcxO0BQwKxzEAGo28sBzWpHs7IEzsdniEpK2mFrdfL6GMX03Zod3h71GQlTJO_ZG57S-LLt3xIw4sd0w8QLyMxVql-kNbqKjIzSBvYsWUIo-B66fDh4-oxEoMttftlmSEhC9yd0VVIJ8Nvffxma9AVCz2PqfFN3_JMN0c4MXaE099Qo/s1280/WhatsApp%20Image%202026-02-28%20at%201.39.57%20PM%20%281%29.jpeg',
    ctaText: 'Join MPM WhatsApp Group',
    ctaUrl: 'https://chat.whatsapp.com/BYxgPGIVoZyBebH2rWdbGn',
    ctaType: 'whatsapp',
    startDate: '2026-01-01',
    endDate: '2027-12-31',
    enabled: true,
    isPaused: false,
    homepageOnly: false,
    displayDelaySeconds: 4,
    dismissalFrequencyDays: 3,
    createdAt: '2026-03-01T08:00:00Z',
  },
];

export const SEED_CANDIDATES = [
  {
    id: 'cand-1',
    name: 'President Bola Ahmed Tinubu (GCFR)',
    office: 'President & Commander-in-Chief of the Armed Forces',
    party: 'All Progressives Congress (APC)',
    headline: '2027 Re-election Endorsement',
    message: 'The Mimikay Political Movement reaffirms resolute support for President Bola Ahmed Tinubu, championing bold economic reforms, national stability, and sustained grassroots infrastructural investment.',
    imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjWAbqWDgeCxoAPGcxO0BQwKxzEAGo28sBzWpHs7IEzsdniEpK2mFrdfL6GMX03Zod3h71GQlTJO_ZG57S-LLt3xIw4sd0w8QLyMxVql-kNbqKjIzSBvYsWUIo-B66fDh4-oxEoMttftlmSEhC9yd0VVIJ8Nvffxma9AVCz2PqfFN3_JMN0c4MXaE099Qo/s1280/WhatsApp%20Image%202026-02-28%20at%201.39.57%20PM%20%281%29.jpeg',
    ctaText: 'View Endorsement Report',
    ctaUrl: '/events/official-inauguration-2027-endorsement',
    orderIndex: 1,
    enabled: true,
  },
  {
    id: 'cand-2',
    name: 'Senator Ede Dafinone',
    office: 'Senator, Delta Central Senatorial District',
    party: 'All Progressives Congress (APC)',
    headline: 'Official Second-Term Endorsement',
    message: 'MPM declared full endorsement of Distinguished Senator Ede Dafinone following his declaration at Oharisi Primary School, Ughelli, celebrating his accessible representation, community empowerment, and legislative excellence.',
    imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhOlmF_JY9OMjfcfzKhGgy36pi3uA5PAs-wUOp30Cg02c_uH2xJ-2apUVr5cDkutDeVIywo55T3MWXlUcBsrl5zVvNM5ClB78k6xWMD1Qer5wj-F90HQdwyuyLIzP3ZUcSJx_GbK5rtbVMQ-kry9pLX26ZNUylqIlBfTyPiR54qPYrpOKosFusTZH3ohhU/s1080/ad593995-48ad-4cbb-982c-130a84c79c31.jfif',
    ctaText: 'Watch Video Briefing',
    ctaUrl: '/events/mpm-endorses-senator-ede-dafinone',
    orderIndex: 2,
    enabled: true,
  },
  {
    id: 'cand-3',
    name: 'Rt. Hon. Sheriff Francis Oborevwori',
    office: 'Executive Governor of Delta State',
    party: 'Government of Delta State',
    headline: 'Grassroots Infrastructure Partner',
    message: 'Commended by Mimikay Political Movement for transformative public infrastructure, including the landmark Ughelli Flyover project and community-centered urban development across Delta Central.',
    imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgHhqDs4VLHx1ACulFLyqpEJB6krpRbvDxHHnMyk7VPLcSIhUA9CaugzehXJe7NfTRTNWe_bhnOM7L0gG14PerP_OhZW4AK4pq2Qcz7LrylYgeP57zJ91cCTm6P-oLpg_DG2NvaUWIAKzw5SlY_R3YfIdDOBt027O5rNtswaKDiW48bu0_AMP2eMCeztNQ/s800/Sherrif-Oborevwori.jpeg',
    ctaText: 'Read Flyover Milestone',
    ctaUrl: '/events/ughelli-flyover-milestone-groundbreaking',
    orderIndex: 3,
    enabled: true,
  },
  {
    id: 'cand-4',
    name: 'Hon. Oghenekaro Akpososo',
    office: 'The Convener, Mimikay Political Movement',
    party: 'Voice for Delta Grassroot Development',
    headline: 'Grassroots Convener & Civic Champion',
    message: 'Leading the grassroots coalition across all wards in Delta State, coordinating community consultations, voter education, and holding leadership accountable to the welfare of the people.',
    imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi9O_vAsT0SyOLFjj41ygsEQwNlI8KO9JYZj125DxPgg7NiikBxn-S7n15qN8UYjfsW9uB9GKyj6O60tZnkTTr0Y30-K8RsNBYdFXb5aW8eWxz0CZ41mDB3UrZ9-f_vx66vq6RLjIVqruB-1lfFhCPRrR5Hf6iAbGZ2VwYR4fkurvj26hT7e3TZHm8z1Ps/s1080/The%20Mimikay%20Political%20Movement,%20led%20by%20Hon.%20Oghenekaro%20Akpososo,%20has%20commended%20Delta%20State%20Gover%20%282%29.jpg',
    ctaText: 'Read Convener Profile',
    ctaUrl: '/about',
    orderIndex: 4,
    enabled: true,
  },
];

