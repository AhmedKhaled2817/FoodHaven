import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AnalyticsService } from '../services/analytics.service';
import { FeatureFlagService } from '../services/feature-flag.service';

export interface EnterpriseDashboardResolvedData {
  activeCarts: number;
  favorites: number;
  catalogSize: number;
  estimatedRevenue: number;
  supportHealth: string;
  featureFlags: Record<string, boolean>;
}

@Injectable({
  providedIn: 'root',
})
export class EnterpriseDashboardResolver implements Resolve<EnterpriseDashboardResolvedData> {
  constructor(
    private analyticsService: AnalyticsService,
    private featureFlagService: FeatureFlagService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EnterpriseDashboardResolvedData> {
    const metrics = this.analyticsService.metrics();
    return of({
      activeCarts: metrics.activeCarts,
      favorites: metrics.favorites,
      catalogSize: metrics.catalogSize,
      estimatedRevenue: metrics.estimatedRevenue,
      supportHealth: this.featureFlagService.isEnabled('prioritySupport') ? 'Priority SLA' : 'Standard SLA',
      featureFlags: this.featureFlagService.featureFlags(),
    });
  }
}
