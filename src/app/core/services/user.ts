import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient) { }

  // Obtener todos los usuarios
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

  // Eliminar usuario
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar-user/${id}`);
  }

  deleteUserPerfil(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar-user-perfil/${id}`);
  }

  assignRoles(id: number, roleIds: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/roles`, { roleIds }, { responseType: 'text' });
  }

  removeRoles(id: number, roleIds: number[]): Observable<any> {
    return this.http.request('delete', `${this.apiUrl}/${id}/roles`, {
      body: { roleIds },
      responseType: 'text'
    });
  }

}
