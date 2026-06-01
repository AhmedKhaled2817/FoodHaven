import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, tap, map, of } from 'rxjs';
import {
  MealResponse,
  CategoryResponse,
  AreaResponse,
  IngredientResponse,
  Meal,
} from '../models/meal.model';
import { environment } from '../../../environments/environment';
import { CacheService } from './cache.service';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  private baseUrl = environment.apiBaseUrl;
  public categories = signal<CategoryResponse['categories']>([]);
  public areas = signal<AreaResponse['meals']>([]);
  public ingredients = signal<IngredientResponse['meals']>([]);

  constructor(
    private http: HttpClient,
    private cacheService: CacheService,
    private loggingService: LoggingService,
  ) {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    forkJoin([this.getCategories(), this.getAreas()]).subscribe(([catRes, areaRes]) => {
      this.categories.set(catRes.categories);
      this.areas.set(areaRes.meals);
    });
  }

  searchMealByName(name: string): Observable<MealResponse> {
    const cacheKey = `search-${name}`;
    const cached = this.cacheService.get(cacheKey);
    if (cached) {
      this.loggingService.log('Returning cached search result for:', name);
      return of(cached as MealResponse);
    }
    return this.http.get<MealResponse>(`${this.baseUrl}/search.php?s=${name}`).pipe(
      tap((res) => {
        this.cacheService.set(cacheKey, res);
      }),
    );
  }

  getMealById(id: string): Observable<MealResponse> {
    const cacheKey = `meal-${id}`;
    const cached = this.cacheService.get(cacheKey);
    if (cached) {
      this.loggingService.log('Returning cached meal for id:', id);
      return of(cached as MealResponse);
    }
    return this.http.get<MealResponse>(`${this.baseUrl}/lookup.php?i=${id}`).pipe(
      tap((res) => {
        this.cacheService.set(cacheKey, res);
      }),
    );
  }

  getRandomMeal(): Observable<MealResponse> {
    return this.http.get<MealResponse>(`${this.baseUrl}/random.php`);
  }

  getRandomMeals(count: number = 8): Observable<Meal[]> {
    const requests = Array.from({ length: count }, () => this.getRandomMeal());
    return forkJoin(requests).pipe(
      map((responses) => {
        return responses.filter((r) => r?.['meals']?.[0]).map((r) => r!['meals'][0]);
      }),
    );
  }

  getCategories(): Observable<CategoryResponse> {
    const cacheKey = 'categories';
    const cached = this.cacheService.get(cacheKey);
    if (cached) {
      this.loggingService.log('Returning cached categories');
      return of(cached as CategoryResponse);
    }
    return this.http.get<CategoryResponse>(`${this.baseUrl}/categories.php`).pipe(
      tap((res) => {
        this.cacheService.set(cacheKey, res);
      }),
    );
  }

  getAreas(): Observable<AreaResponse> {
    const cacheKey = 'areas';
    const cached = this.cacheService.get(cacheKey);
    if (cached) {
      this.loggingService.log('Returning cached areas');
      return of(cached as AreaResponse);
    }
    return this.http.get<AreaResponse>(`${this.baseUrl}/list.php?a=list`).pipe(
      tap((res) => {
        this.cacheService.set(cacheKey, res);
      }),
    );
  }

  getIngredients(): Observable<IngredientResponse> {
    const cacheKey = 'ingredients';
    const cached = this.cacheService.get(cacheKey);
    if (cached) {
      this.loggingService.log('Returning cached ingredients');
      return of(cached as IngredientResponse);
    }
    return this.http.get<IngredientResponse>(`${this.baseUrl}/list.php?i=list`).pipe(
      tap((res) => {
        this.cacheService.set(cacheKey, res);
      }),
    );
  }

  filterByCategory(category: string): Observable<MealResponse> {
    const cacheKey = `category-${category}`;
    const cached = this.cacheService.get(cacheKey);
    if (cached) {
      this.loggingService.log('Returning cached category filter for:', category);
      return of(cached as MealResponse);
    }
    return this.http.get<MealResponse>(`${this.baseUrl}/filter.php?c=${category}`).pipe(
      tap((res) => {
        this.cacheService.set(cacheKey, res);
      }),
    );
  }

  filterByArea(area: string): Observable<MealResponse> {
    const cacheKey = `area-${area}`;
    const cached = this.cacheService.get(cacheKey);
    if (cached) {
      this.loggingService.log('Returning cached area filter for:', area);
      return of(cached as MealResponse);
    }
    return this.http.get<MealResponse>(`${this.baseUrl}/filter.php?a=${area}`).pipe(
      tap((res) => {
        this.cacheService.set(cacheKey, res);
      }),
    );
  }

  filterByIngredient(ingredient: string): Observable<MealResponse> {
    const cacheKey = `ingredient-${ingredient}`;
    const cached = this.cacheService.get(cacheKey);
    if (cached) {
      this.loggingService.log('Returning cached ingredient filter for:', ingredient);
      return of(cached as MealResponse);
    }
    return this.http.get<MealResponse>(`${this.baseUrl}/filter.php?i=${ingredient}`).pipe(
      tap((res) => {
        this.cacheService.set(cacheKey, res);
      }),
    );
  }
}
