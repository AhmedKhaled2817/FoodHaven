import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { finalize, tap } from 'rxjs';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  loadingService.startLoading();
  
  return next(req).pipe(
    finalize(() => {
      loadingService.stopLoading();
    })
  );
};
