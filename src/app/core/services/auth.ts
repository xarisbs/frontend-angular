import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  private isBrowser: boolean;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.userSubject.next(JSON.parse(storedUser));
      }
    }
  }

  login(credentials: { userName: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        if (this.isBrowser) {
          // 🔹 Guardar token
          localStorage.setItem('token', res.token);

          // 🔹 Crear objeto usuario SIN token
          const userData = {
            id: res.id,
            userName: res.userName,
            nombres: res.nombres,
            apellidos: res.apellidos,
            codigoUniversitario: res.codigoUniversitario,
            correo: res.correo,
            roles: res.roles,
            permissions: res.permissions
          };

          // 🔹 Guardar usuario
          localStorage.setItem('user', JSON.stringify(userData));

          console.log("TOKEN:", res.token);
          console.log("USER:", userData);
        }

        this.userSubject.next(res);
      })
    );
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.userSubject.next(null);
  }

  getUser(): any {
    return this.userSubject.value;
  }

  setUser(user: any) {
    if (this.isBrowser) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    this.userSubject.next(user);
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem('token') : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
