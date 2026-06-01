import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Meal } from '../../../core/models/meal.model';
import { CartService } from '../../../core/services/cart.service';
import { FavoriteService } from '../../../core/services/favorite.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-meal-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './meal-card.component.html',
  styleUrl: './meal-card.component.scss',
})
export class MealCardComponent {
  @Input({ required: true }) meal!: Meal;
  cartService = inject(CartService);
  favoriteService = inject(FavoriteService);
  toastr = inject(ToastrService);
  rating = Math.floor(Math.random() * 2) + 4;
  reviewCount = Math.floor(Math.random() * 100) + 10;

  addToCart(meal: Meal): void {
    this.cartService.addToCart(meal);
    this.toastr.success(`${meal.strMeal} added to cart!`);
  }

  toggleFavorite(meal: Meal): void {
    const wasFavorite = this.isFavorite(meal.idMeal);
    this.favoriteService.toggleFavorite(meal);
    if (wasFavorite) {
      this.toastr.info(`${meal.strMeal} removed from favorites`);
    } else {
      this.toastr.success(`${meal.strMeal} added to favorites!`);
    }
  }

  isFavorite(mealId: string): boolean {
    return this.favoriteService.isFavorite(mealId);
  }
}
