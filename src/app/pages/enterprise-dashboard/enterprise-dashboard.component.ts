import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { AnalyticsService } from '../../core/services/analytics.service';
import { FeatureFlagService, FeatureKey } from '../../core/services/feature-flag.service';
import { MealService } from '../../core/services/meal.service';
import { Meal } from '../../core/models/meal.model';
import { ThemeService } from '../../core/services/theme.service';
import { MealCardComponent } from '../../shared/components/meal-card/meal-card.component';

interface EnterpriseDashboardResolvedData {
  activeCarts: number;
  favorites: number;
  catalogSize: number;
  estimatedRevenue: number;
  supportHealth: string;
  featureFlags: Record<string, boolean>;
}

@Component({
  selector: 'app-enterprise-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MealCardComponent],
  templateUrl: './enterprise-dashboard.component.html',
  styleUrl: './enterprise-dashboard.component.scss',
})
export class EnterpriseDashboardComponent implements OnInit {
  route = inject(ActivatedRoute);
  analyticsService = inject(AnalyticsService);
  flagService = inject(FeatureFlagService);
  mealService = inject(MealService);
  themeService = inject(ThemeService);

  searchTerm = signal('');
  searchResults = signal(0);
  searchMeals = signal<Meal[]>([]);
  isLoading = signal(false);
  searchHistory = signal<string[]>([]);
  searchSuggestions = signal<string[]>([]);
  searchSource = signal<string[]>([]);
  searchSubject = new Subject<string>();
  destroy$ = new Subject<void>();

  selectedRole = signal('Enterprise Admin');
  releaseGate = signal<'Canary' | 'Selective' | 'Global'>('Canary');
  actionResult = signal('');
  auditTrail = signal<string[]>([]);
  lastReport = signal('No report generated yet.');

  resolvedData = signal<EnterpriseDashboardResolvedData>(this.route.snapshot.data['dashboardData']);
  pageTitle = signal<string>(this.route.snapshot.data?.['title'] ?? 'Enterprise Control Center');

  featureKeys = [
    'enterpriseDashboard',
    'smartSearch',
    'prioritySupport',
    'releaseAutomation',
    'anomalyMonitoring',
    'complianceAudit',
    'rbac',
    'incidentResponse',
    'darkMode',
  ] as FeatureKey[];

  regionalStatus = signal([
    { name: 'US-East', status: 'Operational' },
    { name: 'EU-West', status: 'Operational' },
    { name: 'APAC', status: 'Degraded' },
  ]);
  quickActions = [
    {
      id: 'refresh',
      label: 'Refresh Forecast',
      icon: '🔄',
      description: 'Sync with latest traffic and revenue signals.',
    },
    {
      id: 'deploy',
      label: 'Deploy Rollout',
      icon: '🚀',
      description: 'Trigger the next release wave for premium features.',
    },
    {
      id: 'audit',
      label: 'Run Compliance Audit',
      icon: '🛡️',
      description: 'Validate active controls and operational posture.',
    },
    {
      id: 'incident',
      label: 'Activate Incident Mode',
      icon: '🚨',
      description: 'Escalate response and notify the operations team.',
    },
    {
      id: 'report',
      label: 'Export Governance Report',
      icon: '📄',
      description: 'Create an enterprise compliance report for stakeholders.',
    },
    {
      id: 'cache',
      label: 'Warm Search Cache',
      icon: '⚡',
      description: 'Populate premium query cache for ultra-fast results.',
    },
  ];

  currentFeatureFlags = computed(() =>
    this.featureKeys.reduce((flags, key) => ({
      ...flags,
      [key]: this.flagService.isEnabled(key),
    }), {} as Record<FeatureKey, boolean>),
  );

  smartSearchEnabled = computed(() => this.flagService.isEnabled('smartSearch'));
  anomalyMonitoringEnabled = computed(() => this.flagService.isEnabled('anomalyMonitoring'));
  releaseAutomationEnabled = computed(() => this.flagService.isEnabled('releaseAutomation'));
  prioritySupportEnabled = computed(() => this.flagService.isEnabled('prioritySupport'));
  complianceAuditEnabled = computed(() => this.flagService.isEnabled('complianceAudit'));
  rbacEnabled = computed(() => this.flagService.isEnabled('rbac'));
  incidentResponseEnabled = computed(() => this.flagService.isEnabled('incidentResponse'));

  releaseGateStatus = computed(() => {
    const gate = this.releaseGate();
    return gate === 'Canary'
      ? 'Canary rollout with targeted VIP traffic'
      : gate === 'Selective'
      ? 'Selective release across growth regions'
      : 'Global deploy with enterprise approval';
  });

  rolePermissions = computed(() => {
    switch (this.selectedRole()) {
      case 'Security Officer':
        return ['View audit logs', 'Approve releases', 'Set escalation thresholds'];
      case 'Ops Lead':
        return ['Deploy rollouts', 'Monitor incidents', 'Manage gates'];
      case 'Support Manager':
        return ['View SLAs', 'Review incident trends', 'Assign tickets'];
      default:
        return ['Full enterprise access', 'Manage governance', 'Override release gates'];
    }
  });

  complianceReportStatus = computed(() =>
    this.complianceAuditEnabled()
      ? `Compliance score is ${this.complianceScore()} and audit gating is active.`
      : 'Compliance audit is disabled. Enable to generate governance reports.',
  );

  complianceScore = computed(() => {
    const base = this.complianceAuditEnabled() ? 94 : 78;
    const penalty = this.anomalyMonitoringEnabled() ? 0 : 6;
    return `${Math.min(100, base - penalty)}%`;
  });

  incidentCount = computed(() =>
    this.incidentResponseEnabled() ? Math.max(1, Math.round(this.resolvedData().activeCarts / 12)) : 0,
  );

  slaStatus = computed(() =>
    this.incidentResponseEnabled() ? '99.3% uptime' : '98.0% uptime',
  );

  searchPulseStatus = computed(() => {
    if (!this.smartSearchEnabled()) {
      return 'Activate Smart Search to enable predictive insights and live suggestions.';
    }
    const query = this.searchTerm().trim();
    if (!query) {
      return 'Type a term to see premium search predictions immediately.';
    }
    if (query.length < 3) {
      return 'Keep typing — 3+ characters unlock premium prediction.';
    }
    return 'Premium search pulse active. Displaying live prediction and results as you type.';
  });

  themeMode = computed(() => (this.themeService.isDark() ? 'Dark' : 'Light'));
  searchScore = computed(() => {
    const base = Math.min(100, this.searchTerm().length * 8 + this.searchResults() * 3);
    return `${base}% relevance`;
  });

  anomalyRisk = computed(() => {
    if (!this.anomalyMonitoringEnabled()) {
      return 'Monitoring inactive';
    }
    const score = Math.min(100, Math.round((this.resolvedData().estimatedRevenue / 900) + this.searchResults() * 2));
    return score > 75 ? `High (${score}%)` : score > 45 ? `Medium (${score}%)` : `Low (${score}%)`;
  });

  launchWindow = computed(() =>
    this.releaseAutomationEnabled() ? 'Auto deploy in 02h 20m' : 'Manual rollout ready',
  );

  dashboardCards = computed(() => [
    {
      label: 'Open Carts',
      value: this.resolvedData().activeCarts,
      description: 'Current orders in customer carts',
    },
    {
      label: 'Incident Count',
      value: this.incidentCount(),
      description: 'Active incidents requiring operational attention',
    },
    {
      label: 'Compliance Score',
      value: this.complianceScore(),
      description: 'Governance score from the latest audit pass',
    },
    {
      label: 'Rollout Window',
      value: this.launchWindow(),
      description: 'Enterprise launch readiness and schedule',
    },
    {
      label: 'SLA Status',
      value: this.slaStatus(),
      description: 'Service-level agreement performance for enterprise customers',
    },
    {
      label: 'Projected Revenue',
      value: `$${this.resolvedData().estimatedRevenue.toFixed(2)}`,
      description: 'Potential revenue based on current cart totals',
    },
  ]);

  ngOnInit(): void {
    const routeData = this.route.snapshot.data['dashboardData'];
    if (routeData) {
      this.resolvedData.set(routeData);
      this.pageTitle.set(this.route.snapshot.data?.['title'] ?? this.pageTitle());
    }

    this.loadSearchHistory();
    this.loadAuditTrail();
    this.initializeSearchSource();

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((query) => {
        if (!this.smartSearchEnabled() || query.trim().length < 3) {
          this.searchResults.set(0);
          return;
        }
        this.executeSmartSearch(query);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSearchHistory(): void {
    const saved = localStorage.getItem('enterprise-search-history');
    if (saved) {
      this.searchHistory.set(JSON.parse(saved));
    }
  }

  saveSearchHistory(): void {
    localStorage.setItem('enterprise-search-history', JSON.stringify(this.searchHistory()));
  }

  loadAuditTrail(): void {
    const saved = localStorage.getItem('enterprise-audit-trail');
    if (saved) {
      this.auditTrail.set(JSON.parse(saved));
    } else {
      this.auditTrail.set([
        'Initial enterprise governance audit loaded.',
        'Operational regions synchronized with compliance dashboard.',
      ]);
    }
  }

  saveAuditTrail(): void {
    localStorage.setItem('enterprise-audit-trail', JSON.stringify(this.auditTrail()));
  }

  addSearchHistory(query: string): void {
    const normalized = query.trim();
    if (!normalized) {
      return;
    }
    const history = [normalized, ...this.searchHistory().filter((item) => item.toLowerCase() !== normalized.toLowerCase())].slice(0, 10);
    this.searchHistory.set(history);
    this.saveSearchHistory();
  }

  initializeSearchSource(): void {
    const categories = this.mealService.categories().map((item) => item.strCategory);
    const areas = this.mealService.areas().map((item) => item.strArea);
    this.searchSource.set([
      ...categories,
      ...areas,
      'Chef Specials',
      'Quick Delivery',
      'Healthy Picks',
      'Low-carb meals',
      'Family Feast',
    ]);
  }

  updateSearchInput(value: string): void {
    this.searchTerm.set(value);
    if (this.smartSearchEnabled()) {
      this.updateSuggestions(value);
      this.searchSubject.next(value);
    }
  }

  updateSuggestions(query: string): void {
    if (!query.trim()) {
      this.searchSuggestions.set([]);
      return;
    }
    const normalized = query.trim().toLowerCase();
    const suggestions = this.searchSource()
      .filter((item) => item.toLowerCase().includes(normalized))
      .slice(0, 5);
    this.searchSuggestions.set(suggestions);
  }

  selectSuggestion(value: string): void {
    this.searchTerm.set(value);
    this.updateSuggestions(value);
    this.searchSubject.next(value);
  }

  executeSmartSearch(query: string): void {
    this.isLoading.set(true);
    this.mealService.searchMealByName(query).subscribe({
      next: (res) => {
        const meals = res.meals ?? [];
        this.searchMeals.set(meals);
        this.searchResults.set(meals.length);
        this.analyticsService.addEvent(`Smart search query executed: ${query}`);
        this.addSearchHistory(query);
        this.isLoading.set(false);
      },
      error: () => {
        this.searchMeals.set([]);
        this.searchResults.set(0);
        this.analyticsService.addEvent(`Smart search query failed: ${query}`);
        this.isLoading.set(false);
      },
    });
  }

  toggleFlag(key: FeatureKey): void {
    this.flagService.toggle(key);
    if (key === 'darkMode') {
      const enabled = this.flagService.isEnabled('darkMode');
      this.themeService.setTheme(enabled ? 'dark' : 'light');
    }
    if (key === 'releaseAutomation') {
      this.actionResult.set(
        this.flagService.isEnabled('releaseAutomation')
          ? 'Release automation enabled. Future rollouts will follow the scheduled window.'
          : 'Release automation disabled. Manual deployments remain available.',
      );
    }
    if (key === 'incidentResponse') {
      this.actionResult.set(
        this.flagService.isEnabled('incidentResponse')
          ? 'Incident response mode enabled for proactive monitoring.'
          : 'Incident response paused. Monitoring continues in background.',
      );
    }
    if (key === 'complianceAudit') {
      this.actionResult.set(
        this.flagService.isEnabled('complianceAudit')
          ? 'Compliance audit mode activated. Governance reporting is live.'
          : 'Governance and compliance reporting are disabled.',
      );
    }
  }

  assignRole(role: string): void {
    this.selectedRole.set(role);
    this.analyticsService.addEvent(`Role changed to ${role}`);
    this.actionResult.set(`Assigned ${role} permissions for this session.`);
  }

  setReleaseGate(gate: 'Canary' | 'Selective' | 'Global'): void {
    this.releaseGate.set(gate);
    this.analyticsService.addEvent(`Release gate set to ${gate}`);
    this.actionResult.set(`Release gate updated to ${gate} rollout.`);
  }

  generateComplianceReport(): void {
    const report = `Compliance report generated at ${new Date().toLocaleTimeString()}. Score: ${this.complianceScore()}.`;
    this.lastReport.set(report);
    this.auditTrail.update((trail) => [report, ...trail].slice(0, 10));
    this.saveAuditTrail();
    this.analyticsService.addEvent('Governance report exported.');
    this.actionResult.set('Governance report exported successfully.');
  }

  refreshEnterpriseMetrics(): void {
    const metrics = this.analyticsService.metrics();
    this.resolvedData.update((data) => ({
      ...data,
      activeCarts: metrics.activeCarts,
      favorites: metrics.favorites,
      catalogSize: metrics.catalogSize,
      estimatedRevenue: metrics.estimatedRevenue,
    }));
    this.analyticsService.addEvent('Enterprise forecast refreshed.');
  }

  runQuickAction(actionId: string): void {
    switch (actionId) {
      case 'refresh':
        this.refreshEnterpriseMetrics();
        this.actionResult.set('Forecast updated with newest premium analytics.');
        break;
      case 'deploy':
        this.actionResult.set(
          this.releaseAutomationEnabled()
            ? 'Auto deployment pipeline triggered successfully.'
            : 'Deployment queued for manual review and release.',
        );
        this.analyticsService.addEvent('Enterprise rollout action executed.');
        break;
      case 'audit':
        this.actionResult.set('Compliance audit complete. No critical issues detected.');
        this.analyticsService.addEvent('Enterprise compliance audit run.');
        break;
      case 'incident':
        this.actionResult.set('Incident response mode triggered. Notifying operations and support teams.');
        this.analyticsService.addEvent('Incident response action executed.');
        break;
      case 'report':
        this.generateComplianceReport();
        break;
      case 'cache':
        this.actionResult.set('Premium search cache warmed for instant query performance.');
        this.analyticsService.addEvent('Search cache warming completed.');
        break;
      default:
        this.actionResult.set('Action executed.');
    }
  }

  search(): void {
    const query = this.searchTerm().trim();
    if (!query) {
      this.searchResults.set(0);
      this.searchMeals.set([]);
      return;
    }

    this.isLoading.set(true);
    this.mealService.searchMealByName(query).subscribe({
      next: (res) => {
        const meals = res.meals ?? [];
        this.searchMeals.set(meals);
        this.searchResults.set(meals.length);
        this.analyticsService.addEvent(`Search executed: ${query}`);
        this.isLoading.set(false);
      },
      error: () => {
        this.searchMeals.set([]);
        this.searchResults.set(0);
        this.analyticsService.addEvent(`Search failed: ${query}`);
        this.isLoading.set(false);
      },
    });
  }
}
