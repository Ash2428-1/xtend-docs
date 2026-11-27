/**
 * Vercel serverless entry point (xtend-docs).
 *
 * Same as main.js, minus the long-running parts:
 *  - no `serve()` call: Vercel invokes the exported fetch handler per request;
 *  - no static file serving: Vercel serves build/client from its CDN.
 *
 * Background and cron jobs must use the Inngest provider
 * (NEXT_PRIVATE_JOBS_PROVIDER=inngest), since nothing runs between requests.
 *
 * Copied to build/server/vercel.js during build (see .bin/build.sh).
 */
import handle from 'hono-react-router-adapter/node';

import { getLoadContext } from './hono/server/load-context.js';
import server from './hono/server/router.js';
import * as build from './index.js';

const handler = handle(build, server, { getLoadContext });

export default {
  fetch: (request) => handler.fetch(request),
};
