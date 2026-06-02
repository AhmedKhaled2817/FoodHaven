import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Meal } from '../../core/models/meal.model';
import { LocalizationService } from '../../core/services/localization.service';

// Fix IDE caching errors

interface OrderItem {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  date: Date;
  status: 'delivered' | 'shipped' | 'pending';
  total: number;
  items: OrderItem[];
}

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss',
})
export class OrderHistoryComponent {
  router = inject(Router);
  cartService = inject(CartService);
  toastr = inject(ToastrService);
  localization = inject(LocalizationService);

  t = (key: string, values?: Record<string, string | number>) =>
    this.localization.t(key, values);

  orders: Order[] = [
    {
      id: 'ORD-001',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'delivered',
      total: 34.97,
      items: [
        {
          name: 'Spicy Arrabiata Penne',
          image: 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg',
          price: 12.99,
          quantity: 2,
        },
        {
          name: 'Vegetable Pizza',
          image: 'https://www.themealdb.com/images/media/meals/wyxwsp1486979827.jpg',
          price: 8.99,
          quantity: 1,
        },
      ],
    },
    {
      id: 'ORD-002',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: 'shipped',
      total: 22.98,
      items: [
        {
          name: 'Chicken Alfredo',
          image: 'https://www.themealdb.com/images/media/meals/xvsurr1511719182.jpg',
          price: 11.49,
          quantity: 2,
        },
      ],
    },
  ];

  totalSpent = computed(() => this.orders.reduce((sum, order) => sum + order.total, 0));
  totalOrders = computed(() => this.orders.length);
  favoriteItem = computed(() => {
    const counts = this.orders.flatMap((order) => order.items).reduce<Record<string, number>>((acc, item) => {
      acc[item.name] = (acc[item.name] ?? 0) + item.quantity;
      return acc;
    }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'No orders yet';
  });

  reorder(order: Order): void {
    order.items.forEach((item) => {
      const meal: Meal = {
        idMeal: item.name,
        strMeal: item.name,
        strMealThumb: item.image,
        strCategory: 'Reorder',
        strArea: 'Historical',
      };

      for (let i = 0; i < item.quantity; i += 1) {
        this.cartService.addToCart(meal);
      }
    });

    this.toastr.success(this.t('orderHistory.reorderSuccess'));
    this.router.navigate(['/cart']);
  }
}
