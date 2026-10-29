-- D1 SQL Schema and Idempotent Seed Migration for Mimikay Political Movement (MPM)
-- 100% Free Plan Compatible (Cloudflare D1 without R2 or paid services)

CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  hero_headline TEXT NOT NULL,
  hero_subtitle TEXT NOT NULL,
  hero_button_primary_text TEXT DEFAULT 'Explore Our Events',
  hero_button_primary_link TEXT DEFAULT '/events',
  hero_button_secondary_text TEXT DEFAULT 'Learn About MPM',
  hero_button_secondary_link TEXT DEFAULT '/about',
  announcement_enabled INTEGER DEFAULT 1,
  announcement_text TEXT DEFAULT 'Stay updated with the latest political news with our blog',
  announcement_link TEXT DEFAULT 'https://kangaroo.ng',
  announcement_link_text TEXT DEFAULT 'kangaroo.ng',
  blog_url TEXT DEFAULT 'https://kangaroo.ng',
  whatsapp_group_url TEXT DEFAULT 'https://chat.whatsapp.com/BYxgPGIVoZyBebH2rWdbGn',
  contact_email TEXT DEFAULT 'info@mimikaypoliticalmovement.com',
  phone_1 TEXT DEFAULT '+234 9134830720',
  phone_2 TEXT DEFAULT '+234 7035553463',
  phone_3 TEXT DEFAULT '+234 7060503302',
  convener_name TEXT DEFAULT 'Hon. Oghenekaro Akpososo',
  convener_title TEXT DEFAULT 'The Convener',
  convener_image_url TEXT,
  tintville_url TEXT DEFAULT 'https://wa.me/2349013506747',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT NOT NULL,
  youtube_id TEXT,
  event_date TEXT NOT NULL,
  location TEXT,
  published INTEGER DEFAULT 1,
  featured INTEGER DEFAULT 0,
  category TEXT DEFAULT 'General',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  headline TEXT NOT NULL,
  message TEXT NOT NULL,
  image_url TEXT,
  cta_text TEXT NOT NULL,
  cta_url TEXT NOT NULL,
  cta_type TEXT DEFAULT 'whatsapp',
  start_date TEXT,
  end_date TEXT,
  enabled INTEGER DEFAULT 1,
  is_paused INTEGER DEFAULT 0,
  homepage_only INTEGER DEFAULT 0,
  display_delay_seconds INTEGER DEFAULT 3,
  dismissal_frequency_days INTEGER DEFAULT 3,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS candidates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  office TEXT DEFAULT '',
  party TEXT DEFAULT 'All Progressives Congress (APC)',
  headline TEXT DEFAULT '',
  message TEXT DEFAULT '',
  image_url TEXT NOT NULL,
  cta_text TEXT DEFAULT 'Learn More',
  cta_url TEXT DEFAULT '',
  order_index INTEGER DEFAULT 1,
  enabled INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Idempotent Seed: Site Settings
INSERT OR IGNORE INTO site_settings (
  id, hero_headline, hero_subtitle, announcement_enabled, announcement_text,
  announcement_link, announcement_link_text, blog_url, whatsapp_group_url,
  contact_email, phone_1, phone_2, phone_3, convener_name, convener_title,
  convener_image_url, tintville_url
) VALUES (
  'current',
  'Advancing Grassroots Development, Unity & Democratic Leadership',
  'The Mimikay Political Movement (MPM) is a dedicated coalition advancing community welfare, responsible governance, and purposeful leadership across Delta State and Nigeria.',
  1,
  'Stay updated with the latest political news with our blog',
  'https://kangaroo.ng',
  'kangaroo.ng',
  'https://kangaroo.ng',
  'https://chat.whatsapp.com/BYxgPGIVoZyBebH2rWdbGn',
  'info@mimikaypoliticalmovement.com',
  '+234 9134830720',
  '+234 7035553463',
  '+234 7060503302',
  'Hon. Oghenekaro Akpososo',
  'The Convener',
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi9O_vAsT0SyOLFjj41ygsEQwNlI8KO9JYZj125DxPgg7NiikBxn-S7n15qN8UYjfsW9uB9GKyj6O60tZnkTTr0Y30-K8RsNBYdFXb5aW8eWxz0CZ41mDB3UrZ9-f_vx66vq6RLjIVqruB-1lfFhCPRrR5Hf6iAbGZ2VwYR4fkurvj26hT7e3TZHm8z1Ps/s1080/The%20Mimikay%20Political%20Movement,%20led%20by%20Hon.%20Oghenekaro%20Akpososo,%20has%20commended%20Delta%20State%20Gover%20%282%29.jpg',
  'https://wa.me/2349013506747'
);

-- Idempotent Seed: 4 Authoritative Events from Original Blogger Template
INSERT OR IGNORE INTO events (
  id, slug, title, summary, content, image_url, youtube_id, event_date, location, published, featured, category
) VALUES (
  'evt-1',
  'mpm-endorses-senator-ede-dafinone',
  'MPM Reaffirms Support for Tinubu, Governor Sheriff & Endorses Senator Ede Dafinone',
  'The Mimikay Political Movement, led by Hon. Oghenekaro Akpososo, has reaffirmed its strong support for President Bola Ahmed Tinubu and the administration of Governor Sheriff Oborevwori, while officially declaring full endorsement for Senator Ede Dafinone for a second term in Delta Central.',
  'The Mimikay Political Movement (MPM), led by Hon. Oghenekaro Akpososo, has reaffirmed its strong support for President Bola Ahmed Tinubu and the administration of Governor Sheriff Oborevwori, noting their steadfast commitment to national stability, economic reforms, and infrastructural development across Delta State.\n\nThe movement further declared its full endorsement of Distinguished Senator Ede Dafinone for a second term following his formal declaration in Ughelli.\n\nThe endorsement was made shortly after the major gathering held at Oharisi Primary School, where members of the movement expressed unwavering confidence in Senator Dafinone''s leadership, accessibility, and high-impact representation of Delta Central Senatorial District.\n\nHon. Akpososo emphasized that purposeful representation requires continuity and strong synergy between grassroots organizations, state authorities, and federal legislators to bring tangible dividends of democracy to the people of Delta Central.',
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEghTw8Vwqs-0fsmPQd7gEM4G6ddbewIP4jz-5eZAchHEnDWTyWyNNvir05XUpjADEKk63XNoerGqGoXTcTGe7zbpfhaY7n6BB2kyaClzRcHO7yoggysK_Q6Gma7xq3_Gvha78yj5SY2SnQnPzK-5rN_r0BkEuHNxlltDv22tzcyotw0Xe5JQd18PSSpWAY/s2048/682881636_2023485028547888_563369088969241840_n.jpg',
  '7sXgMgx5Wq4',
  '2026-03-02',
  'Oharisi Primary School, Ughelli, Delta Central',
  1,
  1,
  'Endorsement'
);

INSERT OR IGNORE INTO events (
  id, slug, title, summary, content, image_url, youtube_id, event_date, location, published, featured, category
) VALUES (
  'evt-2',
  'official-inauguration-2027-endorsement',
  'Official Inauguration & 2027 Endorsement',
  'The Mimikay Political Movement officially inaugurated its leadership executive, formally endorsing President Bola Ahmed Tinubu and Governor Sheriff Oborevwori for re-election in 2027.',
  'The Mimikay Political Movement officially inaugurated its leadership structure at a historic gathering attended by community representatives, youth leaders, women advocates, and civic stakeholders.\n\nDuring the inauguration ceremony, the movement formally declared its resolute endorsement of President Bola Ahmed Tinubu and Governor Sheriff Oborevwori for re-election in 2027.\n\nThe convener, Hon. Oghenekaro Akpososo, administered the affirmation to local ward coordinators and urged all executives to champion grassroots civic involvement, peaceful political engagement, and constructive mobilization across all wards and communities in Delta State.',
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjWAbqWDgeCxoAPGcxO0BQwKxzEAGo28sBzWpHs7IEzsdniEpK2mFrdfL6GMX03Zod3h71GQlTJO_ZG57S-LLt3xIw4sd0w8QLyMxVql-kNbqKjIzSBvYsWUIo-B66fDh4-oxEoMttftlmSEhC9yd0VVIJ8Nvffxma9AVCz2PqfFN3_JMN0c4MXaE099Qo/s1280/WhatsApp%20Image%202026-02-28%20at%201.39.57%20PM%20%281%29.jpeg',
  NULL,
  '2026-02-28',
  'Ughelli, Delta State',
  1,
  0,
  'Inauguration'
);

INSERT OR IGNORE INTO events (
  id, slug, title, summary, content, image_url, youtube_id, event_date, location, published, featured, category
) VALUES (
  'evt-3',
  'strategic-leadership-visit-senator-dafinone',
  'Strategic Leadership Visit to Senator Ede Dafinone',
  'Members of the Mimikay Political Movement paid a consultative visit to Senator Ede Dafinone, representing Delta Central Senatorial District, focusing on community development priorities.',
  'A delegation of executives and representatives of the Mimikay Political Movement paid an official consultative visit to Senator Ede Dafinone, who represents the Delta Central Senatorial District in the National Assembly.\n\nThe strategic meeting provided a collaborative platform to present grassroots community priorities, discuss empowerment initiatives for youths and women in Delta Central, and deliberate on legislative interventions that directly improve local livelihoods.\n\nSenator Dafinone commended the MPM leadership for their commitment to constructive civic engagement, discipline, and organized grassroots advocacy.',
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhOlmF_JY9OMjfcfzKhGgy36pi3uA5PAs-wUOp30Cg02c_uH2xJ-2apUVr5cDkutDeVIywo55T3MWXlUcBsrl5zVvNM5ClB78k6xWMD1Qer5wj-F90HQdwyuyLIzP3ZUcSJx_GbK5rtbVMQ-kry9pLX26ZNUylqIlBfTyPiR54qPYrpOKosFusTZH3ohhU/s1080/ad593995-48ad-4cbb-982c-130a84c79c31.jfif',
  NULL,
  '2026-02-15',
  'Delta Central Senatorial District Office',
  1,
  0,
  'Consultation'
);

INSERT OR IGNORE INTO events (
  id, slug, title, summary, content, image_url, youtube_id, event_date, location, published, featured, category
) VALUES (
  'evt-4',
  'ughelli-flyover-milestone-groundbreaking',
  'Ughelli Flyover Milestone',
  'MPM delegation witnessing the groundbreaking ceremony of the vital Ughelli urban flyover project by the Executive Governor of Delta State, Rt. Hon. Sheriff Francis Orowhedor Oborevwori.',
  'An official MPM delegation was on ground to witness the groundbreaking milestone of the landmark Ughelli Flyover project, performed by the Executive Governor of Delta State, Rt. Hon. Sheriff Francis Orowhedor Oborevwori.\n\nThis major infrastructural project represents a transformative urban upgrade aimed at de-congesting traffic, accelerating commerce across Delta Central, and establishing sustainable modern transport corridors.\n\nHon. Oghenekaro Akpososo and MPM members commended Governor Oborevwori''s administration for prioritising visible, high-impact infrastructure that elevates the living standards of citizens and stimulates economic growth throughout the Niger Delta region.',
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjLeqNggdQctuzBAD65Deh09Z1VkDwF2eEanpDzytqbbOvcMTWsiyiJSrYZcvpZ2mIaHVlbFJQgGMw2N8zBTpE8o3FiC1KbYEIhItg1lL0N4ffQ6r1RnZT6mg_zyyKjS5eF8eNgAZHDGchgMQ9Q13YERnqbUpw5-S7z4VHCW3eihybuVkq1GXOKkCQrmBA/s1431/The%20Mimikay%20Political%20Movement,%20led%20by%20Hon.%20Oghenekaro%20Akpososo,%20has%20commended%20Delta%20State%20Gover%20%281%29.jpg',
  NULL,
  '2026-01-28',
  'Ughelli Ring Road / Junction, Delta State',
  1,
  0,
  'Infrastructure'
);

-- Idempotent Seed: Active Campaign
INSERT OR IGNORE INTO campaigns (
  id, title, headline, message, image_url, cta_text, cta_url, cta_type, start_date, end_date, enabled, is_paused, homepage_only, display_delay_seconds, dismissal_frequency_days
) VALUES (
  'camp-1',
  'Join MPM Grassroots WhatsApp Community',
  'Stand With Delta Grassroots Development',
  'Be part of the active coalition transforming our communities. Connect directly with ward leaders, get verified civic updates, and participate in local empowerment programs.',
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjWAbqWDgeCxoAPGcxO0BQwKxzEAGo28sBzWpHs7IEzsdniEpK2mFrdfL6GMX03Zod3h71GQlTJO_ZG57S-LLt3xIw4sd0w8QLyMxVql-kNbqKjIzSBvYsWUIo-B66fDh4-oxEoMttftlmSEhC9yd0VVIJ8Nvffxma9AVCz2PqfFN3_JMN0c4MXaE099Qo/s1280/WhatsApp%20Image%202026-02-28%20at%201.39.57%20PM%20%281%29.jpeg',
  'Join MPM WhatsApp Group',
  'https://chat.whatsapp.com/BYxgPGIVoZyBebH2rWdbGn',
  'whatsapp',
  '2026-01-01',
  '2027-12-31',
  1,
  0,
  0,
  3,
  3
);

-- Idempotent Seed: 4 Active Endorsed APC Candidates / Pop-ups
INSERT OR IGNORE INTO candidates (
  id, name, office, party, headline, message, image_url, cta_text, cta_url, order_index, enabled
) VALUES (
  'cand-1',
  'President Bola Ahmed Tinubu (GCFR)',
  'President & Commander-in-Chief of the Armed Forces',
  'All Progressives Congress (APC)',
  '2027 Re-election Endorsement',
  'The Mimikay Political Movement reaffirms resolute support for President Bola Ahmed Tinubu, championing bold economic reforms, national stability, and sustained grassroots infrastructural investment.',
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjWAbqWDgeCxoAPGcxO0BQwKxzEAGo28sBzWpHs7IEzsdniEpK2mFrdfL6GMX03Zod3h71GQlTJO_ZG57S-LLt3xIw4sd0w8QLyMxVql-kNbqKjIzSBvYsWUIo-B66fDh4-oxEoMttftlmSEhC9yd0VVIJ8Nvffxma9AVCz2PqfFN3_JMN0c4MXaE099Qo/s1280/WhatsApp%20Image%202026-02-28%20at%201.39.57%20PM%20%281%29.jpeg',
  'View Endorsement Report',
  '/events/official-inauguration-2027-endorsement',
  1,
  1
);

INSERT OR IGNORE INTO candidates (
  id, name, office, party, headline, message, image_url, cta_text, cta_url, order_index, enabled
) VALUES (
  'cand-2',
  'Senator Ede Dafinone',
  'Senator, Delta Central Senatorial District',
  'All Progressives Congress (APC)',
  'Official Second-Term Endorsement',
  'MPM declared full endorsement of Distinguished Senator Ede Dafinone following his declaration at Oharisi Primary School, Ughelli, celebrating his accessible representation, community empowerment, and legislative excellence.',
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhOlmF_JY9OMjfcfzKhGgy36pi3uA5PAs-wUOp30Cg02c_uH2xJ-2apUVr5cDkutDeVIywo55T3MWXlUcBsrl5zVvNM5ClB78k6xWMD1Qer5wj-F90HQdwyuyLIzP3ZUcSJx_GbK5rtbVMQ-kry9pLX26ZNUylqIlBfTyPiR54qPYrpOKosFusTZH3ohhU/s1080/ad593995-48ad-4cbb-982c-130a84c79c31.jfif',
  'Watch Video Briefing',
  '/events/mpm-endorses-senator-ede-dafinone',
  2,
  1
);

INSERT OR IGNORE INTO candidates (
  id, name, office, party, headline, message, image_url, cta_text, cta_url, order_index, enabled
) VALUES (
  'cand-3',
  'Rt. Hon. Sheriff Francis Oborevwori',
  'Executive Governor of Delta State',
  'Government of Delta State',
  'Grassroots Infrastructure Partner',
  'Commended by Mimikay Political Movement for transformative public infrastructure, including the landmark Ughelli Flyover project and community-centered urban development across Delta Central.',
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgHhqDs4VLHx1ACulFLyqpEJB6krpRbvDxHHnMyk7VPLcSIhUA9CaugzehXJe7NfTRTNWe_bhnOM7L0gG14PerP_OhZW4AK4pq2Qcz7LrylYgeP57zJ91cCTm6P-oLpg_DG2NvaUWIAKzw5SlY_R3YfIdDOBt027O5rNtswaKDiW48bu0_AMP2eMCeztNQ/s800/Sherrif-Oborevwori.jpeg',
  'Read Flyover Milestone',
  '/events/ughelli-flyover-milestone-groundbreaking',
  3,
  1
);

INSERT OR IGNORE INTO candidates (
  id, name, office, party, headline, message, image_url, cta_text, cta_url, order_index, enabled
) VALUES (
  'cand-4',
  'Hon. Oghenekaro Akpososo',
  'The Convener, Mimikay Political Movement',
  'Voice for Delta Grassroot Development',
  'Grassroots Convener & Civic Champion',
  'Leading the grassroots coalition across all wards in Delta State, coordinating community consultations, voter education, and holding leadership accountable to the welfare of the people.',
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi9O_vAsT0SyOLFjj41ygsEQwNlI8KO9JYZj125DxPgg7NiikBxn-S7n15qN8UYjfsW9uB9GKyj6O60tZnkTTr0Y30-K8RsNBYdFXb5aW8eWxz0CZ41mDB3UrZ9-f_vx66vq6RLjIVqruB-1lfFhCPRrR5Hf6iAbGZ2VwYR4fkurvj26hT7e3TZHm8z1Ps/s1080/The%20Mimikay%20Political%20Movement,%20led%20by%20Hon.%20Oghenekaro%20Akpososo,%20has%20commended%20Delta%20State%20Gover%20%282%29.jpg',
  'Read Convener Profile',
  '/about',
  4,
  1
);
