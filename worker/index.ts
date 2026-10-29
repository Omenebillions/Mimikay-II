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

    // --- API ROUTES (Cloudflare D1 Free Tier) ---

    // 1. GET /api/settings
    if (pathname === '/api/settings' && request.method === 'GET') {
      if (!env.DB) return jsonResponse({ error: 'D1 database not bound' }, 503);
      try {
        const result = await env.DB.prepare('SELECT * FROM site_settings WHERE id = ?')
          .bind('current')
          .first();
        return jsonResponse(result || {});
      } catch (err: any) {
        return jsonResponse({ error: err.message }, 500);
      }
    }

    // 2. POST /api/settings (Server-side authenticated write)
    if (pathname === '/api/settings' && request.method === 'POST') {
      if (!isAuthorized(request, env)) {
        return jsonResponse({ error: 'Unauthorized: Admin authentication required.' }, 401);
      }
      if (!env.DB) return jsonResponse({ error: 'D1 database not bound' }, 503);
      try {
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
            body.heroHeadline || body.hero_headline || '',
            body.heroSubtitle || body.hero_subtitle || '',
            body.heroButtonPrimaryText || body.hero_button_primary_text || 'Explore Our Events',
            body.heroButtonPrimaryLink || body.hero_button_primary_link || '/events',
            body.heroButtonSecondaryText || body.hero_button_secondary_text || 'Learn About MPM',
            body.heroButtonSecondaryLink || body.hero_button_secondary_link || '/about',
            body.announcementEnabled ?? body.announcement_enabled ? 1 : 0,
            body.announcementText || body.announcement_text || '',
            body.blogUrl || body.blog_url || 'https://kangaroo.ng',
            body.whatsappGroupUrl || body.whatsapp_group_url || '',
            body.contactEmail || body.contact_email || '',
            body.phone1 || body.phone_1 || '',
            body.phone2 || body.phone_2 || '',
            body.phone3 || body.phone_3 || ''
          )
          .run();
        return jsonResponse({ success: true, message: 'Settings saved to D1' });
      } catch (err: any) {
        return jsonResponse({ error: err.message }, 500);
      }
    }

    // 3. GET /api/events
    if (pathname === '/api/events' && request.method === 'GET') {
      if (!env.DB) return jsonResponse({ error: 'D1 database not bound' }, 503);
      try {
        const { results } = await env.DB.prepare(
          'SELECT * FROM events ORDER BY event_date DESC, created_at DESC'
        ).all();
        return jsonResponse(results || []);
      } catch (err: any) {
        return jsonResponse({ error: err.message }, 500);
      }
    }

    // 4. GET /api/events/:slug
    if (pathname.startsWith('/api/events/') && request.method === 'GET') {
      const slug = pathname.replace('/api/events/', '');
      if (!env.DB) return jsonResponse({ error: 'D1 database not bound' }, 503);
      try {
        const event = await env.DB.prepare('SELECT * FROM events WHERE slug = ?')
          .bind(slug)
          .first();
        if (!event) return jsonResponse({ error: 'Event not found' }, 404);
        return jsonResponse(event);
      } catch (err: any) {
        return jsonResponse({ error: err.message }, 500);
      }
    }

    // 5. POST /api/events (Server-side authenticated event create/update)
    if (pathname === '/api/events' && request.method === 'POST') {
      if (!isAuthorized(request, env)) {
        return jsonResponse({ error: 'Unauthorized: Admin authentication required.' }, 401);
      }
      if (!env.DB) return jsonResponse({ error: 'D1 database not bound' }, 503);
      try {
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
      if (!env.DB) return jsonResponse({ error: 'D1 database not bound' }, 503);
      try {
        const { results } = await env.DB.prepare('SELECT * FROM campaigns').all();
        return jsonResponse(results || []);
      } catch (err: any) {
        return jsonResponse({ error: err.message }, 500);
      }
    }

    // 8. GET /api/campaigns/active
    if (pathname === '/api/campaigns/active' && request.method === 'GET') {
      if (!env.DB) return jsonResponse({ error: 'D1 database not bound' }, 503);
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
        return jsonResponse(campaign || null);
      } catch (err: any) {
        return jsonResponse({ error: err.message }, 500);
      }
    }

    // 9. POST /api/campaigns (Server-side authenticated campaign write)
    if (pathname === '/api/campaigns' && request.method === 'POST') {
      if (!isAuthorized(request, env)) {
        return jsonResponse({ error: 'Unauthorized: Admin authentication required.' }, 401);
      }
      if (!env.DB) return jsonResponse({ error: 'D1 database not bound' }, 503);
      try {
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
      if (!env.DB) return jsonResponse({ error: 'D1 database not bound' }, 503);
      try {
        const { results } = await env.DB.prepare(
          'SELECT * FROM candidates ORDER BY order_index ASC'
        ).all();
        return jsonResponse(results || []);
      } catch (err: any) {
        return jsonResponse({ error: err.message }, 500);
      }
    }

    // 11. POST /api/candidates (Server-side authenticated pop-up candidate write)
    if (pathname === '/api/candidates' && request.method === 'POST') {
      if (!isAuthorized(request, env)) {
        return jsonResponse({ error: 'Unauthorized: Admin authentication required.' }, 401);
      }
      if (!env.DB) return jsonResponse({ error: 'D1 database not bound' }, 503);
      try {
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
