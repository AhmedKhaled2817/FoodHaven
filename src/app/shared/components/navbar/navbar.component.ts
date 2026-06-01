import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CartService } from '../../../core/services/cart.service';
import { FavoriteService } from '../../../core/services/favorite.service';
import { AuthService } from '../../../core/services/auth-service';
import { ThemeService } from '../../../core/services/theme.service';

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

  cartCount = this.cartService.cartCount;
  favoriteCount = computed(() => this.favService.getFavorites()().length);

  isLoggedIn = this.auth.isLoggedIn;
  currentUser = this.auth.getUser();

  logout() {
    this.auth.logout();
  }
}
