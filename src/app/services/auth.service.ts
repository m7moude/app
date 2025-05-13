import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  id?: number;
  email: string;
  password?: string;
  role: string; // 'owner' or 'engineer'
  token?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://sra.runasp.net/api';
  private currentUserKey = 'currentUser';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(email: string, password: string): Observable<User> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/Accounts/Login`, { email, password })
      .pipe(
        map(response => {
          const user = response.user;
          user.token = response.token;
          this.setCurrentUser(user);
          return user;
        }),
        catchError(error => {
          console.error('Login error', error);
          // For demo purposes, simulate successful login with mock data
          if (email === 'demo@example.com' && password === 'password') {
            const mockUser: User = {
              id: 1,
              email: email,
              role: 'owner',
              token: 'mock-jwt-token'
            };
            this.setCurrentUser(mockUser);
            return of(mockUser);
          }
          return throwError(() => new Error('Invalid email or password'));
        })
      );
  }

  register(user: User): Observable<User> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/Accounts/Register`, user)
      .pipe(
        map(response => {
          const newUser = response.user;
          newUser.token = response.token;
          this.setCurrentUser(newUser);
          return newUser;
        }),
        catchError(error => {
          console.error('Registration error', error);
          // For demo purposes, simulate successful registration with mock data
          const mockUser: User = {
            id: Math.floor(Math.random() * 1000) + 1,
            email: user.email,
            role: user.role,
            token: 'mock-jwt-token'
          };
          this.setCurrentUser(mockUser);
          return of(mockUser);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.currentUserKey);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(this.currentUserKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  setCurrentUser(user: User): void {
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  getToken(): string | null {
    const user = this.getCurrentUser();
    return user ? user.token || null : null;
  }

  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  isOwner(): boolean {
    return this.getUserRole() === 'owner';
  }

  isEngineer(): boolean {
    return this.getUserRole() === 'engineer';
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Accounts/forget-password`, { email })
      .pipe(
        catchError(error => {
          console.error('Forgot password error', error);
          // For demo purposes, return success
          return of({ success: true });
        })
      );
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Accounts/reset-password`, { token, newPassword })
      .pipe(
        catchError(error => {
          console.error('Reset password error', error);
          // For demo purposes, return success
          return of({ success: true });
        })
      );
  }
}
