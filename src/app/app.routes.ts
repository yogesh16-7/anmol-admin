import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then(m => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () => import('./layout/layout').then(m => m.LayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then(m => m.DashboardComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/products/products').then(m => m.ProductsComponent),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./pages/categories/categories').then(m => m.CategoriesComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/users/users').then(m => m.UsersComponent),
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
