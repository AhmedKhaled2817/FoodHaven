import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoriteService } from '../../core/services/favorite.service';
import { MealCardComponent } from '../../shared/components/meal-card/meal-card.component';
import { LocalizationService } from '../../core/services/localization.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, MealCardComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
})
export class FavoritesComponent {
  favoriteService = inject(FavoriteService);
  localization = inject(LocalizationService);
  favorites = this.favoriteService.getFavorites();

  t = (key: string, values?: Record<string, string | number>) =>
    this.localization.t(key, values);
}
