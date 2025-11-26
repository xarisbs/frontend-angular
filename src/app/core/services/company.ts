import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private apiUrl = `${environment.apiUrl}/api/companies`;

  constructor(private http: HttpClient) {}

  // =====================================
  // 🔹 OBTENER LISTA DE EMPRESAS
  // =====================================
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // =====================================
  // 🔹 OBTENER EMPRESA POR ID
  // =====================================
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // =====================================
  // 🔹 CREAR EMPRESA
  // =====================================
  create(company: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, company);
  }

  // =====================================
  // 🔹 ACTUALIZAR EMPRESA
  // =====================================
  update(id: number, company: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, company);
  }

  // =====================================
  // 🔹 ELIMINAR EMPRESA
  // =====================================
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // =====================================
  // 🔹 REGISTRO DE: USUARIO + EMPRESA
  // =====================================
  registerUserAndCompany(dto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register/user-company`, dto);
  }
}
