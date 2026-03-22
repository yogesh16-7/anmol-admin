import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ApiService, User } from '../../services/api';

export const usersResolver: ResolveFn<User[]> = () => {
  const api = inject(ApiService);
  return api.getUsers();
};