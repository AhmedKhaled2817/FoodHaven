import { Component, computed, inject, OnInit, PLATFORM_ID, signal, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { CartService } from '../../core/services/cart.service';
import { MealService } from '../../core/services/meal.service';
import { Meal } from '../../core/models/meal.model';
import { MealCardComponent } from '../../shared/components/meal-card/meal-card.component';
import { FeaturedSectionComponent } from '../../shared/components/featured-section/featured-section.component';
import { HoverGlowDirective } from '../../shared/directives/hover-glow.directive';
import { ToastrService } from 'ngx-toastr';
import { PromotionService } from '../../core/services/promotion.service';
import { LocalizationService } from '../../core/services/localization.service';
import AOS from 'aos';

// Swiper imports (optional, for carousel)
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// Import Swiper elements if needed
import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MealCardComponent, FeaturedSectionComponent, HoverGlowDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // For Swiper custom element
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  mealService = inject(MealService);
  cartService = inject(CartService);
  platformId = inject(PLATFORM_ID);
  toastr = inject(ToastrService);
  localizationService = inject(LocalizationService);

  t = (key: string, values?: Record<string, string | number>) =>
    this.localizationService.t(key, values);

  // State using Signals
  meals = signal<Meal[]>([]);
  originalMeals = signal<Meal[]>([]); // To keep original list for sorting
  featuredMeals = signal<Meal[]>([]);
  searchQuery = signal('');
  selectedCategory = signal('');
  selectedArea = signal('');
  selectedIngredient = signal('');
  sortBy = signal('');
  loading = signal(true);
  searchLoading = signal(false);
  searchHistory = signal<string[]>([]);
  ingredients = signal<{ strIngredient: string }[]>([]);

  categories = this.mealService.categories;
  areas = this.mealService.areas;
  promotionService = inject(PromotionService);

  recommendedMeals = computed(() => {
    const query = this.searchHistory()[0] || this.searchQuery();
    const source = this.meals().length ? this.meals() : this.featuredMeals();
    if (!query) {
      return source.slice(0, 4);
    }
    const matches = source.filter((meal) => meal.strMeal.toLowerCase().includes(query.toLowerCase()));
    return matches.length ? matches.slice(0, 4) : source.slice(0, 4);
  });

  flashOffers = this.promotionService.availablePromotions;

  get topProductCategories() {
    return [
      this.t('home.categoryCake'),
      this.t('home.categoryMuffins'),
      this.t('home.categoryCroissant'),
      this.t('home.categoryBread'),
      this.t('home.categoryTart'),
      this.t('home.categoryFavorite')
    ];
  }
  selectedProductCategory = signal('Cake');
  get topProducts() {
    return [
      {
        idMeal: 'P001',
        strMeal: 'Whole Grain Bread',
        strMealThumb: 'https://www.themealdb.com/images/media/meals/1bsv1q1560459826.jpg',
        strCategory: 'Bread',
        strArea: 'Bakery',
        badge: this.t('home.badgeBestSeller'),
        price: 40,
      },
      {
        idMeal: 'P002',
        strMeal: 'Berry Tart',
        strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg',
        strCategory: 'Tart',
        strArea: 'Bakery',
        badge: this.t('home.badgePremium'),
        price: 42,
      },
      {
        idMeal: 'P003',
        strMeal: 'Chocolate Croissant',
        strMealThumb: 'https://www.themealdb.com/images/media/meals/xrysxv1539552180.jpg',
        strCategory: 'Croissant',
        strArea: 'Bakery',
        badge: this.t('home.badgeTrending'),
        price: 38,
      },
      {
        idMeal: 'P004',
        strMeal: 'Vanilla Muffin',
        strMealThumb: 'https://www.themealdb.com/images/media/meals/1549542877.jpg',
        strCategory: 'Muffins',
        strArea: 'Bakery',
        badge: this.t('home.badgeNew'),
        price: 28,
      },
      {
        idMeal: 'P005',
        strMeal: 'Signature Cake',
        strMealThumb: 'https://www.themealdb.com/images/media/meals/txsupu1511815755.jpg',
        strCategory: 'Cake',
        strArea: 'Bakery',
        badge: this.t('home.badgeChefsPick'),
        price: 55,
      },
    ];
  }
  topProductsByCategory = computed(() => {
    const category = this.selectedProductCategory();
    if (category === 'Favorite') {
      return this.topProducts;
    }
    return this.topProducts.filter((item) => item.strCategory === category);
  });

  get heroStats() {
    return [
      { label: this.t('home.statPremiumOrders'), value: '250K+' },
      { label: this.t('home.statAverageRating'), value: '4.9/5' },
      { label: this.t('home.statTopChefs'), value: '45+' },
      { label: this.t('home.statFastDelivery'), value: '30-45 mins' },
    ];
  }

  get premiumBenefits() {
    return [
      this.t('home.benefit1'),
      this.t('home.benefit2'),
      this.t('home.benefit3'),
      this.t('home.benefit4')
    ];
  }

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  // Search History Methods
  loadSearchHistory(): void {
    const saved = localStorage.getItem('food-haven-search-history');
    if (saved) {
      this.searchHistory.set(JSON.parse(saved));
    }
  }

  saveSearchHistory(): void {
    localStorage.setItem('food-haven-search-history', JSON.stringify(this.searchHistory()));
  }

  addToSearchHistory(query: string): void {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return;

    // Remove duplicate if exists and add to front
    let history = this.searchHistory().filter((item) => item.toLowerCase() !== normalizedQuery);
    history.unshift(query.trim());

    // Keep only last 10 searches
    if (history.length > 10) {
      history = history.slice(0, 10);
    }

    this.searchHistory.set(history);
    this.saveSearchHistory();
  }

  useSearchHistory(query: string): void {
    this.searchQuery.set(query);
    this.executeSearch(query);
  }

  addToCart(meal: Meal): void {
    this.cartService.addToCart(meal);
    this.toastr.success(`${meal.strMeal} added to cart.`);
  }

  clearSearchHistory(): void {
    this.searchHistory.set([]);
    this.saveSearchHistory();
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      AOS.init({
        duration: 800,
        once: true,
      });
      this.loadSearchHistory();
      this.loadIngredients();
    }

    // Set up debounced search
    this.searchSubject
      .pipe(
        debounceTime(500), // Wait 500ms after last keystroke
        distinctUntilChanged(), // Only if query changed
        takeUntil(this.destroy$),
      )
      .subscribe((query) => {
        this.executeSearch(query);
      });

    this.loadFeaturedMeals();
    this.loadRandomMeals();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Debounced search handler
  onSearchInput(): void {
    const query = this.searchQuery();
    if (query.trim()) {
      this.searchLoading.set(true);
      this.searchSubject.next(query);
    } else {
      this.loadRandomMeals();
    }
  }

  executeSearch(query: string): void {
    this.loading.set(true);
    this.searchLoading.set(true);
    this.mealService.searchMealByName(query).subscribe({
      next: (res) => {
        const results = res['meals'] || [];
        this.originalMeals.set(results);
        this.meals.set(results);
        this.loading.set(false);
        this.searchLoading.set(false);
        this.addToSearchHistory(query);
        // Apply sorting if needed
        if (this.sortBy()) {
          this.sortMeals();
        }
        if (!results.length) {
          this.toastr.info('No meals found for your search', 'Info');
        }
      },
      error: () => {
        this.loading.set(false);
        this.searchLoading.set(false);
        this.toastr.error('Failed to search meals', 'Error');
      },
    });
  }

  loadIngredients(): void {
    this.mealService.getIngredients().subscribe({
      next: (res) => {
        this.ingredients.set(res.meals || []);
      },
      error: () => {
        this.toastr.warning('Could not load ingredient filters.', 'Warning');
      },
    });
  }

  loadFeaturedMeals(): void {
    this.mealService.getRandomMeals(6).subscribe({
      next: (meals) => {
        this.featuredMeals.set(meals);
      },
    });
  }

  loadRandomMeals(): void {
    this.loading.set(true);
    this.mealService.getRandomMeals(8).subscribe({
      next: (meals) => {
        this.originalMeals.set(meals);
        this.meals.set(meals);
        this.loading.set(false);
        // Apply sorting if needed
        if (this.sortBy()) {
          this.sortMeals();
        }
      },
      error: () => {
        this.loading.set(false);
        this.toastr.error('Failed to load meals', 'Error');
      },
    });
  }

  sortMeals(): void {
    const sort = this.sortBy();
    let sorted = [...this.originalMeals()];

    if (sort === 'name-asc') {
      sorted.sort((a, b) => a.strMeal.localeCompare(b.strMeal));
    } else if (sort === 'name-desc') {
      sorted.sort((a, b) => b.strMeal.localeCompare(a.strMeal));
    } else if (sort === 'rating-desc') {
      // Mock rating (since API doesn't have real ratings)
      sorted.sort(() => Math.random() - 0.5);
    }

    this.meals.set(sorted);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('');
    this.selectedArea.set('');
    this.selectedIngredient.set('');
    this.sortBy.set('');
    this.loadRandomMeals();
  }

  search(): void {
    const query = this.searchQuery();
    if (query.trim()) {
      this.executeSearch(query);
    }
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('');
    this.selectedArea.set('');
    this.loadRandomMeals();
  }

  filterByCategory(): void {
    const cat = this.selectedCategory();
    if (cat) {
      this.loading.set(true);
      this.mealService.filterByCategory(cat).subscribe({
        next: (res) => {
          const results = res['meals'] || [];
          this.originalMeals.set(results);
          this.meals.set(results);
          this.loading.set(false);
          // Apply sorting
          if (this.sortBy()) {
            this.sortMeals();
          }
        },
        error: () => {
          this.loading.set(false);
          this.toastr.error('Failed to filter by category', 'Error');
        },
      });
    } else {
      this.loadRandomMeals();
    }
  }

  filterByArea(): void {
    const area = this.selectedArea();
    if (area) {
      this.loading.set(true);
      this.mealService.filterByArea(area).subscribe({
        next: (res) => {
          const results = res['meals'] || [];
          this.originalMeals.set(results);
          this.meals.set(results);
          this.loading.set(false);
          // Apply sorting
          if (this.sortBy()) {
            this.sortMeals();
          }
        },
        error: () => {
          this.loading.set(false);
          this.toastr.error('Failed to filter by area', 'Error');
        },
      });
    } else {
      this.loadRandomMeals();
    }
  }

  filterByIngredient(): void {
    const ingredient = this.selectedIngredient();
    if (ingredient) {
      this.loading.set(true);
      this.mealService.filterByIngredient(ingredient).subscribe({
        next: (res) => {
          const results = res['meals'] || [];
          this.originalMeals.set(results);
          this.meals.set(results);
          this.loading.set(false);
          if (this.sortBy()) {
            this.sortMeals();
          }
        },
        error: () => {
          this.loading.set(false);
          this.toastr.error('Failed to filter by ingredient', 'Error');
        },
      });
    } else {
      this.loadRandomMeals();
    }
  }
}
