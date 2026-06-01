import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  constructor(
    private toastr: ToastrService,
    private loggingService: LoggingService,
  ) {}

  handleError(error: unknown): void {
    let errorMessage = 'An unexpected error occurred';

    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Client-side error: ${error.error.message}`;
      } else {
        errorMessage = `Server error: ${error.status} - ${
          error.message || error.statusText
        }`;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    this.loggingService.error('Error occurred:', error);
    this.toastr.error(errorMessage, 'Error');
  }
}
