import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  log(message: string, ...args: unknown[]): void {
    if (environment.enableLogging) {
      console.log(`[LOG] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (environment.enableLogging) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (environment.enableLogging) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }

  debug(message: string, ...args: unknown[]): void {
    if (environment.enableLogging) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
}
