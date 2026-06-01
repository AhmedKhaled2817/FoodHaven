import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoriteService } from '../../core/services/favorite.service';
import { MealCardComponent } from '../../shared/components/meal-card/meal-card.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, MealCardComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
})
export class FavoritesComponent {
  favoriteService = inject(FavoriteService);
  favorites = this.favoriteService.getFavorites();
}
