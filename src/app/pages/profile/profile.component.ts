import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  themeService = inject(ThemeService);
  authService = inject(AuthService);
  router = inject(Router);

  user = this.authService.getUser();

  logout(): void {
    this.authService.logout();
  }
}
