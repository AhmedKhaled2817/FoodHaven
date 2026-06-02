import { Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MealService } from '../../core/services/meal.service';
import { CartService } from '../../core/services/cart.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { ToastrService } from 'ngx-toastr';
import { Meal } from '../../core/models/meal.model';
import { MealCardComponent } from '../../shared/components/meal-card/meal-card.component';
import { LocalizationService } from '../../core/services/localization.service';
import AOS from 'aos';

@Component({
  selector: 'app-meal-details',
  standalone: true,
  imports: [CommonModule, MealCardComponent, RouterLink],
  templateUrl: './meal-details.component.html',
  styleUrl: './meal-details.component.scss',
})
export class MealDetailsComponent implements OnInit {
  route = inject(ActivatedRoute);
  mealService = inject(MealService);
  cartService = inject(CartService);
  favoriteService = inject(FavoriteService);
  sanitizer = inject(DomSanitizer);
  toastr = inject(ToastrService);
  localization = inject(LocalizationService);
  platformId = inject(PLATFORM_ID);

  t = (key: string, values?: Record<string, string | number>) =>
    this.localization.t(key, values);

  meal = signal<Meal | null>(null);
  ingredients = signal<{ name: string; measure: string; image: string }[]>([]);
  similarMeals = signal<Meal[]>([]);
  loading = signal(true);
  quantity = signal(1);
  youtubeUrl = signal<SafeResourceUrl | null>(null);

  // Random props for UI
  rating = Math.floor(Math.random() * 2) + 4;
  reviewCount = Math.floor(Math.random() * 200) + 50;
  price = Math.floor(Math.random() * 50) + 10;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      AOS.init({ duration: 800, once: true });
    }

    const resolvedMeal = this.route.snapshot.data['meal'] as Meal | null;
    const mealId = this.route.snapshot.paramMap.get('id');

    if (resolvedMeal) {
      this.setMealDetails(resolvedMeal);
    } else if (mealId) {
      this.loadMealDetails(mealId);
    } else {
      this.loading.set(false);
      this.toastr.error(this.t('mealDetails.loadError'));
    }

    this.loadSimilarMeals();
  }

  loadMealDetails(id: string): void {
    this.loading.set(true);
    this.mealService.getMealById(id).subscribe({
      next: (res) => {
        if (res['meals']?.[0]) {
          this.setMealDetails(res['meals'][0]);
        } else {
          this.loading.set(false);
          this.toastr.error(this.t('mealDetails.notFound'));
        }
      },
      error: () => {
        this.loading.set(false);
        this.toastr.error(this.t('mealDetails.failedLoad'));
      },
    });
  }

  private setMealDetails(meal: Meal): void {
    this.meal.set(meal);
    this.loading.set(false);
    this.extractIngredients(meal);
    if (meal.strYoutube) {
      this.youtubeUrl.set(this.getSafeYoutubeUrl(meal.strYoutube));
    }
  }

  loadSimilarMeals(): void {
    this.mealService.getRandomMeals(4).subscribe({
      next: (meals) => {
        this.similarMeals.set(meals);
      },
    });
  }

  extractIngredients(meal: Meal): void {
    const list: { name: string; measure: string; image: string }[] = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        list.push({
          name: ingredient,
          measure: measure || '',
          image: `https://www.themealdb.com/images/ingredients/${ingredient}-Small.png`,
        });
      }
    }
    this.ingredients.set(list);
  }

  addToCart(meal: Meal): void {
    for (let i = 0; i < this.quantity(); i++) {
      this.cartService.addToCart(meal);
    }
    this.toastr.success(this.t('mealDetails.addedToCart', { quantity: this.quantity(), meal: meal.strMeal }));
  }

  updateQuantity(delta: number): void {
    const newVal = this.quantity() + delta;
    if (newVal >= 1) {
      this.quantity.set(newVal);
    }
  }

  toggleFavorite(meal: Meal): void {
    this.favoriteService.toggleFavorite(meal);
    this.toastr.info(
      this.isFavorite(meal.idMeal)
        ? this.t('mealDetails.addedToFavorites', { meal: meal.strMeal })
        : this.t('mealDetails.removedFromFavorites', { meal: meal.strMeal }),
    );
  }

  isFavorite(mealId: string): boolean {
    return this.favoriteService.isFavorite(mealId);
  }

  getSafeYoutubeUrl(url: string): SafeResourceUrl {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      videoId ? `https://www.youtube.com/embed/${videoId}` : '',
    );
  }
}
