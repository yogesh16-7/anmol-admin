import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, Product, Category } from '../../services/api';
import { Toaster } from '../../services/toaster';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ProductDialogComponent, ProductDialogData } from '../../components/product-dialog/product-dialog';

@Component({
  selector: 'app-products',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  template: `


        <h1>Products Management</h1>
      
      <button mat-raised-button color="primary" (click)="openAddDialog()">
        <mat-icon>add</mat-icon>
        Add Product
      </button>

    <div class="table-container">
      <table mat-table [dataSource]="products" class="mat-elevation-z8">
        <ng-container matColumnDef="image">
          <th mat-header-cell *matHeaderCellDef>Image</th>
          <td mat-cell *matCellDef="let product">
            <img [src]="product.image" [alt]="product.name" class="product-image">
          </td>
        </ng-container>

        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let product" class="product-name">{{ product.name }}</td>
        </ng-container>

        <ng-container matColumnDef="price">
          <th mat-header-cell *matHeaderCellDef>Price</th>
          <td mat-cell *matCellDef="let product" class="price">{{ product.price | number:'1.2-2' }}</td>
        </ng-container>

        <ng-container matColumnDef="category">
          <th mat-header-cell *matHeaderCellDef>Category</th>
          <td mat-cell *matCellDef="let product">
            <span class="category-chip">{{ product.category?.name || product.category }}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="inStock">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let product">
            <span class="status-chip" [class.in-stock]="product.countInStock > 0" [class.out-of-stock]="product.countInStock <= 0">
              {{ product.countInStock > 0 ? 'In Stock' : 'Out of Stock' }}
            </span>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let product">
            <button mat-icon-button color="primary" (click)="editProduct(product)" matTooltip="Edit">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteProduct(product.id)" matTooltip="Delete">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .header-content h1 {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 4px;
  }

  .header-content h1 mat-icon {
    color: #1976d2;
  }

  .header-content p {
    color: #666;
    margin: 0;
    font-size: 0.9rem;
  }

  .table-container {
    overflow-x: auto;
  }

  table {
    width: 100%;
    min-width: 800px;
  }

  .product-image {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
  }

  .product-name {
    font-weight: 500;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .price {
    font-weight: 600;
    color: #2e7d32;
  }

  .category-chip {
    background: #e3f2fd;
    color: #1976d2;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .status-chip {
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .status-chip.in-stock {
    background: #e8f5e8;
    color: #2e7d32;
  }

  .status-chip.out-of-stock {
    background: #fdecea;
    color: #c62828;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
  }

  .loading-spinner {
    font-size: 48px;
    width: 48px;
    height: 48px;
    animation: spin 1s linear infinite;
    color: #1976d2;
    margin-bottom: 16px;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`]

})
export class ProductsComponent {
  route = inject(ActivatedRoute);
  api = inject(ApiService);
  toaster = inject(Toaster);
  dialog = inject(MatDialog);
  fb = inject(NonNullableFormBuilder);

  products: Product[] = [];
  categories: Category[] = [];
  displayedColumns: string[] = ['image', 'name', 'price', 'category', 'inStock', 'actions'];
  isLoading = false;

  constructor() {
    const data = this.route.snapshot.data['products'] as Product[];
    if (data) {
      this.products = data;
    }
    // Load categories separately since they're needed for the dialog
    this.loadCategories();
  }

  loadCategories() {
    this.api.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Failed to load categories:', error);
        this.toaster.error('Failed to load categories');
      }
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '600px',
      data: { categories: this.categories } as ProductDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.createProduct(result.productData, result.imageFile).subscribe({
          next: () => {
            this.toaster.success('Product created successfully');
            this.reloadProducts();
          },
          error: (error) => {
            this.toaster.error('Failed to create product');
          }
        });
      }
    });
  }

  editProduct(product: Product) {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '600px',
      data: { product, categories: this.categories } as ProductDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.updateProduct(product.id, result.productData, result.imageFile).subscribe({
          next: () => {
            this.toaster.success('Product updated successfully');
            this.reloadProducts();
          },
          error: (error) => {
            this.toaster.error('Failed to update product');
          }
        });
      }
    });
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.api.deleteProduct(id).subscribe({
        next: () => {
          this.toaster.success('Product deleted successfully');
          this.reloadProducts();
        },
        error: (error) => {
          this.toaster.error('Failed to delete product');
        }
      });
    }
  }

  private reloadProducts() {
    this.api.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Failed to reload products:', error);
        this.toaster.error('Failed to reload products');
      }
    });
  }
}
