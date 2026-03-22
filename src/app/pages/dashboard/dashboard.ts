import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, Product, Category, User } from '../../services/api';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DashboardData } from './dashboard.resolver';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="dashboard-header">
      <h1><mat-icon>dashboard</mat-icon> Dashboard Overview</h1>
      <p class="subtitle">Monitor your e-commerce platform performance</p>
    </div>

    <div class="stats-grid">
      <mat-card class="stat-card products-card">
        <mat-card-content>
          <div class="stat-icon">
            <mat-icon>inventory_2</mat-icon>
          </div>
          <div class="stat-info">
            <h2>{{ products.length }}</h2>
            <p>Total Products</p>
            <small>{{ inStockProducts }} in stock</small>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="stat-card categories-card">
        <mat-card-content>
          <div class="stat-icon">
            <mat-icon>category</mat-icon>
          </div>
          <div class="stat-info">
            <h2>{{ categories.length }}</h2>
            <p>Categories</p>
            <small>Product categories</small>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="stat-card users-card">
        <mat-card-content>
          <div class="stat-icon">
            <mat-icon>people</mat-icon>
          </div>
          <div class="stat-info">
            <h2>{{ users.length }}</h2>
            <p>Registered Users</p>
            <small>{{ adminUsers }} admins</small>
          </div>
        </mat-card-content>
      </mat-card>


    </div>


    <div class="recent-activity">
      <h2><mat-icon>timeline</mat-icon> Recent Activity</h2>
      <mat-card>
        <mat-card-content>
          <div class="activity-item">
            <mat-icon>login</mat-icon>
            <span>Admin logged in</span>
            <small>{{ currentTime }}</small>
          </div>
          <div class="activity-item">
            <mat-icon>inventory</mat-icon>
            <span>Products data loaded</span>
            <small>{{ currentTime }}</small>
          </div>
          <div class="activity-item">
            <mat-icon>people</mat-icon>
            <span>Users data synchronized</span>
            <small>{{ currentTime }}</small>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
styles: [`
.dashboard-header {
  margin-bottom: 24px;
}

.dashboard-header h1 {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 28px;
  margin-bottom: 4px;
}

.subtitle {
  color: #666;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.stat-card {
  padding: 16px;
}

.stat-card mat-card-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #e3f2fd;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon mat-icon {
  color: #1976d2;
}

.stat-info h2 {
  margin: 0;
  font-size: 26px;
}

.stat-info p {
  margin: 2px 0;
  font-weight: 500;
}

.stat-info small {
  color: #777;
}

.recent-activity {
  margin-top: 40px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
}

.activity-item small {
  margin-left: auto;
  color: #888;
}
`]

})
export class DashboardComponent {
  route = inject(ActivatedRoute);
  products: Product[] = [];
  categories: Category[] = [];
  users: User[] = [];
  currentTime = new Date().toLocaleTimeString();
  isLoading = false;

  constructor() {
    const data = this.route.snapshot.data['dashboard'] as DashboardData;
    if (data) {
      this.products = data.products;
      this.categories = data.categories;
      this.users = data.users;
    }
  }

  get totalRevenue(): number {
    return this.products.reduce((sum, product) => sum + product.price, 0);
  }

  get inStockProducts(): number {
    return this.products.filter(p => p.countInStock > 0).length;
  }

  get adminUsers(): number {
    return this.users.filter(u => u.isAdmin).length;
  }
}
