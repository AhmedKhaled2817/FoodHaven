import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LocalizationService } from '../../../core/services/localization.service';

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  badge: string;
}

@Component({
  selector: 'app-featured-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './featured-section.component.html',
  styleUrl: './featured-section.component.scss',
})
export class FeaturedSectionComponent {
  localization = inject(LocalizationService);

  t = (key: string, values?: Record<string, string | number>) =>
    this.localization.t(key, values);

  get features(): FeatureItem[] {
    return [
      {
        icon: '🚀',
        title: this.t('featured.fastDelivery'),
        description: this.t('featured.fastDeliveryDesc'),
        badge: this.t('featured.badgeTrending'),
      },
      {
        icon: '🥗',
        title: this.t('featured.freshIngredients'),
        description: this.t('featured.freshIngredientsDesc'),
        badge: this.t('featured.badgeNew'),
      },
      {
        icon: '💳',
        title: this.t('featured.secureCheckout'),
        description: this.t('featured.secureCheckoutDesc'),
        badge: this.t('featured.badgeSafe'),
      },
      {
        icon: '⭐',
        title: this.t('featured.chefsPicks'),
        description: this.t('featured.chefsPicksDesc'),
        badge: this.t('featured.badgePremium'),
      },
    ];
  }
}
