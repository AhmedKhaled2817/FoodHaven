import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

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
}
