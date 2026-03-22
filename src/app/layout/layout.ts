import { Component, inject, HostListener } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTooltipModule,
    MatMenuModule
  ],
  template: `
    <div class="admin-panel">
      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav [mode]="isHandset ? 'over' : 'side'" [opened]="!isHandset || isSidenavOpen" class="sidenav" (closedStart)="isSidenavOpen = false">
          <div class="logo-section" style="padding: 20px; text-align: center; border-bottom: 1px solid #e0e0e0; margin-bottom: 20px;">
            <h3 style="color: #1976d2; margin: 0; font-weight: 600;">Admin Panel</h3>
            <p style="color: #666; margin: 4px 0 0 0; font-size: 0.8rem;">Management System</p>
          </div>
          <mat-nav-list>
            <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
              <mat-icon matListIcon>dashboard</mat-icon>
              <span matLine> Dashboard</span>
            </a>
            <a mat-list-item routerLink="/products" routerLinkActive="active">
              <mat-icon matListIcon>inventory_2</mat-icon>
              <span matLine> Products</span>
            </a>
            <a mat-list-item routerLink="/categories" routerLinkActive="active">
              <mat-icon matListIcon>category</mat-icon>
              <span matLine> Categories</span>
            </a>
            <a mat-list-item routerLink="/users" routerLinkActive="active">
              <mat-icon matListIcon>people</mat-icon>
              <span matLine> Users</span>
            </a>
            <a mat-list-item routerLink="/orders" routerLinkActive="active">
              <mat-icon matListIcon>local_shipping</mat-icon>
              <span matLine> Orders</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>
        <mat-sidenav-content>
          <mat-toolbar class="mat-elevation-z4">
            <button mat-icon-button (click)="toggleSidenav()" *ngIf="isHandset">
              <mat-icon>menu</mat-icon>
            </button>
            <span style="font-weight: 500;">Welcome to Admin Panel</span>
            <span class="spacer"></span>
            <button mat-button [matMenuTriggerFor]="profileMenu">
              <mat-icon>account_circle</mat-icon>
              <span style="margin-left:8px">Profile</span>
            </button>
            <mat-menu #profileMenu="matMenu">
              <button mat-menu-item (click)="logout()">Sign Out</button>
            </mat-menu>
          </mat-toolbar>
          <div class="content">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }
    .sidenav {
      width: 250px;
      background: #f5f5f5;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .content {
      padding: 20px;
    }
    .active {
      background: rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 768px) {
      .sidenav-container {
        height: 100vh;
      }
      .sidenav {
        width: 100%;
      }
      .content {
        padding: 12px;
      }
      mat-toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .mat-toolbar-row,
      .mat-toolbar-single-row {
        width: 100%;
      }
    }
  `]
})
export class LayoutComponent {
  auth = inject(AuthService);
  router = inject(Router);

  isHandset = window.innerWidth <= 768;
  isSidenavOpen = !this.isHandset;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const width = (event.target as Window).innerWidth;
    this.isHandset = width <= 768;
    if (!this.isHandset) {
      this.isSidenavOpen = true;
    }
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
