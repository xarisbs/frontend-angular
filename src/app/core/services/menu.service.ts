import { Injectable } from '@angular/core';
import { AuthService } from './auth';
import { MENU_CONFIG } from '../menu.config';

export interface MenuItem {
    name: string;
    icon?: string;
    url?: string;
    menuHeader?: string;
    permissions?: string[];
    submenu?: MenuItem[];
}

@Injectable({ providedIn: 'root' })
export class MenuService {
    constructor(private auth: AuthService) { }

    /**
     * Filtra el menú según los permisos del usuario autenticado
     */
    getMenu(): MenuItem[] {
        const user = this.auth.getUser();
        const userPermissions: string[] = user?.permissions || [];

        return MENU_CONFIG.filter((item: MenuItem) =>
            this.hasPermission(item, userPermissions)
        ).map((item: MenuItem) => ({
            ...item,
            submenu: item.submenu
                ? item.submenu.filter((sub: MenuItem) =>
                    this.hasPermission(sub, userPermissions)
                )
                : undefined,
        }));
    }

    private hasPermission(item: MenuItem, userPermissions: string[]): boolean {
        if (!item.permissions || item.permissions.length === 0) return true;
        return item.permissions.some((p: string) => userPermissions.includes(p));
    }
}
