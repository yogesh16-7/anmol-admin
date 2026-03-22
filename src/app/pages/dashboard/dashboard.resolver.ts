import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService, Product, Category, User } from '../../services/api';

export interface DashboardData {
  products: Product[];
  categories: Category[];
  users: User[];
}

export const dashboardResolver: ResolveFn<DashboardData> = () => {
  const api = inject(ApiService);
  return forkJoin({
    products: api.getProducts(),
    categories: api.getCategories(),
    users: api.getUsers()
  });
};