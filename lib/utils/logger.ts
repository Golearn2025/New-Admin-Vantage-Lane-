/**
 * Logger Utility
 * 
 * Replaces console.* statements with proper error handling
 * In development: logs to console
 * In production: can be extended to send to monitoring service
 * 
 * Compliant: <80 lines (utility file limit)
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  
  /**
   * Log informational message
   */
  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }
  
  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }
  
  /**
   * Log error message
   */
  error(message: string, context?: LogContext): void {
    this.log('error', message, context);
  }
  
  /**
   * Log debug message (only in development)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      this.log('debug', message, context);
    }
  }
  
  /**
   * Internal log method
   */
  private log(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    // In development, log to console for debugging
    if (this.isDevelopment) {
      const logFn = level === 'error' ? console.error : 
                    level === 'warn' ? console.warn : 
                    console.log;
      
      if (context) {
        logFn(prefix, message, context);
      } else {
        logFn(prefix, message);
      }
    }
    
    // In production, you can extend this to send to monitoring service
    // Example: Sentry, DataDog, CloudWatch, etc.
    // if (!this.isDevelopment && level === 'error') {
    //   sentryClient.captureException(new Error(message), { extra: context });
    // }
  }
}

// Export singleton instance
export const logger = new Logger();
