import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-enterprise-dashboard-disabled',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="enterprise-disabled py-5">
      <div class="container text-center">
        <div class="glass-card p-5 mx-auto" style="max-width: 680px;">
          <h2 class="mb-3">Enterprise Access Disabled</h2>
          <p class="text-muted mb-4">
            The enterprise control center is currently not available. Please enable the
            enterprise dashboard flag or contact your system administrator.
          </p>
          <a routerLink="/" class="btn btn-primary btn-lg">Back to Home</a>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .enterprise-disabled { color: white; }
      .glass-card {
        border: 1px solid rgba(255, 255, 255, 0.14);
        background: rgba(255, 255, 255, 0.06);
        backdrop-filter: blur(18px);
      }
    `,
  ],
})
export class EnterpriseDashboardDisabledComponent {}
