import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { MenuItem, MenuService } from '../../core/services/menu.service';
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
  menu: MenuItem[] = [];

  // Mapa de rutas → dropdown que se abrirá automáticamente
  private routeDropdownMap: { [key: string]: string } = {
    '/dashboard/roles': 'Gestión de seguridad',
    '/dashboard/usuarios': 'Gestión de seguridad',
    '/dashboard/monitor': 'Monitoreo y registro PPP',
    '/dashboard/register-ppp': 'Monitoreo y registro PPP',
    '/dashboard/supervisor-ppp': 'Monitoreo y registro PPP',
    '/dashboard/evaluation-ppp': 'Monitoreo y registro PPP',
    '/dashboard/perfil': 'Perfil personal',
  };

  constructor(private auth: AuthService, private menuService: MenuService, private router: Router) {
    this.user$ = this.auth.user$;

    // Detecta cambios de ruta y abre dropdown si aplica
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.urlAfterRedirects.startsWith('/dashboard')) {
          sessionStorage.setItem('lastDashboardPath', event.urlAfterRedirects);
          this.updateOpenDropdown(event.urlAfterRedirects);
        }
      });

  }

  ngOnInit() {
    // 1️⃣ Redirige al login si el usuario no está autenticado
    this.user$.subscribe((user) => {
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }
      // 2️⃣ Carga el menú dinámico según permisos
      this.menu = this.menuService.getMenu();
    });

    // 3️⃣ Reabre el último dropdown según la ruta guardada
    const lastPath = sessionStorage.getItem('lastDashboardPath');
    const currentPath = this.router.url;

    if (currentPath === '/dashboard' && lastPath) {
      this.router.navigate([lastPath]);
    } else {
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
    for (const route in this.routeDropdownMap) {
      if (path.startsWith(route)) {
        this.openDropdown = this.routeDropdownMap[route];
        return;
      }
    }
    this.openDropdown = null;
  }
}
