/**
 * Sentry Edge Runtime Configuration
 * 
 * Monitors Edge functions and middleware
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://a900b2611ddefc16323a029b52b79802@o4510108108652544.ingest.de.sentry.io/4510429042114640",
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV || 'development',
});
