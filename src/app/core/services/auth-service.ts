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

  isLoggedIn = computed(() => !!this.currentUser());

  constructor(private router: Router) {
    if (isPlatformBrowser(this.platformId)) {
      this.users.set(this.loadUsers());
      this.currentUser.set(this.loadCurrentUser());
    }
  }

  // ===== REGISTER =====
  register(user: User): boolean {
    const exists = this.users().some((u) => u.email === user.email);
    if (exists) return false;

    this.users.update((users) => [...users, user]);
    this.saveUsers();

    this.login(user.email, user.password);
    return true;
  }

  // ===== LOGIN =====
  login(email: string, password: string): boolean {
    const user = this.users().find((u) => u.email === email && u.password === password);

    if (!user) return false;

    this.currentUser.set(user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    return true;
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
}
