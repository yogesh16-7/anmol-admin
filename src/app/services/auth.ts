import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AdminUser {
  email: string;
  token: string;
  isAdmin: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AdminUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const token = localStorage.getItem('adminToken');
    const email = localStorage.getItem('adminEmail');
    const isAdmin = localStorage.getItem('adminIsAdmin') === 'true';

    if (token && email) {
      this.currentUserSubject.next({ email, token, isAdmin });
    }
  }

  login(user: AdminUser) {
    localStorage.setItem('adminToken', user.token);
    localStorage.setItem('adminEmail', user.email);
    localStorage.setItem('adminIsAdmin', user.isAdmin.toString());
    this.currentUserSubject.next(user);
  }

  logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminIsAdmin');
    this.currentUserSubject.next(null);
  }

  get currentUser(): AdminUser | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  get token(): string | null {
    return this.currentUser?.token || null;
  }
}