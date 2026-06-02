import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CartService } from '../../../core/services/cart.service';
import { FavoriteService } from '../../../core/services/favorite.service';
import { AuthService } from '../../../core/services/auth-service';
import { ThemeService } from '../../../core/services/theme.service';
import { LocalizationService } from '../../../core/services/localization.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  cartService = inject(CartService);
  favService = inject(FavoriteService);
  auth = inject(AuthService);
  themeService = inject(ThemeService);
  localizationService = inject(LocalizationService);

  cartCount = this.cartService.cartCount;
  favoriteCount = computed(() => this.favService.getFavorites()().length);

  isLoggedIn = this.auth.isLoggedIn;
  currentUser = this.auth.getUser();

  t = (key: string, values?: Record<string, string | number>) =>
    this.localizationService.t(key, values);

  get currentLocale() {
    return this.localizationService.locale();
  }

  get dir() {
    return this.localizationService.direction();
  }

  logout() {
    this.auth.logout();
  }

  toggleLanguage(): void {
    this.localizationService.setLocale(this.currentLocale === 'en' ? 'ar' : 'en');
  }
}
