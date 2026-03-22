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
    ReactiveFormsModule,
    MatSlideToggleModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.product ? 'Edit Product' : 'Add Product' }}</h2>

    <mat-dialog-content>
      <form [formGroup]="productForm" class="product-form">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" placeholder="Product name">
          <mat-error *ngIf="productForm.get('name')?.invalid && productForm.get('name')?.touched">Name is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" placeholder="Product description" rows="3"></textarea>
          <mat-error *ngIf="productForm.get('description')?.invalid && productForm.get('description')?.touched">Description is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Rich Description</mat-label>
          <textarea matInput formControlName="richDescription" placeholder="Detailed product description" rows="4"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Brand</mat-label>
          <input matInput formControlName="brand" placeholder="Product brand">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Price</mat-label>
          <input matInput type="number" formControlName="price" placeholder="0.00" step="0.01" min="0">
          <mat-error *ngIf="productForm.get('price')?.invalid && productForm.get('price')?.touched">Valid price is required</mat-error>
        </mat-form-field>

        <!-- Product Image Upload -->
        <div style="margin-bottom: 16px;">
          <label style="font-weight: 500;">Product Image {{ data.product ? '(optional)' : '(required)' }}</label><br />

          <input
            type="file"
            accept="image/*"
            (change)="onImageSelected($event)"
            required="{{ !data.product }}"
          />
          @if (!data.product && !selectedImage) {
            <mat-error style="font-size: 0.75rem; color: #f44336; margin-top: 4px;">Image is required for new products</mat-error>
          }
        </div>

        @if (imagePreview) {
          <img
            [src]="imagePreview"
            style="
              width: 100px;
              height: 100px;
              object-fit: cover;
              margin-bottom: 16px;
              border-radius: 6px;
              border: 1px solid #e0e0e0;
            "
          />
        }

   <mat-form-field appearance="outline">
          <mat-label>Category</mat-label>
          <mat-select formControlName="category">
            <mat-option *ngFor="let category of data.categories; trackBy: trackByCategory" [value]="category.name">
              {{ category.name }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="productForm.get('category')?.invalid && productForm.get('category')?.touched">Category is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Stock Count</mat-label>
          <input matInput type="number" formControlName="countInStock" placeholder="0" min="0">
          <mat-error *ngIf="productForm.get('countInStock')?.invalid && productForm.get('countInStock')?.touched">Stock count must be 0 or greater</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Rating</mat-label>
          <input matInput type="number" formControlName="rating" placeholder="0" min="0" max="5" step="0.1">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Number of Reviews</mat-label>
          <input matInput type="number" formControlName="numReviews" placeholder="0" min="0">
        </mat-form-field>

        <mat-slide-toggle formControlName="isFeatured">Featured Product</mat-slide-toggle>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="productForm.invalid || (!data.product && !selectedImage)">
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
    richDescription: [''],
    brand: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    category: ['', Validators.required],
    countInStock: [0, [Validators.required, Validators.min(0)]],
    rating: [0, [Validators.min(0), Validators.max(5)]],
    numReviews: [0, [Validators.min(0)]],
    isFeatured: [false]
  });

  selectedImage: File | null = null;
  imagePreview: string | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ProductDialogData) {
    if (data.product) {
      this.productForm.patchValue({
        name: data.product.name,
        description: data.product.description,
        richDescription: data.product.richDescription || '',
        brand: data.product.brand || '',
        price: data.product.price,
        category: data.product.category,
        countInStock: data.product.countInStock,
        rating: data.product.rating || 0,
        numReviews: data.product.numReviews || 0,
        isFeatured: data.product.isFeatured || false
      });
    }
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    this.selectedImage = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(this.selectedImage);
  }

  trackByCategory(index: number, category: Category): string {
    return category.id;
  }

  save() {
    if (!this.productForm.valid || (!this.data.product && !this.selectedImage)) {
      return;
    }

    const productData = {
      name: this.productForm.value.name!,
      description: this.productForm.value.description!,
      richDescription: this.productForm.value.richDescription || '',
      brand: this.productForm.value.brand || '',
      price: this.productForm.value.price!,
      category: this.productForm.value.category!,
      countInStock: this.productForm.value.countInStock!,
      rating: this.productForm.value.rating || 0,
      numReviews: this.productForm.value.numReviews || 0,
      isFeatured: this.productForm.value.isFeatured || false
    };

    this.dialogRef.close({ productData, imageFile: this.selectedImage });
  }

}