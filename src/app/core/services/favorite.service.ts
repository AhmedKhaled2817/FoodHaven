import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Meal } from '../models/meal.model';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private platformId = inject(PLATFORM_ID);
  private favorites = signal<Meal[]>([]);

  constructor() { 
    if (isPlatformBrowser(this.platformId)) {
      this.favorites.set(this.loadFavoritesFromStorage());
    }
  }

  private loadFavoritesFromStorage(): Meal[] {
    const saved = localStorage.getItem('foodHavenFavorites');
    return saved ? JSON.parse(saved) : [];
  }

  private saveFavoritesToStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('foodHavenFavorites', JSON.stringify(this.favorites()));
    }
  }

  getFavorites() {
    return this.favorites;
  }

  toggleFavorite(meal: Meal): void {
    this.favorites.update(favs => {
      const index = favs.findIndex(f => f.idMeal === meal.idMeal);
      if (index > -1) {
        return favs.filter(f => f.idMeal !== meal.idMeal);
      }
      return [...favs, meal];
    });
    this.saveFavoritesToStorage();
  }

  isFavorite(mealId: string): boolean {
    return this.favorites().some(f => f.idMeal === mealId);
  }
}
