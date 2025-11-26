import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyUserService {

  private apiUrl = `${environment.apiUrl}/api/company-users`;

  constructor(private http: HttpClient) {}

  // =====================================
  // 🔹 LISTAR TODOS LOS COMPANY USERS
  // =====================================
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // =====================================
  // 🔹 LISTAR USUARIOS POR EMPRESA
  // =====================================
  getByCompany(companyId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/company/${companyId}`);
  }

  // =====================================
  // 🔹 CREAR
  // =====================================
  create(dto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, dto);
  }

  // =====================================
  // 🔹 ELIMINAR
  // =====================================
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // =====================================
  // 🔹 ASIGNAR SUPERVISOR
  // =====================================
  assignSupervisor(id: number, supervisorId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/assign-supervisor/${supervisorId}`, {});
  }

  // =====================================
  // 🔹 QUITAR SUPERVISOR (poner null)
  // =====================================
  clearSupervisor(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/clear-supervisor`, {});
  }
}
