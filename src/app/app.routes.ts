import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MealDetailsComponent } from './pages/meal-details/meal-details.component';
import { CartComponent } from './pages/cart/cart.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { AuthGuard } from './core/guards/auth.guard';
import { GuestGuard } from './core/guards/guest.guard';
import { FeatureFlagService } from './core/services/feature-flag.service';
import { EnterpriseDashboardResolver } from './core/resolvers/enterprise-dashboard.resolver';
import { MealResolver } from './core/resolvers/meal.resolver';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: 'Food Haven | Premium Meals Delivered',
      description: 'Discover premium meals, loyalty rewards, and smart recommendations with Food Haven.',
      keywords: 'food, premium, delivery, loyalty, recommendations',
    },
  },
  {
    path: 'meal/:id',
    component: MealDetailsComponent,
    resolve: { meal: MealResolver },
    data: {
      title: 'Meal Details | Food Haven',
      description: 'Explore premium meal details, ingredients, and chef-picked recommendations.',
      keywords: 'meal details, recipe, premium food, ingredients',
    },
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Your Cart | Food Haven',
      description: 'Review your premium order, apply loyalty discounts, and checkout quickly.',
      keywords: 'cart, checkout, premium order, discounts',
    },
  },
  {
    path: 'favorites',
    component: FavoritesComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Favorites | Food Haven',
      description: 'Save your favorite gourmet meals for faster reordering and special offers.',
      keywords: 'favorites, saved meals, premium, reorder',
    },
  },
  {
    path: 'enterprise',
    loadComponent: () => {
      const featureFlagService = inject(FeatureFlagService);
      return featureFlagService.isEnabled('enterpriseDashboard')
        ? import('./pages/enterprise-dashboard/enterprise-dashboard.component').then((m) => m.EnterpriseDashboardComponent)
        : import('./pages/enterprise-dashboard/enterprise-dashboard-disabled.component').then((m) => m.EnterpriseDashboardDisabledComponent);
    },
    canActivate: [AuthGuard],
    resolve: {
      dashboardData: EnterpriseDashboardResolver,
    },
    data: {
      title: 'Enterprise Control Center',
      staticMeta: {
        section: 'enterprise',
        release: 'v2',
      },
    },
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Profile | Food Haven',
      description: 'Manage your premium membership, track loyalty points, and personalize your profile.',
      keywords: 'profile, loyalty, premium membership, account',
    },
  },
  {
    path: 'order-history',
    component: OrderHistoryComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Order History | Food Haven',
      description: 'Review past orders and reorder your favorite premium meals with ease.',
      keywords: 'order history, reorder, premium meals, past orders',
    },
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard],
    data: {
      title: 'Login | Food Haven',
      description: 'Sign in to your Food Haven account to unlock premium offers and loyalty rewards.',
      keywords: 'login, sign in, premium account, loyalty',
    },
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [GuestGuard],
    data: {
      title: 'Register | Food Haven',
      description: 'Create your Food Haven account and start earning loyalty points today.',
      keywords: 'register, sign up, premium account, loyalty',
    },
  },
  { path: '**', redirectTo: '' },
];
