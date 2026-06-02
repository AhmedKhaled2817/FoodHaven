import { Injectable, signal } from '@angular/core';

export type FeatureKey =
  | 'enterpriseDashboard'
  | 'smartSearch'
  | 'prioritySupport'
  | 'darkMode'
  | 'releaseAutomation'
  | 'anomalyMonitoring'
  | 'complianceAudit'
  | 'rbac'
  | 'incidentResponse';

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagService {
  private flags = signal<Record<FeatureKey, boolean>>({
    enterpriseDashboard: true,
    smartSearch: true,
    prioritySupport: false,
    darkMode: true,
    releaseAutomation: false,
    anomalyMonitoring: true,
    complianceAudit: true,
    rbac: true,
    incidentResponse: true,
  });

  get featureFlags() {
    return this.flags;
  }

  isEnabled(key: FeatureKey): boolean {
    return this.flags()[key];
  }

  toggle(key: FeatureKey): void {
    this.flags.update((state) => ({
      ...state,
      [key]: !state[key],
    }));
  }

  set(key: FeatureKey, value: boolean): void {
    this.flags.update((state) => ({
      ...state,
      [key]: value,
    }));
  }
}
