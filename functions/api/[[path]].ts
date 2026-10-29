// Cloudflare Pages Functions API Handler
// Connects Cloudflare Pages directly to Cloudflare D1 on the 100% Free Plan

import worker from '../../worker/index';

export interface EventContext<Env, P extends string, Data> {
  request: Request;
  functionPath: string;
  waitUntil: (promise: Promise<any>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  env: Env;
  params: Record<P, string | string[]>;
  data: Data;
}

export const onRequest = async (context: { request: Request; env: any }): Promise<Response> => {
  return worker.fetch(context.request, context.env);
};
