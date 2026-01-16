import { Component, inject, OnInit } from '@angular/core';
import { ApiService, Category } from '../../services/api';
import { Toaster } from '../../services/toaster';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  template: `
    <h1>Categories Management</h1>
    <button mat-raised-button color="primary" (click)="addCategory()">
      <mat-icon>add</mat-icon>
      Add Category
    </button>
    <table mat-table [dataSource]="categories" class="mat-elevation-z8">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let category">{{ category.name }}</td>
      </ng-container>
      <ng-container matColumnDef="icon">
        <th mat-header-cell *matHeaderCellDef>Icon</th>
        <td mat-cell *matCellDef="let category">{{ category.icon }}</td>
      </ng-container>
      <ng-container matColumnDef="color">
        <th mat-header-cell *matHeaderCellDef>Color</th>
        <td mat-cell *matCellDef="let category">{{ category.color }}</td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let category">
          <button mat-icon-button (click)="editCategory(category)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="deleteCategory(category.id)">
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
export class CategoriesComponent implements OnInit {
  api = inject(ApiService);
  toaster = inject(Toaster);

  categories: Category[] = [];
  displayedColumns: string[] = ['name', 'icon', 'color', 'actions'];

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.api.getCategories().subscribe(data => this.categories = data);
  }

  addCategory() {
    this.toaster.info('Add category dialog not implemented yet');
  }

  editCategory(category: Category) {
    this.toaster.info('Edit category dialog not implemented yet');
  }

  deleteCategory(id: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.api.deleteCategory(id).subscribe({
        next: () => {
          this.toaster.success('Category deleted successfully');
          this.loadCategories();
        },
        error: (error) => {
          this.toaster.error('Failed to delete category');
        }
      });
    }
  }
}
