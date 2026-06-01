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

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'meal/:id', component: MealDetailsComponent },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'favorites', component: FavoritesComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [GuestGuard] },
  { path: '**', redirectTo: '' },
];
