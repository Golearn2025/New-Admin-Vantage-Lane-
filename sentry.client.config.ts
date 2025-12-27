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
  
  // Performance Monitoring - OPTIMIZED for cost
  // Track only 10% of transactions to stay within free tier
  tracesSampleRate: 0.1,
  
  // Session Replay - OPTIMIZED for cost
  replaysSessionSampleRate: 0.05, // 5% of sessions (reduced from 10%)
  replaysOnErrorSampleRate: 0.5, // 50% of error sessions (reduced from 100%)
  
  integrations: [
    // Console logging integration
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],
  
  environment: process.env.NODE_ENV || 'development',
});
