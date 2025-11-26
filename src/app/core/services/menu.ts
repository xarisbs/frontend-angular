import { Injectable } from '@angular/core';
import { AuthService } from './auth';
import { MENU_CONFIG } from '../menu.config';

export interface MenuItem {
    name?: string;
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
     * Devuelve el menú filtrado según los permisos del usuario
     */
    getMenu(): MenuItem[] {
        const user = this.auth.getUser();
        const userPermissions: string[] = user?.permissions || [];

        return MENU_CONFIG
            .filter((item: MenuItem) => this.hasPermission(item, userPermissions))
            .map((item: MenuItem) => ({
                ...item,
                submenu: item.submenu
                    ? item.submenu.filter((sub: MenuItem) =>
                        this.hasPermission(sub, userPermissions)
                    )
                    : undefined,
            }));
    }

    /**
     * Verifica si el usuario tiene permiso para ver el ítem del menú
     */
    private hasPermission(item: MenuItem, userPermissions: string[]): boolean {
        // Si el ítem no define permisos, se asume visible para todos
        if (!item.permissions || item.permissions.length === 0) return true;

        // Devuelve true si al menos un permiso del ítem coincide con los del usuario
        return item.permissions.some(p => userPermissions.includes(p));
    }
}
