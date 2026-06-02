import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { LoadingService } from './core/services/loading.service';
import { ThemeService } from './core/services/theme.service';
import { SeoService } from './core/services/seo.service';
import { AnalyticsService } from './core/services/analytics.service';
import { LocalizationService } from './core/services/localization.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  loadingService = inject(LoadingService);
  themeService = inject(ThemeService); // Inject to trigger constructor
  seoService = inject(SeoService);
  analyticsService = inject(AnalyticsService);
  localizationService = inject(LocalizationService);
  router = inject(Router);

  constructor() {
    this.seoService.initialize();
    this.analyticsService.initRouteTracking(this.router);
    this.localizationService.initialize();
  }
}
