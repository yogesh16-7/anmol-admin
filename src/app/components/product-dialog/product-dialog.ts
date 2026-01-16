import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService, Product, Category } from '../../services/api';

export interface ProductDialogData {
  product?: Product;
  categories: Category[];
}

@Component({
  selector: 'app-product-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.product ? 'Edit Product' : 'Add Product' }}</h2>

    <mat-dialog-content>
      <form [formGroup]="productForm" class="product-form">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" placeholder="Product name">
          <mat-error *ngIf="productForm.get('name')?.invalid && productForm.get('name')?.touched">
            Name is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" placeholder="Product description" rows="3"></textarea>
          <mat-error *ngIf="productForm.get('description')?.invalid && productForm.get('description')?.touched">
            Description is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Price</mat-label>
          <input matInput type="number" formControlName="price" placeholder="0.00" step="0.01" min="0">
          <mat-error *ngIf="productForm.get('price')?.invalid && productForm.get('price')?.touched">
            Valid price is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Image URL</mat-label>
          <input matInput formControlName="image" placeholder="https://example.com/image.jpg">
          <mat-error *ngIf="productForm.get('image')?.invalid && productForm.get('image')?.touched">
            Valid image URL is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Category</mat-label>
          <mat-select formControlName="category">
            <mat-option *ngFor="let category of data.categories" [value]="category.id">
              {{ category.name }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="productForm.get('category')?.invalid && productForm.get('category')?.touched">
            Category is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Stock Count</mat-label>
          <input matInput type="number" formControlName="countInStock" placeholder="0" min="0">
          <mat-error *ngIf="productForm.get('countInStock')?.invalid && productForm.get('countInStock')?.touched">
            Stock count must be 0 or greater
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="productForm.invalid">
        {{ data.product ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .product-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 400px;
      padding-top: 16px;
    }

    mat-form-field {
      width: 100%;
    }

    mat-slide-toggle {
      margin-top: 8px;
    }
  `]
})
export class ProductDialogComponent {
  fb = inject(NonNullableFormBuilder);
  api = inject(ApiService);
  dialogRef = inject(MatDialogRef<ProductDialogComponent>);

  productForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    image: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
    category: ['', Validators.required],
    countInStock: [0, [Validators.required, Validators.min(0)]]
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: ProductDialogData) {
    if (data.product) {
      const product = { ...data.product };
      // Handle populated category object
      if (typeof product.category === 'object' && product.category !== null) {
        product.category = (product.category as any).id || (product.category as any)._id;
      }
      this.productForm.patchValue(product);
    }
  }

  save() {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      this.dialogRef.close(productData);
    }
  }
}