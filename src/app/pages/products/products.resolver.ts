import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ApiService, Product } from '../../services/api';

export const productsResolver: ResolveFn<Product[]> = () => {
  const api = inject(ApiService);
  return api.getProducts();
};
