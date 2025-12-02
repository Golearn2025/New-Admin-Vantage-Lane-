/**
 * Sentry Server Configuration
 * 
 * Monitors API routes, server-side errors, performance
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://a900b2611ddefc16323a029b52b79802@o4510108108652544.ingest.de.sentry.io/4510429042114640",
  
  // Enable logging for structured logs
  enableLogs: true,
  
  // Performance Monitoring
  tracesSampleRate: 1.0,
  
  integrations: [
    // Console logging integration for server-side logs
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],
  
  environment: process.env.NODE_ENV || 'development',
});
