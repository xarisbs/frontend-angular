import { MenuItem } from './services/menu.service';

export const MENU_CONFIG: MenuItem[] = [
  {
    url: '/dashboard/inicio',
    icon: 'fa-solid fa-house',
    name: 'Inicio',
    permissions: ['admin.home'],
  },
  {
    menuHeader: 'SEGURIDAD',
    permissions: ['admin.roles', 'admin.users'],
  } as MenuItem,
  {
    name: 'Gestión de seguridad',
    icon: 'fa-solid fa-lock',
    permissions: ['admin.roles', 'admin.users'],
    submenu: [
      {
        url: '/dashboard/roles',
        name: 'Roles y permisos',
        permissions: [
          'admin.roles',
          'admin.roles.create',
          'admin.roles.edit',
          'admin.roles.assign-permission',
        ],
      },
      {
        url: '/dashboard/usuarios',
        name: 'Usuarios del sistema',
        permissions: [
          'admin.users',
          'admin.users.create',
          'admin.users.edit',
          'admin.users.assign-role',
        ],
      },
    ],
  },
  {
    name: 'Perfil personal',
    icon: 'fa-solid fa-user',
    url: '/dashboard/perfil',
    permissions: ['admin.manage.profile'],
  },
  {
    menuHeader: 'GESTIÓN PPP',
    permissions: [
      'admin.monitor',
      'admin.register-ppp',
      'admin.supervisor-ppp',
      'admin.evaluation.ppp',
    ],
  } as MenuItem,
  {
    name: 'Monitoreo y registro PPP',
    icon: 'fa-solid fa-clipboard-check',
    permissions: [
      'admin.monitor',
      'admin.register-ppp',
      'admin.supervisor-ppp',
      'admin.evaluation.ppp',
    ],
    submenu: [
      {
        url: '/dashboard/monitor',
        name: 'Monitoreo de prácticas',
        permissions: ['admin.monitor'],
      },
      {
        url: '/dashboard/register-ppp',
        name: 'Registro de PPP',
        permissions: ['admin.register-ppp'],
      },
      {
        url: '/dashboard/supervisor-ppp',
        name: 'Supervisión PPP',
        permissions: ['admin.supervisor-ppp'],
      },
      {
        url: '/dashboard/evaluation-ppp',
        name: 'Evaluación PPP',
        permissions: ['admin.evaluation.ppp'],
      },
    ],
  },
  {
    url: '/dashboard/asignar_supervisor',
    icon: 'fa-solid fa-users',
    name: 'Supervisor',
    permissions: ['admin.supervisor-ppp'],
  },
];
