import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, User } from '../../services/api';
import { Toaster } from '../../services/toaster';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { UserDialogComponent, UserDialogData } from '../../components/user-dialog/user-dialog';

@Component({
  selector: 'app-users',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
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
export class UsersComponent {
  route = inject(ActivatedRoute);
  api = inject(ApiService);
  toaster = inject(Toaster);
  dialog = inject(MatDialog);

  users: User[] = [];
  displayedColumns: string[] = ['name', 'email', 'phone', 'isAdmin', 'actions'];

  constructor() {
    const data = this.route.snapshot.data['users'] as User[];
    if (data) {
      this.users = data;
    }
  }

  addUser() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: {} as UserDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.createUser(result).subscribe({
          next: () => {
            this.toaster.success('User created successfully');
            this.reloadUsers();
          },
          error: (error: any) => {
            this.toaster.error('Failed to create user');
          }
        });
      }
    });
  }

  editUser(user: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: { user } as UserDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.updateUser(user.id, result).subscribe({
          next: () => {
            this.toaster.success('User updated successfully');
            this.reloadUsers();
          },
          error: (error: any) => {
            this.toaster.error('Failed to update user');
          }
        });
      }
    });
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.api.deleteUser(id).subscribe({
        next: () => {
          this.toaster.success('User deleted successfully');
          this.reloadUsers();
        },
        error: (error: any) => {
          this.toaster.error('Failed to delete user');
        }
      });
    }
  }

  private reloadUsers() {
    this.api.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error: any) => {
        console.error('Failed to reload users:', error);
        this.toaster.error('Failed to reload users');
      }
    });
  }
}
