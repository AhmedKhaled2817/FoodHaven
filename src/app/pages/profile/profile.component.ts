import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth-service';
import { FavoriteService } from '../../core/services/favorite.service';
import { Router, RouterLink } from '@angular/router';
import { LocalizationService } from '../../core/services/localization.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  themeService = inject(ThemeService);
  authService = inject(AuthService);
  favoriteService = inject(FavoriteService);
  localization = inject(LocalizationService);
  router = inject(Router);

  t = (key: string, values?: Record<string, string | number>) =>
    this.localization.t(key, values);

  user = this.authService.getUser();
  currentPoints = this.authService.currentPoints;
  memberTier = this.authService.memberTier;

  favoriteCount = computed(() => this.favoriteService.getFavorites()().length);
  loyaltyProgress = computed(() => Math.min(100, Math.round((this.currentPoints() / 200) * 100)));
  nextRewardPoints = computed(() => Math.max(0, 200 - this.currentPoints()));

  logout(): void {
    this.authService.logout();
  }

  tierBenefits(): string[] {
    return this.authService.getTierBenefits(this.memberTier());
  }
}
