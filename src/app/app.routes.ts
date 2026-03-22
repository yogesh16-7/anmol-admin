import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { productsResolver } from './pages/products/products.resolver';
import { dashboardResolver } from './pages/dashboard/dashboard.resolver';
import { categoriesResolver } from './pages/categories/categories.resolver';
import { usersResolver } from './pages/users/users.resolver';
import { ordersResolver } from './pages/orders/orders.resolver';

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
        resolve: {
          dashboard: dashboardResolver
        }
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/products/products').then(m => m.ProductsComponent),
          resolve: {
            products: productsResolver
      }
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./pages/categories/categories').then(m => m.CategoriesComponent),
        resolve: {
          categories: categoriesResolver
        }
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/users/users').then(m => m.UsersComponent),
        resolve: {
          users: usersResolver
        }
      },
      {
        path: 'orders',
        loadComponent: () => import('./pages/orders/orders').then(m => m.OrdersComponent),
        resolve: {
          orders: ordersResolver
        }
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
