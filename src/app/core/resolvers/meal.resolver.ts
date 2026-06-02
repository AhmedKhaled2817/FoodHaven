import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { catchError, map, of, Observable } from 'rxjs';
import { MealService } from '../services/meal.service';
import { Meal } from '../models/meal.model';

@Injectable({
  providedIn: 'root',
})
export class MealResolver implements Resolve<Meal | null> {
  constructor(private mealService: MealService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Meal | null> {
    const id = route.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/']);
      return of(null);
    }

    return this.mealService.getMealById(id).pipe(
      map((response) => response.meals?.[0] ?? null),
      catchError(() => {
        this.router.navigate(['/']);
        return of(null);
      }),
    );
  }
}
