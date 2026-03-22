import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService, Order } from '../../services/api';
import { Toaster } from '../../services/toaster';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <div class="page-header">
      <div class="header-content">
        <h1><mat-icon>local_shipping</mat-icon> Orders</h1>
        <p>View and manage customer orders</p>
      </div>
    </div>

    <div class="table-container">
      <table mat-table [dataSource]="orders" class="mat-elevation-z8">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>Order#</th>
          <td mat-cell *matCellDef="let o">{{ o.id.slice(-8) }}</td>
        </ng-container>

        <ng-container matColumnDef="user">
          <th mat-header-cell *matHeaderCellDef>User</th>
          <td mat-cell *matCellDef="let o">{{ getUserName(o.user) }}</td>
        </ng-container>

        <ng-container matColumnDef="total">
          <th mat-header-cell *matHeaderCellDef>Total</th>
          <td mat-cell *matCellDef="let o">{{ o.totalPrice | currency }}</td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let o">
            <span class="status-chip">{{ o.status }}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef>Date</th>
          <td mat-cell *matCellDef="let o">{{ o.dateOrdered | date:'short' }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let o">
            <button mat-icon-button color="primary" (click)="viewOrder(o.id)" matTooltip="View details">
              <mat-icon>visibility</mat-icon>
            </button>
            <button mat-button (click)="changeStatus(o.id, 'Ready to Ship')">Ready</button>
            <button mat-button (click)="changeStatus(o.id, 'Shipped')">Shipped</button>
            <button mat-button (click)="changeStatus(o.id, 'Delivered')">Delivered</button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
    .header-content h1 { display:flex; align-items:center; gap:8px; }
    .table-container { overflow-x:auto; }
    table { width:100%; min-width:720px; }
    .status-chip { padding:6px 12px; border-radius:12px; background:#eef; }
  `]
})
export class OrdersComponent {
  route = inject(ActivatedRoute);
  api = inject(ApiService);
  toaster = inject(Toaster);

  orders: Order[] = [];
  displayedColumns = ['id', 'user', 'total', 'status', 'date', 'actions'];

  constructor() {
    const data = this.route.snapshot.data['orders'] as Order[];
    if (data) {
      this.orders = data;
    }
  }

  viewOrder(id: string) {
    this.api.getOrder(id).subscribe({
      next: (order) => {
        alert(JSON.stringify(order, null, 2));
      },
      error: () => this.toaster.error('Failed to load order details')
    });
  }

  changeStatus(id: string, status: string) {
    if (!confirm(`Change order status to "${status}"?`)) return;
    this.api.updateOrderStatus(id, status).subscribe({
      next: () => {
        this.toaster.success('Order status updated');
        this.reloadOrders();
      },
      error: () => this.toaster.error('Failed to update status')
    });
  }

  private reloadOrders() {
    this.api.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
      },
      error: (err) => {
        console.error('Failed to reload orders:', err);
        this.toaster.error('Failed to reload orders');
      }
    });
  }

  getUserName(user: any): string {
    return (user as any)?.name || user;
  }
}