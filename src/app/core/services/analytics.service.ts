import { Injectable, computed, inject, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CartService } from './cart.service';
import { FavoriteService } from './favorite.service';
import { MealService } from './meal.service';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private cartService = inject(CartService);
  private favoriteService = inject(FavoriteService);
  private mealService = inject(MealService);

  events = signal<string[]>([]);
  pageViews = signal<string[]>([]);

  metrics = computed(() => ({
    activeCarts: this.cartService.cartCount(),
    favorites: this.favoriteService.getFavorites()().length,
    catalogSize: this.mealService.categories().length + this.mealService.areas().length,
    estimatedRevenue: this.cartService.totalPrice(),
  }));

  get uniquePageViews() {
    return computed(() => Array.from(new Set(this.pageViews())));
  }

  addEvent(event: string): void {
    this.events.update((events) => [event, ...events].slice(0, 8));
  }

  trackPageView(url: string): void {
    this.pageViews.update((pages) => [url, ...pages].slice(0, 20));
    this.addEvent(`Page visited: ${url}`);
  }

  initRouteTracking(router: Router): void {
    router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event) => {
      this.trackPageView(event.urlAfterRedirects);
    });
  }
}
