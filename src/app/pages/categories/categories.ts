import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, Category } from '../../services/api';
import { Toaster } from '../../services/toaster';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CategoryDialogComponent, CategoryDialogData } from '../../components/category-dialog/category-dialog';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
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
export class CategoriesComponent {
  route = inject(ActivatedRoute);
  api = inject(ApiService);
  toaster = inject(Toaster);
  dialog = inject(MatDialog);

  categories: Category[] = [];
  displayedColumns: string[] = ['name', 'actions'];

  constructor() {
    const data = this.route.snapshot.data['categories'] as Category[];
    if (data) {
      this.categories = data;
    }
  }

  addCategory() {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '500px',
      data: {} as CategoryDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.createCategory(result).subscribe({
          next: () => {
            this.toaster.success('Category created successfully');
            this.reloadCategories();
          },
          error: (error) => {
            this.toaster.error('Failed to create category');
          }
        });
      }
    });
  }

  editCategory(category: Category) {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '500px',
      data: { category } as CategoryDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.updateCategory(category.id, result).subscribe({
          next: () => {
            this.toaster.success('Category updated successfully');
            this.reloadCategories();
          },
          error: (error) => {
            this.toaster.error('Failed to update category');
          }
        });
      }
    });
  }

  deleteCategory(id: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.api.deleteCategory(id).subscribe({
        next: () => {
          this.toaster.success('Category deleted successfully');
          this.reloadCategories();
        },
        error: (error: any) => {
          if (error.error && error.error.message) {
            this.toaster.error(error.error.message);
          } else {
            this.toaster.error('Failed to delete category');
          }
        }
      });
    }
  }

  private reloadCategories() {
    this.api.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Failed to reload categories:', error);
        this.toaster.error('Failed to reload categories');
      }
    });
  }
}
