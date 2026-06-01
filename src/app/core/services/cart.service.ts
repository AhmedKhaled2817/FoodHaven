import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Meal, CartItem } from '../models/meal.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private platformId = inject(PLATFORM_ID);
  private cartItems = signal<CartItem[]>([]);
  public cartCount = computed(() => 
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );
  public totalPrice = computed(() => 
    this.cartItems().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );

  constructor() { 
    if (isPlatformBrowser(this.platformId)) {
      this.cartItems.set(this.loadCartFromStorage());
    }
  }

  private loadCartFromStorage(): CartItem[] {
    const saved = localStorage.getItem('foodHavenCart');
    return saved ? JSON.parse(saved) : [];
  }

  private saveCartToStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('foodHavenCart', JSON.stringify(this.cartItems()));
    }
  }

  getCartItems() {
    return this.cartItems;
  }

  addToCart(meal: Meal): void {
    this.cartItems.update(items => {
      const existing = items.find(i => i.meal.idMeal === meal.idMeal);
      if (existing) {
        return items.map(i => 
          i.meal.idMeal === meal.idMeal 
            ? { ...i, quantity: i.quantity + 1 } 
            : i
        );
      }
      return [...items, { meal, quantity: 1, price: Math.floor(Math.random() * 50) + 10 }];
    });
    this.saveCartToStorage();
  }

  removeFromCart(mealId: string): void {
    this.cartItems.update(items => items.filter(i => i.meal.idMeal !== mealId));
    this.saveCartToStorage();
  }

  updateQuantity(mealId: string, change: number): void {
    this.cartItems.update(items => {
      return items.map(i => {
        if (i.meal.idMeal === mealId) {
          const newQty = i.quantity + change;
          if (newQty <= 0) {
            return null; // Mark for removal
          }
          return { ...i, quantity: newQty };
        }
        return i;
      }).filter(Boolean) as CartItem[];
    });
    this.saveCartToStorage();
  }

  clearCart(): void {
    this.cartItems.set([]);
    this.saveCartToStorage();
  }
}
