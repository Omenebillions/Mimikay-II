export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  all<T = unknown>(): Promise<{ results: T[] }>;
  run<T = unknown>(): Promise<{ success: boolean; meta: any }>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

export interface Fetcher {
  fetch(request: Request): Promise<Response>;
}

export interface Env {
  DB?: D1Database;
  ASSETS?: Fetcher;
  ADMIN_PASSPHRASE?: string;
  ENVIRONMENT?: string;
}

// Fallback seed constants so worker never crashes with 500
const FALLBACK_SETTINGS = {
  id: 'current',
  hero_headline: 'Advancing Grassroots Development, Unity & Democratic Leadership',
  hero_subtitle: 'The Mimikay Political Movement (MPM) is a dedicated coalition advancing community welfare, responsible governance, and purposeful leadership across Delta State and Nigeria.',
  hero_button_primary_text: 'Explore Our Events',
  hero_button_primary_link: '/events',
  hero_button_secondary_text: 'Learn About MPM',
  hero_button_secondary_link: '/about',
  announcement_enabled: 1,
  announcement_text: 'Stay updated with the latest political news with our blog',
  announcement_link: 'https://kangaroo.ng',
  announcement_link_text: 'kangaroo.ng',
  blog_url: 'https://kangaroo.ng',
  whatsapp_group_url: 'https://chat.whatsapp.com/BYxgPGIVoZyBebH2rWdbGn',
  contact_email: 'info@mimikaypoliticalmovement.com',
  phone_1: '+234 9134830720',
  phone_2: '+234 7035553463',
  phone_3: '+234 7060503302',
  convener_name: 'Hon. Oghenekaro Akpososo',
  convener_title: 'The Convener',
  convener_image_url: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi9O_vAsT0SyOLFjj41ygsEQwNlI8KO9JYZj125DxPgg7NiikBxn-S7n15qN8UYjfsW9uB9GKyj6O60tZnkTTr0Y30-K8RsNBYdFXb5aW8eWxz0CZ41mDB3UrZ9-f_vx66vq6RLjIVqruB-1lfFhCPRrR5Hf6iAbGZ2VwYR4fkurvj26hT7e3TZHm8z1Ps/s1080/The%20Mimikay%20Political%20Movement,%20led%20by%20Hon.%20Oghenekaro%20Akpososo,%20has%20commended%20Delta%20State%20Gover%20%282%29.jpg',
  tintville_url: 'https://wa.me/2349013506747',
};

const FALLBACK_EVENTS = [
  {
    id: 'evt-1',
    slug: 'mpm-endorses-senator-ede-dafinone',
    title: 'MPM Reaffirms Support for Tinubu, Governor Sheriff & Endorses Senator Ede Dafinone',
    summary: 'The Mimikay Political Movement, led by Hon. Oghenekaro Akpososo, has reaffirmed its strong support for President Bola Ahmed Tinubu and the administration of Governor Sheriff Oborevwori, while officially declaring full endorsement for Senator Ede Dafinone for a second term in Delta Central.',
    content: 'The Mimikay Political Movement (MPM), led by Hon. Oghenekaro Akpososo, has reaffirmed its strong support for President Bola Ahmed Tinubu and the administration of Governor Sheriff Oborevwori, noting their steadfast commitment to national stability, economic reforms, and infrastructural development across Delta State.\n\nThe movement further declared its full endorsement of Distinguished Senator Ede Dafinone for a second term following his formal declaration in Ughelli.\n\nThe endorsement was made shortly after the major gathering held at Oharisi Primary School, where members of the movement expressed unwavering confidence in Senator Dafinone\'s leadership, accessibility, and high-impact representation of Delta Central Senatorial District.\n\nHon. Akpososo emphasized that purposeful representation requires continuity and strong synergy between grassroots organizations, state authorities, and federal legislators to bring tangible dividends of democracy to the people of Delta Central.',
    image_url: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEghTw8Vwqs-0fsmPQd7gEM4G6ddbewIP4jz-5eZAchHEnDWTyWyNNvir05XUpjADEKk63XNoerGqGoXTcTGe7zbpfhaY7n6BB2kyaClzRcHO7yoggysK_Q6Gma7xq3_Gvha78yj5SY2SnQnPzK-5rN_r0BkEuHNxlltDv22tzcyotw0Xe5JQd18PSSpWAY/s2048/682881636_2023485028547888_563369088969241840_n.jpg',
    youtube_id: '7sXgMgx5Wq4',
    event_date: '2026-03-02',
    location: 'Oharisi Primary School, Ughelli, Delta Central',
    published: 1,
    featured: 1,
    category: 'Endorsement',
  },
  {
    id: 'evt-2',
    slug: 'official-inauguration-2027-endorsement',
    title: 'Official Inauguration & 2027 Endorsement',
    summary: 'The Mimikay Political Movement officially inaugurated its leadership executive, formally endorsing President Bola Ahmed Tinubu and Governor Sheriff Oborevwori for re-election in 2027.',
    content: 'The Mimikay Political Movement officially inaugurated its leadership structure at a historic gathering attended by community representatives, youth leaders, women advocates, and civic stakeholders.\n\nDuring the inauguration ceremony, the movement formally declared its resolute endorsement of President Bola Ahmed Tinubu and Governor Sheriff Oborevwori for re-election in 2027.\n\nThe convener, Hon. Oghenekaro Akpososo, administered the affirmation to local ward coordinators and urged all executives to champion grassroots civic involvement, peaceful political engagement, and constructive mobilization across all wards and communities in Delta State.',
    image_url: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjWAbqWDgeCxoAPGcxO0BQwKxzEAGo28sBzWpHs7IEzsdniEpK2mFrdfL6GMX03Zod3h71GQlTJO_ZG57S-LLt3xIw4sd0w8QLyMxVql-kNbqKjIzSBvYsWUIo-B66fDh4-oxEoMttftlmSEhC9yd0VVIJ8Nvffxma9AVCz2PqfFN3_JMN0c4MXaE099Qo/s1280/WhatsApp%20Image%202026-02-28%20at%201.39.57%20PM%20%281%29.jpeg',
    youtube_id: null,
    event_date: '2026-02-28',
    location: 'Ughelli, Delta State',
    published: 1,
    featured: 0,
    category: 'Inauguration',
  },
  {
    id: 'evt-3',
    slug: 'strategic-leadership-visit-senator-dafinone',
    title: 'Strategic Leadership Visit to Senator Ede Dafinone',
    summary: 'Members of the Mimikay Political Movement paid a consultative visit to Senator Ede Dafinone, representing Delta Central Senatorial District, focusing on community development priorities.',
    content: 'A delegation of executives and representatives of the Mimikay Political Movement paid an official consultative visit to Senator Ede Dafinone, who represents the Delta Central Senatorial District in the National Assembly.\n\nThe strategic meeting provided a collaborative platform to present grassroots community priorities, discuss empowerment initiatives for youths and women in Delta Central, and deliberate on legislative interventions that directly improve local livelihoods.\n\nSenator Dafinone commended the MPM leadership for their commitment to constructive civic engagement, discipline, and organized grassroots advocacy.',
    image_url: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhOlmF_JY9OMjfcfzKhGgy36pi3uA5PAs-wUOp30Cg02c_uH2xJ-2apUVr5cDkutDeVIywo55T3MWXlUcBsrl5zVvNM5ClB78k6xWMD1Qer5wj-F90HQdwyuyLIzP3ZUcSJx_GbK5rtbVMQ-kry9pLX26ZNUylqIlBfTyPiR54qPYrpOKosFusTZH3ohhU/s1080/ad593995-48ad-4cbb-982c-130a84c79c31.jfif',
    youtube_id: null,
    event_date: '2026-02-15',
    location: 'Delta Central Senatorial District Office',
    published: 1,
    featured: 0,
    category: 'Consultation',
  },
  {
    id: 'evt-4',
    slug: 'ughelli-flyover-milestone-groundbreaking',
    title: 'Ughelli Flyover Milestone',
    summary: 'MPM delegation witnessing the groundbreaking ceremony of the vital Ughelli urban flyover project by the Executive Governor of Delta State, Rt. Hon. Sheriff Francis Orowhedor Oborevwori.',
    content: 'An official MPM delegation was on ground to witness the groundbreaking milestone of the landmark Ughelli Flyover project, performed by the Executive Governor of Delta State, Rt. Hon. Sheriff Francis Orowhedor Oborevwori.\n\nThis major infrastructural project represents a transformative urban upgrade aimed at de-congesting traffic, accelerating commerce across Delta Central, and establishing sustainable modern transport corridors.\n\nHon. Oghenekaro Akpososo and MPM members commended Governor Oborevwori\'s administration for prioritising visible, high-impact infrastructure that elevates the living standards of citizens and stimulates economic growth throughout the Niger Delta region.',
    image_url: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjLeqNggdQctuzBAD65Deh09Z1VkDwF2eEanpDzytqbbOvcMTWsiyiJSrYZcvpZ2mIaHVlbFJQgGMw2N8zBTpE8o3FiC1KbYEIhItg1lL0N4ffQ6r1RnZT6mg_zyyKjS5eF8eNgAZHDGchgMQ9Q13YERnqbUpw5-S7z4VHCW3eihybuVkq1GXOKkCQrmBA/s1431/The%20Mimikay%20Political%20Movement,%20led%20by%20Hon.%20Oghenekaro%20Akpososo,%20has%20commended%20Delta%20State%20Gover%20%281%29.jpg',
    youtube_id: null,
    event_date: '2026-01-28',
    location: 'Ughelli Ring Road / Junction, Delta State',
    published: 1,
    featured: 0,
    category: 'Infrastructure',
  },
];

const FALLBACK_CANDIDATES = [
  {
    id: 'cand-1',
    name: 'President Bola Ahmed Tinubu (GCFR)',
    office: 'President & Commander-in-Chief of the Armed Forces',
    party: 'All Progressives Congress (APC)',
    headline: '2027 Re-election Endorsement',
    message: 'The Mimikay Political Movement reaffirms resolute support for President Bola Ahmed Tinubu, championing bold economic reforms, national stability, and sustained grassroots infrastructural investment.',
    image_url: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjWAbqWDgeCxoAPGcxO0BQwKxzEAGo28sBzWpHs7IEzsdniEpK2mFrdfL6GMX03Zod3h71GQlTJO_ZG57S-LLt3xIw4sd0w8QLyMxVql-kNbqKjIzSBvYsWUIo-B66fDh4-oxEoMttftlmSEhC9yd0VVIJ8Nvffxma9AVCz2PqfFN3_JMN0c4MXaE099Qo/s1280/WhatsApp%20Image%202026-02-28%20at%201.39.57%20PM%20%281%29.jpeg',
    cta_text: 'View Endorsement Report',
    cta_url: '/events/official-inauguration-2027-endorsement',
    order_index: 1,
    enabled: 1,
  },
  {
    id: 'cand-2',
    name: 'Senator Ede Dafinone',
    office: 'Senator, Delta Central Senatorial District',
    party: 'All Progressives Congress (APC)',
    headline: 'Official Second-Term Endorsement',
    message: 'MPM declared full endorsement of Distinguished Senator Ede Dafinone following his declaration at Oharisi Primary School, Ughelli, celebrating his accessible representation, community empowerment, and legislative excellence.',
    image_url: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhOlmF_JY9OMjfcfzKhGgy36pi3uA5PAs-wUOp30Cg02c_uH2xJ-2apUVr5cDkutDeVIywo55T3MWXlUcBsrl5zVvNM5ClB78k6xWMD1Qer5wj-F90HQdwyuyLIzP3ZUcSJx_GbK5rtbVMQ-kry9pLX26ZNUylqIlBfTyPiR54qPYrpOKosFusTZH3ohhU/s1080/ad593995-48ad-4cbb-982c-130a84c79c31.jfif',
    cta_text: 'Watch Video Briefing',
    cta_url: '/events/mpm-endorses-senator-ede-dafinone',
    order_index: 2,
    enabled: 1,
  },
  {
    id: 'cand-3',
    name: 'Rt. Hon. Sheriff Francis Oborevwori',
    office: 'Executive Governor of Delta State',
    party: 'Government of Delta State',
    headline: 'Grassroots Infrastructure Partner',
    message: 'Commended by Mimikay Political Movement for transformative public infrastructure, including the landmark Ughelli Flyover project and community-centered urban development across Delta Central.',
    image_url: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgHhqDs4VLHx1ACulFLyqpEJB6krpRbvDxHHnMyk7VPLcSIhUA9CaugzehXJe7NfTRTNWe_bhnOM7L0gG14PerP_OhZW4AK4pq2Qcz7LrylYgeP57zJ91cCTm6P-oLpg_DG2NvaUWIAKzw5SlY_R3YfIdDOBt027O5rNtswaKDiW48bu0_AMP2eMCeztNQ/s800/Sherrif-Oborevwori.jpeg',
    cta_text: 'Read Flyover Milestone',
    cta_url: '/events/ughelli-flyover-milestone-groundbreaking',
    order_index: 3,
    enabled: 1,
  },
  {
    id: 'cand-4',
    name: 'Hon. Oghenekaro Akpososo',
    office: 'The Convener, Mimikay Political Movement',
    party: 'Voice for Delta Grassroot Development',
    headline: 'Grassroots Convener & Civic Champion',
    message: 'Leading the grassroots coalition across all wards in Delta State, coordinating community consultations, voter education, and holding leadership accountable to the welfare of the people.',
    image_url: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi9O_vAsT0SyOLFjj41ygsEQwNlI8KO9JYZj125DxPgg7NiikBxn-S7n15qN8UYjfsW9uB9GKyj6O60tZnkTTr0Y30-K8RsNBYdFXb5aW8eWxz0CZ41mDB3UrZ9-f_vx66vq6RLjIVqruB-1lfFhCPRrR5Hf6iAbGZ2VwYR4fkurvj26hT7e3TZHm8z1Ps/s1080/The%20Mimikay%20Political%20Movement,%20led%20by%20Hon.%20Oghenekaro%20Akpososo,%20has%20commended%20Delta%20State%20Gover%20%282%29.jpg',
    cta_text: 'Read Convener Profile',
    cta_url: '/about',
    order_index: 4,
    enabled: 1,
  },
];

const FALLBACK_CAMPAIGN = {
  id: 'camp-1',
  title: 'Join MPM Grassroots WhatsApp Community',
  headline: 'Stand With Delta Grassroots Development',
  message: 'Be part of the active coalition transforming our communities. Connect directly with ward leaders, get verified civic updates, and participate in local empowerment programs.',
  image_url: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjWAbqWDgeCxoAPGcxO0BQwKxzEAGo28sBzWpHs7IEzsdniEpK2mFrdfL6GMX03Zod3h71GQlTJO_ZG57S-LLt3xIw4sd0w8QLyMxVql-kNbqKjIzSBvYsWUIo-B66fDh4-oxEoMttftlmSEhC9yd0VVIJ8Nvffxma9AVCz2PqfFN3_JMN0c4MXaE099Qo/s1280/WhatsApp%20Image%202026-02-28%20at%201.39.57%20PM%20%281%29.jpeg',
  cta_text: 'Join MPM WhatsApp Group',
  cta_url: 'https://chat.whatsapp.com/BYxgPGIVoZyBebH2rWdbGn',
  cta_type: 'whatsapp',
  start_date: '2026-01-01',
  end_date: '2027-12-31',
  enabled: 1,
  is_paused: 0,
  homepage_only: 0,
  display_delay_seconds: 3,
  dismissal_frequency_days: 3,
};

// Self-healing database initializer
let schemaEnsured = false;
async function ensureDatabaseSchema(db: D1Database): Promise<void> {
  if (schemaEnsured) return;
  try {
    // 1. Site Settings Table
    await db.prepare(`
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
      )
    `).run().catch(() => null);

    // 2. Events Table
    await db.prepare(`
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
      )
    `).run().catch(() => null);

    // 3. Campaigns Table
    await db.prepare(`
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
      )
    `).run().catch(() => null);

    // 4. Candidates Table (Pop-up carousel)
    await db.prepare(`
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
      )
    `).run().catch(() => null);

    // Seed site_settings if missing
    const existingSettings = await db.prepare('SELECT id FROM site_settings WHERE id = ?').bind('current').first().catch(() => null);
    if (!existingSettings) {
      await db.prepare(`
        INSERT OR IGNORE INTO site_settings (
          id, hero_headline, hero_subtitle, announcement_enabled, announcement_text,
          blog_url, whatsapp_group_url, contact_email, phone_1, phone_2, phone_3
        ) VALUES ('current', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        FALLBACK_SETTINGS.hero_headline,
        FALLBACK_SETTINGS.hero_subtitle,
        FALLBACK_SETTINGS.announcement_enabled,
        FALLBACK_SETTINGS.announcement_text,
        FALLBACK_SETTINGS.blog_url,
        FALLBACK_SETTINGS.whatsapp_group_url,
        FALLBACK_SETTINGS.contact_email,
        FALLBACK_SETTINGS.phone_1,
        FALLBACK_SETTINGS.phone_2,
        FALLBACK_SETTINGS.phone_3
      ).run().catch(() => null);
    }

    // Seed events if table is empty
    const eventCount = await db.prepare('SELECT count(*) as count FROM events').first<{ count: number }>().catch(() => null);
    if (!eventCount || eventCount.count === 0) {
      for (const e of FALLBACK_EVENTS) {
        await db.prepare(`
          INSERT OR IGNORE INTO events (
            id, slug, title, summary, content, image_url, youtube_id, event_date, location, published, featured, category
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          e.id, e.slug, e.title, e.summary, e.content, e.image_url, e.youtube_id, e.event_date, e.location, e.published, e.featured, e.category
        ).run().catch(() => null);
      }
    }

    // Seed candidates if table is empty
    const candCount = await db.prepare('SELECT count(*) as count FROM candidates').first<{ count: number }>().catch(() => null);
    if (!candCount || candCount.count === 0) {
      for (const c of FALLBACK_CANDIDATES) {
        await db.prepare(`
          INSERT OR IGNORE INTO candidates (
            id, name, office, party, headline, message, image_url, cta_text, cta_url, order_index, enabled
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          c.id, c.name, c.office, c.party, c.headline, c.message, c.image_url, c.cta_text, c.cta_url, c.order_index, c.enabled
        ).run().catch(() => null);
      }
    }

    schemaEnsured = true;
  } catch (e) {
    console.warn('Auto-schema check notice:', e);
  }
}

// Server-side Authorization validator
function isAuthorized(request: Request, env: Env): boolean {
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const validPassphrase = env.ADMIN_PASSPHRASE || 'mpm2026';
  // Check against passphrase or authorized admin email header
  if (token && (token === validPassphrase || token === 'tintvillenigeria@gmail.com')) {
    return true;
  }
  const adminEmail = request.headers.get('X-Admin-Email');
  if (adminEmail === 'tintvillenigeria@gmail.com') {
    return true;
  }
  return false;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // Standard CORS headers
    const corsHeaders: Record<string, string> = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Email',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const jsonResponse = (data: any, status = 200) => {
      return new Response(JSON.stringify(data), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    };

    // If D1 database is attached, trigger non-blocking auto-schema bootstrap
    if (env.DB && !schemaEnsured) {
      await ensureDatabaseSchema(env.DB);
    }

    // --- API ROUTES (Cloudflare D1 Free Tier with Self-Healing Fallbacks) ---

    // 1. GET /api/settings
    if (pathname === '/api/settings' && request.method === 'GET') {
      if (!env.DB) return jsonResponse(FALLBACK_SETTINGS, 200);
      try {
        const result = await env.DB.prepare('SELECT * FROM site_settings WHERE id = ?')
          .bind('current')
          .first();
        return jsonResponse(result || FALLBACK_SETTINGS, 200);
      } catch (err: any) {
        console.warn('GET /api/settings fallback:', err);
        return jsonResponse(FALLBACK_SETTINGS, 200);
      }
    }

    // 2. POST /api/settings (Server-side authenticated write)
    if (pathname === '/api/settings' && request.method === 'POST') {
      if (!isAuthorized(request, env)) {
        return jsonResponse({ error: 'Unauthorized: Admin authentication required.' }, 401);
      }
      if (!env.DB) return jsonResponse({ error: 'D1 database not bound' }, 503);
      try {
        if (!schemaEnsured) await ensureDatabaseSchema(env.DB);
        const body = (await request.json()) as any;
        await env.DB.prepare(
          `UPDATE site_settings SET 
            hero_headline = ?, hero_subtitle = ?, hero_button_primary_text = ?, hero_button_primary_link = ?,
            hero_button_secondary_text = ?, hero_button_secondary_link = ?, announcement_enabled = ?,
            announcement_text = ?, blog_url = ?, whatsapp_group_url = ?, contact_email = ?,
            phone_1 = ?, phone_2 = ?, phone_3 = ?, updated_at = CURRENT_TIMESTAMP
           WHERE id = 'current'`
        )
          .bind(
            body.heroHeadline || body.hero_headline || FALLBACK_SETTINGS.hero_headline,
            body.heroSubtitle || body.hero_subtitle || FALLBACK_SETTINGS.hero_subtitle,
            body.heroButtonPrimaryText || body.hero_button_primary_text || 'Explore Our Events',
            body.heroButtonPrimaryLink || body.hero_button_primary_link || '/events',
            body.heroButtonSecondaryText || body.hero_button_secondary_text || 'Learn About MPM',
            body.heroButtonSecondaryLink || body.hero_button_secondary_link || '/about',
            body.announcementEnabled ?? body.announcement_enabled ? 1 : 0,
            body.announcementText || body.announcement_text || FALLBACK_SETTINGS.announcement_text,
            body.blogUrl || body.blog_url || 'https://kangaroo.ng',
            body.whatsappGroupUrl || body.whatsapp_group_url || FALLBACK_SETTINGS.whatsapp_group_url,
            body.contactEmail || body.contact_email || FALLBACK_SETTINGS.contact_email,
            body.phone1 || body.phone_1 || FALLBACK_SETTINGS.phone_1,
            body.phone2 || body.phone_2 || FALLBACK_SETTINGS.phone_2,
            body.phone3 || body.phone_3 || FALLBACK_SETTINGS.phone_3
          )
          .run();
        return jsonResponse({ success: true, message: 'Settings saved to D1' });
      } catch (err: any) {
        return jsonResponse({ error: err.message }, 500);
      }
    }

    // 3. GET /api/events
    if (pathname === '/api/events' && request.method === 'GET') {
      if (!env.DB) return jsonResponse(FALLBACK_EVENTS, 200);
      try {
        const { results } = await env.DB.prepare(
          'SELECT * FROM events ORDER BY event_date DESC, created_at DESC'
        ).all();
        return jsonResponse(results && results.length > 0 ? results : FALLBACK_EVENTS, 200);
      } catch (err: any) {
        console.warn('GET /api/events fallback:', err);
        return jsonResponse(FALLBACK_EVENTS, 200);
      }
    }

    // 4. GET /api/events/:slug
    if (pathname.startsWith('/api/events/') && request.method === 'GET') {
      const slug = pathname.replace('/api/events/', '');
      if (!env.DB) {
        const match = FALLBACK_EVENTS.find((e) => e.slug === slug);
        return match ? jsonResponse(match, 200) : jsonResponse({ error: 'Event not found' }, 404);
      }
      try {
        const event = await env.DB.prepare('SELECT * FROM events WHERE slug = ?')
          .bind(slug)
          .first();
        if (!event) {
          const match = FALLBACK_EVENTS.find((e) => e.slug === slug);
          if (match) return jsonResponse(match, 200);
          return jsonResponse({ error: 'Event not found' }, 404);
        }
        return jsonResponse(event, 200);
      } catch (err: any) {
        const match = FALLBACK_EVENTS.find((e) => e.slug === slug);
        return match ? jsonResponse(match, 200) : jsonResponse({ error: err.message }, 500);
      }
    }

    // 5. POST /api/events (Server-side authenticated event create/update)
    if (pathname === '/api/events' && request.method === 'POST') {
      if (!isAuthorized(request, env)) {
        return jsonResponse({ error: 'Unauthorized: Admin authentication required.' }, 401);
      }
      if (!env.DB) return jsonResponse({ error: 'D1 database not bound' }, 503);
      try {
        if (!schemaEnsured) await ensureDatabaseSchema(env.DB);
        const body = (await request.json()) as any;
        const id = body.id || `evt-${Date.now()}`;
        const slug =
          body.slug ||
          (body.title || 'event')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        await env.DB.prepare(
          `INSERT INTO events (id, slug, title, summary, content, image_url, youtube_id, event_date, location, published, featured, category, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
           ON CONFLICT(id) DO UPDATE SET
             slug = excluded.slug,
             title = excluded.title,
             summary = excluded.summary,
             content = excluded.content,
             image_url = excluded.image_url,
             youtube_id = excluded.youtube_id,
             event_date = excluded.event_date,
             location = excluded.location,
             published = excluded.published,
             featured = excluded.featured,
             category = excluded.category,
             updated_at = CURRENT_TIMESTAMP`
        )
          .bind(
            id,
            slug,
            body.title || '',
            body.summary || '',
            body.content || '',
            body.imageUrl || body.image_url || '',
            body.youtubeId || body.youtube_id || null,
            body.eventDate || body.event_date || new Date().toISOString().split('T')[0],
            body.location || '',
            body.published ? 1 : 0,
            body.featured ? 1 : 0,
            body.category || 'General'
          )
          .run();

        return jsonResponse({ success: true, id, slug });
      } catch (err: any) {
        return jsonResponse({ error: err.message }, 500);
      }
    }

    // 6. DELETE /api/events/:id (Server-side authenticated event delete)
    if (pathname.startsWith('/api/events/') && request.method === 'DELETE') {
      if (!isAuthorized(request, env)) {
        return jsonResponse({ error: 'Unauthorized: Admin authentication required.' }, 401);
      }
      if (!env.DB) return jsonResponse({ error: 'D1 database not bound' }, 503);
      const id = pathname.replace('/api/events/', '');
      try {
        await env.DB.prepare('DELETE FROM events WHERE id = ?').bind(id).run();
        return jsonResponse({ success: true, deleted: id });
      } catch (err: any) {
        return jsonResponse({ error: err.message }, 500);
      }
    }

    // 7. GET /api/campaigns
    if (pathname === '/api/campaigns' && request.method === 'GET') {
      if (!env.DB) return jsonResponse([FALLBACK_CAMPAIGN], 200);
      try {
        const { results } = await env.DB.prepare('SELECT * FROM campaigns').all();
        return jsonResponse(results && results.length > 0 ? results : [FALLBACK_CAMPAIGN], 200);
      } catch (err: any) {
        console.warn('GET /api/campaigns fallback:', err);
        return jsonResponse([FALLBACK_CAMPAIGN], 200);
      }
    }

    // 8. GET /api/campaigns/active
    if (pathname === '/api/campaigns/active' && request.method === 'GET') {
      if (!env.DB) return jsonResponse(FALLBACK_CAMPAIGN, 200);
      try {
        const today = new Date().toISOString().split('T')[0];
        const campaign = await env.DB.prepare(
          `SELECT * FROM campaigns 
           WHERE enabled = 1 AND is_paused = 0 
           AND (start_date IS NULL OR start_date <= ?) 
           AND (end_date IS NULL OR end_date >= ?)
           LIMIT 1`
        )
          .bind(today, today)
          .first();
        return jsonResponse(campaign || FALLBACK_CAMPAIGN, 200);
      } catch (err: any) {
        console.warn('GET /api/campaigns/active fallback:', err);
        return jsonResponse(FALLBACK_CAMPAIGN, 200);
      }
    }

    // 9. POST /api/campaigns (Server-side authenticated campaign write)
    if (pathname === '/api/campaigns' && request.method === 'POST') {
      if (!isAuthorized(request, env)) {
        return jsonResponse({ error: 'Unauthorized: Admin authentication required.' }, 401);
      }
      if (!env.DB) return jsonResponse({ error: 'D1 database not bound' }, 503);
      try {
        if (!schemaEnsured) await ensureDatabaseSchema(env.DB);
        const body = (await request.json()) as any;
        const id = body.id || `camp-${Date.now()}`;
        await env.DB.prepare(
          `INSERT INTO campaigns (id, title, headline, message, image_url, cta_text, cta_url, cta_type, start_date, end_date, enabled, is_paused, homepage_only, display_delay_seconds, dismissal_frequency_days)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET
             title = excluded.title,
             headline = excluded.headline,
             message = excluded.message,
             image_url = excluded.image_url,
             cta_text = excluded.cta_text,
             cta_url = excluded.cta_url,
             cta_type = excluded.cta_type,
             start_date = excluded.start_date,
             end_date = excluded.end_date,
             enabled = excluded.enabled,
             is_paused = excluded.is_paused,
             homepage_only = excluded.homepage_only,
             display_delay_seconds = excluded.display_delay_seconds,
             dismissal_frequency_days = excluded.dismissal_frequency_days`
        )
          .bind(
            id,
            body.title || '',
            body.headline || '',
            body.message || '',
            body.imageUrl || body.image_url || '',
            body.ctaText || body.cta_text || 'Learn More',
            body.ctaUrl || body.cta_url || '',
            body.ctaType || body.cta_type || 'whatsapp',
            body.startDate || body.start_date || null,
            body.endDate || body.end_date || null,
            body.enabled ? 1 : 0,
            body.isPaused ? 1 : 0,
            body.homepageOnly ? 1 : 0,
            body.displayDelaySeconds ?? 3,
            body.dismissalFrequencyDays ?? 3
          )
          .run();
        return jsonResponse({ success: true, id });
      } catch (err: any) {
        return jsonResponse({ error: err.message }, 500);
      }
    }

    // 10. GET /api/candidates (Pop-up images / APC Candidates)
    if (pathname === '/api/candidates' && request.method === 'GET') {
      if (!env.DB) return jsonResponse(FALLBACK_CANDIDATES, 200);
      try {
        const { results } = await env.DB.prepare(
          'SELECT * FROM candidates ORDER BY order_index ASC'
        ).all();
        return jsonResponse(results && results.length > 0 ? results : FALLBACK_CANDIDATES, 200);
      } catch (err: any) {
        console.warn('GET /api/candidates fallback:', err);
        return jsonResponse(FALLBACK_CANDIDATES, 200);
      }
    }

    // 11. POST /api/candidates (Server-side authenticated pop-up candidate write)
    if (pathname === '/api/candidates' && request.method === 'POST') {
      if (!isAuthorized(request, env)) {
        return jsonResponse({ error: 'Unauthorized: Admin authentication required.' }, 401);
      }
      if (!env.DB) return jsonResponse({ error: 'D1 database not bound' }, 503);
      try {
        if (!schemaEnsured) await ensureDatabaseSchema(env.DB);
        const body = (await request.json()) as any;
        const id = body.id || `cand-${Date.now()}`;
        await env.DB.prepare(
          `INSERT INTO candidates (id, name, office, party, headline, message, image_url, cta_text, cta_url, order_index, enabled)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET
             name = excluded.name,
             office = excluded.office,
             party = excluded.party,
             headline = excluded.headline,
             message = excluded.message,
             image_url = excluded.image_url,
             cta_text = excluded.cta_text,
             cta_url = excluded.cta_url,
             order_index = excluded.order_index,
             enabled = excluded.enabled`
        )
          .bind(
            id,
            body.name || '',
            body.office || '',
            body.party || 'All Progressives Congress (APC)',
            body.headline || '',
            body.message || '',
            body.imageUrl || body.image_url || '',
            body.ctaText || body.cta_text || 'Learn More',
            body.ctaUrl || body.cta_url || '',
            body.orderIndex ?? body.order_index ?? 1,
            body.enabled ? 1 : 0
          )
          .run();
        return jsonResponse({ success: true, id });
      } catch (err: any) {
        return jsonResponse({ error: err.message }, 500);
      }
    }

    // 12. DELETE /api/candidates/:id (Server-side authenticated delete)
    if (pathname.startsWith('/api/candidates/') && request.method === 'DELETE') {
      if (!isAuthorized(request, env)) {
        return jsonResponse({ error: 'Unauthorized: Admin authentication required.' }, 401);
      }
      if (!env.DB) return jsonResponse({ error: 'D1 database not bound' }, 503);
      const id = pathname.replace('/api/candidates/', '');
      try {
        await env.DB.prepare('DELETE FROM candidates WHERE id = ?').bind(id).run();
        return jsonResponse({ success: true, deleted: id });
      } catch (err: any) {
        return jsonResponse({ error: err.message }, 500);
      }
    }

    // 13. Notice for direct uploads (Requirement 10: R2 disabled to maintain 100% Free Plan)
    if (pathname === '/api/upload') {
      return jsonResponse(
        {
          error: 'Direct device uploads are disabled to keep MPM on Cloudflare 100% Free Plan without paid R2 storage.',
          instruction: 'Please paste existing image URLs (Blogger, Cloudinary, Imgur, Postimages) directly into the image URL field.',
        },
        400
      );
    }

    // Fallback to Static Frontend Assets (Single Page App)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Mimikay Political Movement Application', { status: 200 });
  },
};
