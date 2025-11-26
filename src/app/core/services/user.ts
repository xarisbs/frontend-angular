import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient) {}

  // ============================================
  // 🔹 CRUD PRINCIPAL DE USUARIOS
  // ============================================

  // Listar todos los usuarios
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtener usuario por ID
  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Crear usuario
  createUser(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Actualizar usuario
  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // Eliminar usuario desde perfil (con logout)
  deleteUserPerfil(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar-user-perfil/${id}`);
  }

  // Eliminar usuario normal
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar-user/${id}`);
  }

  // ============================================
  // 🔹 ROLES
  // ============================================

  // Asignar roles
  assignRoles(id: number, roleIds: number[]): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${id}/roles`,
      { roleIds },
      { responseType: 'text' }
    );
  }

  // Eliminar roles
  removeRoles(id: number, roleIds: number[]): Observable<any> {
    return this.http.request('delete', `${this.apiUrl}/${id}/roles`, {
      body: { roleIds },
      responseType: 'text'
    });
  }

  // ============================================
  // 🔹 FILTRAR POR ROLES
  // ============================================

  // Listar usuarios según un rol por nombre
  getByRoleName(roleName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/by-role/${roleName}`);
  }

  // Listar usuarios por múltiples roles (IDs)
  getByRoles(roleIds: number[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/by-roles`, { roleIds });
  }

  // ============================================
  // 🔹 ESTUDIANTES / NO ESTUDIANTES
  // ============================================

  // Listar usuarios que NO son estudiantes
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/without-estudiante`);
  }

  // Listar usuarios que sí son estudiantes
  getStudents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/estudiantes`);
  }
}
