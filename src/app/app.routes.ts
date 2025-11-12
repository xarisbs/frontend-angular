import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { Dashboard } from './pages/dashboard/dashboard';
import { Usuarios } from './pages/usuarios/usuarios';
import { Perfil } from './pages/perfil/perfil';
import { Inicio } from './pages/inicio/inicio';
import { Roles } from './pages/roles/roles';
import { AuthGuard } from './core/guards/auth-guard';
import { LoginGuard } from './core/guards/login-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [AuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      { path: 'inicio', component: Inicio },
      { path: 'perfil', component: Perfil },
      { path: 'roles', component: Roles },
      { path: 'usuarios', component: Usuarios },
    ]
  },
  { path: '**', redirectTo: 'login' },
];


