import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  user: string;
  token: string;
  userId: string;
  isAdmin: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  richDescription?: string;
  price: number;
  image: string;
  images?: string[];
  brand?: string;
  category: string;
  countInStock: number;
  rating?: number;
  numReviews?: number;
  isFeatured?: boolean;
  dateCreated?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isAdmin: boolean;
}

export interface OrderItem {
  id: string;
  quantity: number;
  product: any;
}

export interface Order {
  id: string;
  orderItems: OrderItem[];
  shippingAddress1?: string;
  shippingAddress2?: string;
  city?: string;
  zip?: string;
  country?: string;
  phone?: string;
  status?: string;
  totalPrice?: number;
  user?: User | string;
  dateOrdered?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://ecommerce-backend-xrnh.onrender.com/api/v1';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/users/login`, { email, password });
  }

  // Products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`);
  }

  createProduct(product: Omit<Product, 'id' | 'dateCreated'>, imageFile: File): Observable<Product> {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    if (product.richDescription) formData.append('richDescription', product.richDescription);
    formData.append('price', product.price.toString());
    if (product.brand) formData.append('brand', product.brand);
    const categoryId = product.category;
    formData.append('category', categoryId);
    formData.append('countInStock', product.countInStock.toString());
    if (product.rating !== undefined) formData.append('rating', product.rating.toString());
    if (product.numReviews !== undefined) formData.append('numReviews', product.numReviews.toString());
    if (product.isFeatured !== undefined) formData.append('isFeatured', product.isFeatured.toString());
    formData.append('image', imageFile);

    return this.http.post<Product>(`${this.baseUrl}/products`, formData);
  }

  updateProduct(id: string, product: Partial<Omit<Product, 'id' | 'dateCreated'>>, imageFile?: File): Observable<Product> {
    const formData = new FormData();
    if (product.name) formData.append('name', product.name);
    if (product.description) formData.append('description', product.description);
    if (product.richDescription !== undefined) formData.append('richDescription', product.richDescription || '');
    if (product.price !== undefined) formData.append('price', product.price.toString());
    if (product.brand !== undefined) formData.append('brand', product.brand || '');
    if (product.category) {
      const categoryId = product.category;
      formData.append('category', categoryId);
    }
    if (product.countInStock !== undefined) formData.append('countInStock', product.countInStock.toString());
    if (product.rating !== undefined) formData.append('rating', product.rating.toString());
    if (product.numReviews !== undefined) formData.append('numReviews', product.numReviews.toString());
    if (product.isFeatured !== undefined) formData.append('isFeatured', product.isFeatured.toString());
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return this.http.put<Product>(`${this.baseUrl}/products/${id}`, formData);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/products/${id}`);
  }

  // Categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  createCategory(category: Omit<Category, 'id'>): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/categories`, category);
  }

  updateCategory(id: string, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/categories/${id}`, category);
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/categories/${id}`);
  }

  // Users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, user);
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }

  // Orders
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/orders`);
  }

  getOrder(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/orders/${id}`);
  }

  updateOrderStatus(id: string, status: string): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/orders/${id}`, { status });
  }
}