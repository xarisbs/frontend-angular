import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

  canActivate(): boolean {
    if (this.auth.isAuthenticated()) {
      // Redirige a la ruta original si existe en el router, o a /dashboard
      const lastPath = sessionStorage.getItem('lastDashboardPath') || '/dashboard/inicio';
      this.router.navigateByUrl(lastPath);
      return false;
    }
    return true;
  }
}
