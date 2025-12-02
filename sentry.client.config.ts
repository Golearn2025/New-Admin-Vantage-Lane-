/**
 * Sentry Client Configuration
 * 
 * Monitors frontend errors, performance, user sessions
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://a900b2611ddefc16323a029b52b79802@o4510108108652544.ingest.de.sentry.io/4510429042114640",
  
  // Enable logging for structured logs
  enableLogs: true,
  
  // Performance Monitoring
  tracesSampleRate: 1.0,
  
  // Session Replay
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
  
  integrations: [
    // Console logging integration
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],
  
  environment: process.env.NODE_ENV || 'development',
});
