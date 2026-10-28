export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  all<T = unknown>(): Promise<{ results: T[] }>;
  run<T = unknown>(): Promise<{ success: boolean; meta: any }>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

export interface R2ObjectBody {
  body: ReadableStream;
  httpEtag: string;
  writeHttpMetadata(headers: Headers): void;
}

export interface R2Bucket {
  put(key: string, value: ReadableStream | ArrayBuffer | string, options?: any): Promise<any>;
  get(key: string): Promise<R2ObjectBody | null>;
  delete(key: string): Promise<void>;
}

export interface Fetcher {
  fetch(request: Request): Promise<Response>;
}

export interface Env {
  DB: D1Database;
  IMAGES: R2Bucket;
  ASSETS: Fetcher;
  ADMIN_PASSPHRASE?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // CORS headers for API requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // --- API ROUTES ---

    // 1. GET /api/settings
    if (pathname === '/api/settings' && request.method === 'GET') {
      try {
        const result = await env.DB.prepare('SELECT * FROM site_settings WHERE id = ?')
          .bind('current')
          .first();
        return new Response(JSON.stringify(result || {}), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: corsHeaders,
        });
      }
    }

    // 2. GET /api/events
    if (pathname === '/api/events' && request.method === 'GET') {
      try {
        const { results } = await env.DB.prepare(
          'SELECT * FROM events WHERE published = 1 ORDER BY event_date DESC, created_at DESC'
        ).all();
        return new Response(JSON.stringify(results), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: corsHeaders,
        });
      }
    }

    // 3. GET /api/events/:slug
    if (pathname.startsWith('/api/events/') && request.method === 'GET') {
      const slug = pathname.replace('/api/events/', '');
      try {
        const event = await env.DB.prepare('SELECT * FROM events WHERE slug = ?')
          .bind(slug)
          .first();
        if (!event) {
          return new Response(JSON.stringify({ error: 'Event not found' }), {
            status: 404,
            headers: corsHeaders,
          });
        }
        return new Response(JSON.stringify(event), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: corsHeaders,
        });
      }
    }

    // 4. GET /api/campaigns/active
    if (pathname === '/api/campaigns/active' && request.method === 'GET') {
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

        return new Response(JSON.stringify(campaign || null), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: corsHeaders,
        });
      }
    }

    // 5. POST /api/upload (Cloudflare R2 Image Upload)
    if (pathname === '/api/upload' && request.method === 'POST') {
      try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        if (!file) {
          return new Response(JSON.stringify({ error: 'No file provided' }), {
            status: 400,
            headers: corsHeaders,
          });
        }

        const extension = file.name.split('.').pop() || 'jpg';
        const key = `uploads/${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;

        await env.IMAGES.put(key, file.stream(), {
          httpMetadata: { contentType: file.type },
        });

        const publicUrl = `/api/images/${key}`;
        return new Response(JSON.stringify({ success: true, key, url: publicUrl }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: corsHeaders,
        });
      }
    }

    // 6. GET /api/images/:key* (Serve R2 object)
    if (pathname.startsWith('/api/images/') && request.method === 'GET') {
      const key = pathname.replace('/api/images/', '');
      const object = await env.IMAGES.get(key);
      if (!object) {
        return new Response('Not Found', { status: 404 });
      }
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('etag', object.httpEtag);
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      return new Response(object.body, { headers });
    }

    // Otherwise, route to Static Assets (Single Page App)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Mimikay Political Movement Application', { status: 200 });
  },
};
