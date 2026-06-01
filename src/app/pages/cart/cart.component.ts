import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/meal.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  cartService = inject(CartService);
  cartItems = this.cartService.getCartItems();
  couponCode = signal('');
  discount = signal(0);

  updateQuantity(item: CartItem, change: number): void {
    this.cartService.updateQuantity(item.meal.idMeal, change);
  }

  removeItem(mealId: string): void {
    this.cartService.removeFromCart(mealId);
  }

  applyCoupon(): void {
    if (this.couponCode().toLowerCase() === 'foodhaven') {
      this.discount.set(10);
    } else {
      this.discount.set(0);
    }
  }

  getDiscountedTotal(): number {
    const total = this.cartService.totalPrice();
    return total - (total * this.discount()) / 100;
  }
}
