import { Injectable, signal, computed } from '@angular/core';

export interface Promotion {
  code: string;
  label: string;
  discount: number;
  minTotal: number;
  description: string;
  expires: string;
}

@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  private promotions = signal<Promotion[]>([
    {
      code: 'FOODHAVEN20',
      label: 'Summer Launch',
      discount: 20,
      minTotal: 50,
      description: '20% off orders over $50',
      expires: 'Ends in 2 days',
    },
    {
      code: 'VIP10',
      label: 'Premium Member',
      discount: 10,
      minTotal: 25,
      description: '10% off for logged-in members',
      expires: "Today's deal",
    },
    {
      code: 'QUICK5',
      label: 'Instant Checkout',
      discount: 5,
      minTotal: 0,
      description: '5% off for express checkout',
      expires: 'Expires tonight',
    },
  ]);

  availablePromotions = computed(() => this.promotions());

  validatePromo(code: string, total: number) {
    const normalized = code.trim().toUpperCase();
    const promo = this.promotions().find((item) => item.code === normalized);
    if (!promo) {
      return null;
    }
    if (total < promo.minTotal) {
      return null;
    }
    return promo;
  }

  getBestOffer(total: number) {
    const candidates = this.promotions().filter((promo) => total >= promo.minTotal);
    return candidates.sort((a, b) => b.discount - a.discount)[0] || null;
  }
}
