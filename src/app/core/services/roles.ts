import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private apiUrl = `${environment.apiUrl}/api/roles`;

  constructor(private http: HttpClient) { }

  // Listar todos los roles
  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtener rol por id
  getRoleById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Crear nuevo rol
  createRole(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Actualizar rol existente
  updateRole(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // Eliminar rol
  deleteRole(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // role.service.ts
  assignPermissions(roleId: number, permissionIds: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/${roleId}/permissions`, { permissionIds }, { responseType: 'text' });
  }

  removePermissions(roleId: number, permissionIds: number[]): Observable<any> {
    return this.http.request('delete', `${this.apiUrl}/${roleId}/permissions`, {
      body: { permissionIds },
      responseType: 'text'
    });
  }
}
