import { Component, inject, OnInit } from '@angular/core';
import { ApiService, User } from '../../services/api';
import { Toaster } from '../../services/toaster';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-users',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  template: `
    <h1>Users Management</h1>
    <button mat-raised-button color="primary" (click)="addUser()">
      <mat-icon>add</mat-icon>
      Add User
    </button>
    <table mat-table [dataSource]="users" class="mat-elevation-z8">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let user">{{ user.name }}</td>
      </ng-container>
      <ng-container matColumnDef="email">
        <th mat-header-cell *matHeaderCellDef>Email</th>
        <td mat-cell *matCellDef="let user">{{ user.email }}</td>
      </ng-container>
      <ng-container matColumnDef="phone">
        <th mat-header-cell *matHeaderCellDef>Phone</th>
        <td mat-cell *matCellDef="let user">{{ user.phone }}</td>
      </ng-container>
      <ng-container matColumnDef="isAdmin">
        <th mat-header-cell *matHeaderCellDef>Admin</th>
        <td mat-cell *matCellDef="let user">{{ user.isAdmin ? 'Yes' : 'No' }}</td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let user">
          <button mat-icon-button (click)="editUser(user)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="deleteUser(user.id)">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  `,
  styles: [`
    table {
      width: 100%;
      margin-top: 20px;
    }
    h1 {
      margin-bottom: 20px;
    }
  `]
})
export class UsersComponent implements OnInit {
  api = inject(ApiService);
  toaster = inject(Toaster);

  users: User[] = [];
  displayedColumns: string[] = ['name', 'email', 'phone', 'isAdmin', 'actions'];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.api.getUsers().subscribe(data => this.users = data);
  }

  addUser() {
    this.toaster.info('Add user dialog not implemented yet');
  }

  editUser(user: User) {
    this.toaster.info('Edit user dialog not implemented yet');
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.api.deleteUser(id).subscribe({
        next: () => {
          this.toaster.success('User deleted successfully');
          this.loadUsers();
        },
        error: (error) => {
          this.toaster.error('Failed to delete user');
        }
      });
    }
  }
}
