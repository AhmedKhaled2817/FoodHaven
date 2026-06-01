import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  auth = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);
  toastr = inject(ToastrService);

  loginForm: FormGroup;
  loginError = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    this.loginError = '';
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const ok = this.auth.login(this.loginForm.value.email, this.loginForm.value.password);

    if (!ok) {
      this.toastr.error('Invalid email or password', 'Login Failed');
      return;
    }

    this.toastr.success('Welcome back!', 'Login Successful');
    this.router.navigate(['/']);
  }

  get f() {
    return this.loginForm.controls;
  }
}
