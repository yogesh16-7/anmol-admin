import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '../../services/api';

export interface CategoryDialogData {
  category?: Category;
}

@Component({
  selector: 'app-category-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.category ? 'Edit Category' : 'Add Category' }}</h2>

    <mat-dialog-content>
      <form [formGroup]="categoryForm" class="category-form">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" placeholder="Category name">
          <mat-error *ngIf="categoryForm.get('name')?.invalid && categoryForm.get('name')?.touched">
            Name is required
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="categoryForm.invalid">
        {{ data.category ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .category-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 400px;
      padding-top: 16px;
    }

    mat-form-field {
      width: 100%;
    }
  `]
})
export class CategoryDialogComponent {
  fb = inject(NonNullableFormBuilder);
  dialogRef = inject(MatDialogRef<CategoryDialogComponent>);

  categoryForm = this.fb.group({
    name: ['', Validators.required]
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: CategoryDialogData) {
    if (data.category) {
      this.categoryForm.patchValue(data.category);
    }
  }

  save() {
    if (this.categoryForm.valid) {
      const categoryData = this.categoryForm.value;
      this.dialogRef.close(categoryData);
    }
  }
}