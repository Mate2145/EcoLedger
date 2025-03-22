import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  constructor() {
    if (!environment.production) {
      console.info('%c[LOGGER] Logger initialized in development mode', 'color: #4caf50; font-weight: bold');
    }
  }

  /**
   * Log a debug message (development only)
   */
  debug(message: string, ...data: any[]): void {
    if (!environment.production) {
      console.debug(`%c[DEBUG] ${message}`, 'color: #9575cd', ...data);
    }
  }

  /**
   * Log an info message (development only)
   */
  info(message: string, ...data: any[]): void {
    if (!environment.production) {
      console.info(`%c[INFO] ${message}`, 'color: #4caf50', ...data);
    }
  }

  /**
   * Log a warning message (development only)
   */
  warn(message: string, ...data: any[]): void {
    if (!environment.production) {
      console.warn(`%c[WARN] ${message}`, 'color: #ff9800', ...data);
    }
  }

  /**
   * Log an error message (both development and production)
   */
  error(message: string, ...data: any[]): void {
    console.error(`%c[ERROR] ${message}`, 'color: #f44336', ...data);
  }
}