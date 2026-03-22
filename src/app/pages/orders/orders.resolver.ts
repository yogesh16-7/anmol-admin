import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ApiService, Order } from '../../services/api';

export const ordersResolver: ResolveFn<Order[]> = () => {
  const api = inject(ApiService);
  return api.getOrders();
};