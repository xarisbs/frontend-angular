import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { filter, Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  openDropdown: string | null = null;
  user$: Observable<any>;

  // Mapa de rutas a dropdown
  private routeDropdownMap: { [key: string]: string } = {
    '/dashboard/roles': 'seguridad',
    '/dashboard/perfil': 'cuentas',
    // agrega más rutas y su dropdown correspondiente si hay otros
  };

  constructor(private auth: AuthService, private router: Router) {
    this.user$ = this.auth.user$; // Async pipe en template

    // Guardar la última ruta del dashboard
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.urlAfterRedirects.startsWith('/dashboard')) {
          sessionStorage.setItem('lastDashboardPath', event.urlAfterRedirects);

          // 🔹 Abrir dropdown automáticamente según ruta
          this.updateOpenDropdown(event.urlAfterRedirects);
        }
      });
  }

  ngOnInit() {
    // Redirige al login si el usuario no existe
    this.auth.user$.subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
      }
    });

    // Redirige a la última ruta si estamos exactamente en /dashboard
    const lastPath = sessionStorage.getItem('lastDashboardPath');
    const currentPath = this.router.url;
    if (currentPath === '/dashboard' && lastPath) {
      this.router.navigate([lastPath]);
    } else {
      // 🔹 Al iniciar, también abrir dropdown si la ruta coincide
      this.updateOpenDropdown(currentPath);
    }
  }

  toggleDropdown(menu: string) {
    this.openDropdown = this.openDropdown === menu ? null : menu;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  private updateOpenDropdown(path: string) {
    // Recorre el mapa de rutas y abre el dropdown correspondiente
    for (const route in this.routeDropdownMap) {
      if (path.startsWith(route)) {
        this.openDropdown = this.routeDropdownMap[route];
        return;
      }
    }
    // Si no coincide ninguna ruta, cierra todos
    this.openDropdown = null;
  }
}
