import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

export interface User {
  name: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);

  private users = signal<User[]>([]);
  private currentUser = signal<User | null>(null);
  private loyaltyPoints = signal<Record<string, number>>({});

  isLoggedIn = computed(() => !!this.currentUser());
  currentPoints = computed(() => {
    const user = this.currentUser();
    return user ? this.loyaltyPoints()[user.email] ?? 0 : 0;
  });
  memberTier = computed(() => {
    const points = this.currentPoints();
    if (points >= 500) {
      return 'Platinum';
    }
    if (points >= 250) {
      return 'Gold';
    }
    if (points >= 100) {
      return 'Silver';
    }
    return 'Basic';
  });

  constructor(private router: Router) {
    if (isPlatformBrowser(this.platformId)) {
      this.users.set(this.loadUsers());
      this.loyaltyPoints.set(this.loadLoyaltyData());
      this.currentUser.set(this.loadCurrentUser());
    }
  }

  // ===== REGISTER =====
  register(user: User): boolean {
    const exists = this.users().some((u) => u.email === user.email);
    if (exists) return false;

    this.users.update((users) => [...users, user]);
    this.saveUsers();
    this.ensureLoyaltyAccount(user.email);

    this.login(user.email, user.password);
    return true;
  }

  // ===== LOGIN =====
  login(email: string, password: string): boolean {
    const user = this.users().find((u) => u.email === email && u.password === password);

    if (!user) return false;

    this.currentUser.set(user);
    this.ensureLoyaltyAccount(email);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    return true;
  }

  addLoyaltyPoints(amount: number): void {
    const user = this.currentUser();
    if (!user) return;

    this.loyaltyPoints.update((points) => {
      const current = points[user.email] ?? 0;
      return {
        ...points,
        [user.email]: current + amount,
      };
    });
    this.saveLoyaltyData();
  }

  getTierBenefits(tier: string): string[] {
    switch (tier) {
      case 'Platinum':
        return ['Priority checkout', 'Exclusive offers', 'Faster delivery', 'Complimentary dessert'];
      case 'Gold':
        return ['Early promotions', 'Loyalty bonuses', 'Free combo upgrade'];
      case 'Silver':
        return ['Member price alerts', 'Discount previews', 'Extra points'];
      default:
        return ['Earn points with every order', 'Unlock discounts and offers'];
    }
  }

  logout() {
    this.currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.router.navigate(['/login']);
  }

  getUser() {
    return this.currentUser;
  }

  // ===== STORAGE =====
  private loadUsers(): User[] {
    if (isPlatformBrowser(this.platformId)) {
      return JSON.parse(localStorage.getItem('users') || '[]');
    }
    return [];
  }

  private loadCurrentUser(): User | null {
    if (isPlatformBrowser(this.platformId)) {
      return JSON.parse(localStorage.getItem('currentUser') || 'null');
    }
    return null;
  }

  private saveUsers() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('users', JSON.stringify(this.users()));
    }
  }

  private loadLoyaltyData(): Record<string, number> {
    if (isPlatformBrowser(this.platformId)) {
      return JSON.parse(localStorage.getItem('loyaltyPoints') || '{}');
    }
    return {};
  }

  private saveLoyaltyData(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('loyaltyPoints', JSON.stringify(this.loyaltyPoints()));
    }
  }

  private ensureLoyaltyAccount(email: string): void {
    this.loyaltyPoints.update((points) => {
      if (points[email] == null) {
        return {
          ...points,
          [email]: 10,
        };
      }
      return points;
    });
    this.saveLoyaltyData();
  }
}
