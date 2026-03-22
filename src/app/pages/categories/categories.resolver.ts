import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ApiService, Category } from '../../services/api';

export const categoriesResolver: ResolveFn<Category[]> = () => {
  const api = inject(ApiService);
  return api.getCategories();
};