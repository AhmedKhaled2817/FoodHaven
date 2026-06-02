import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CartItem, Meal } from '../../core/models/meal.model';
import { AuthService } from '../../core/services/auth-service';
import { PromotionService } from '../../core/services/promotion.service';
import { HoverGlowDirective } from '../../shared/directives/hover-glow.directive';
import { LocalizationService } from '../../core/services/localization.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HoverGlowDirective],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  cartService = inject(CartService);
  authService = inject(AuthService);
  promotionService = inject(PromotionService);
  localization = inject(LocalizationService);

  t = (key: string, values?: Record<string, string | number>) => this.localization.t(key, values);

  cartItems = this.cartService.getCartItems();
  couponCode = signal('');
  discount = signal(0);
  promoFeedback = signal('');
  orderSuccess = signal('');

  memberTier = this.authService.memberTier;
  currentPoints = this.authService.currentPoints;
  availableOffers = this.promotionService.availablePromotions;

  get premiumHighlights() {
    return [
      { label: this.t('cart.highlightExtraPoints'), value: this.t('cart.highlight5xRewards') },
      {
        label: this.t('cart.highlightFreeDelivery'),
        value: this.t('cart.highlightOnOrders35Plus'),
      },
      {
        label: this.t('cart.highlightFasterDispatch'),
        value: this.t('cart.highlightPriorityHandling'),
      },
    ];
  }

  suggestedBundles = computed(() => {
    const categories = Array.from(
      new Set(this.cartItems().map((item) => item.meal.strCategory || '')),
    ).filter(Boolean);

    if (categories.includes('Seafood')) {
      return ['Garlic Bread', 'Lemonade', 'Citrus Salad'];
    }
    if (categories.includes('Dessert')) {
      return ['Extra Whipped Cream', 'Special Sauce', 'Fruit Bowl'];
    }
    if (categories.includes('Pork') || categories.includes('Chicken')) {
      return ['Crinkle Fries', 'Spicy Wings', 'Iced Tea'];
    }
    return ['Chef’s Special Bread', 'Seasonal Salad', 'Sparkling Water'];
  });
  pointsEarned = computed(() => Math.max(10, Math.floor(this.cartService.totalPrice() / 10)));
  finalTotal = computed(() => {
    let total = this.cartService.totalPrice();
    total -= (total * this.discount()) / 100;
    if (this.memberTier() === 'Gold') {
      total *= 0.98;
    }
    if (this.memberTier() === 'Platinum') {
      total *= 0.95;
    }
    return Math.max(0, total);
  });

  updateQuantity(item: CartItem, change: number): void {
    this.cartService.updateQuantity(item.meal.idMeal, change);
  }

  removeItem(mealId: string): void {
    this.cartService.removeFromCart(mealId);
  }

  updateInstructions(item: CartItem, value: string): void {
    this.cartService.setItemInstructions(item.meal.idMeal, value);
  }

  applyCoupon(): void {
    this.orderSuccess.set('');
    const code = this.couponCode().trim().toUpperCase();
    const promo = this.promotionService.validatePromo(code, this.cartService.totalPrice());
    if (!promo) {
      this.discount.set(0);
      this.promoFeedback.set(this.t('cart.invalidPromo'));
      return;
    }
    this.discount.set(promo.discount);
    this.promoFeedback.set(
      this.t('cart.appliedPromoLabel', { label: promo.label, description: promo.description }),
    );
  }

  addSuggestedBundle(itemName: string): void {
    const meal: Meal = {
      idMeal: `suggest-${itemName}`,
      strMeal: itemName,
      strMealThumb: 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg',
      strCategory: 'Bundle',
      strArea: 'Global',
    };
    this.cartService.addToCart(meal);
    this.promoFeedback.set(this.t('cart.bundleAdded', { itemName }));
  }

  checkout(): void {
    if (this.cartService.totalPrice() === 0) {
      this.orderSuccess.set(this.t('cart.addItemsCheckout'));
      return;
    }

    const earned = this.pointsEarned();
    this.authService.addLoyaltyPoints(earned);
    this.cartService.clearCart();
    this.orderSuccess.set(
      this.t('cart.orderSuccess', {
        points: earned,
        tier: this.memberTier(),
      }),
    );
  }
}
