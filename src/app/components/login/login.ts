import { Component, inject } from '@angular/core';
import { MatIconButton, MatAnchor, MatButton } from '@angular/material/button';
import { MatIcon } from "@angular/material/icon";
import { MatDialog, MatDialogClose, MatDialogRef } from "@angular/material/dialog"
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatPrefix } from "@angular/material/form-field"
import { MatInput } from "@angular/material/input"
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';
import { Toaster } from '../../services/toaster';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [MatIcon, MatFormField, MatInput, MatButton, ReactiveFormsModule, CommonModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Admin Login</h2>
        <form [formGroup]="loginForm" (ngSubmit)="login()">
          <mat-form-field class="full-width">
            <input matInput formControlName="email" type="email" placeholder="Enter your email" />
            <mat-icon matPrefix>email</mat-icon>
          </mat-form-field>
          <mat-form-field class="full-width">
            <input matInput formControlName="password" type="password" placeholder="Enter your password" />
            <mat-icon matPrefix>lock</mat-icon>
          </mat-form-field>
          <button type="submit" matButton="filled" class="full-width login-btn" [disabled]="loginForm.invalid">
            Login
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: #f5f5f5;
    }
    .login-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    h2 {
      text-align: center;
      margin-bottom: 1.5rem;
      color: #333;
    }
    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }
    .login-btn {
      margin-top: 1rem;
    }
  `]
})
export class LoginComponent {
  fb = inject(NonNullableFormBuilder);
  api = inject(ApiService);
  auth = inject(AuthService);
  toaster = inject(Toaster);
  router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  login() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    this.api.login(email!, password!).subscribe({
      next: (response) => {
        if (!response.isAdmin) {
          this.toaster.error('Access denied. Admin privileges required.');
          return;
        }

        this.auth.login({ email: email!, token: response.token, isAdmin: response.isAdmin });
        this.toaster.success('Logged in successfully');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.toaster.error('Login failed: ' + (error.error?.message || 'Invalid credentials'));
      }
    });
  }
}
