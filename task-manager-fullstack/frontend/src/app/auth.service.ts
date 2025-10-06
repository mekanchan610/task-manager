import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'TASK_JWT';
  isLogged$ = new BehaviorSubject<boolean>(!!localStorage.getItem(this.tokenKey));
  constructor(private http: HttpClient, private router: Router) {}
  login(username: string, password: string) {
    return this.http.post<any>('/api/auth/login', { username, password }).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
        this.isLogged$.next(true);
        this.router.navigate(['/dashboard']);
      })
    );
  }
  logout() { localStorage.removeItem(this.tokenKey); this.isLogged$.next(false); this.router.navigate(['/login']); }
  getToken() { return localStorage.getItem(this.tokenKey); }
}
