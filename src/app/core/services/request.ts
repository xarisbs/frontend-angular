import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private apiUrl = `${environment.apiUrl}/api/requests`;

  constructor(private http: HttpClient) {}

  // ============================================
  // 🔹 Obtener el token desde localStorage
  // ============================================
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // ============================================
  // 🔹 OBTENER LISTA DE REQUESTS
  // ============================================
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  // ============================================
  // 🔹 OBTENER REQUEST POR ID
  // ============================================
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // ============================================
  // 🔹 CREAR REQUEST
  // ============================================
  create(request: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, request, {
      headers: this.getAuthHeaders(),
    });
  }

  // ============================================
  // 🔹 ACTUALIZAR REQUEST COMPLETA
  // ============================================
  update(id: number, request: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, request, {
      headers: this.getAuthHeaders(),
    });
  }

  // ============================================
  // 🔹 ACTUALIZAR SOLO EL ESTADO
  // ============================================
  updateEstado(id: number, estado: boolean): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      { estado },
      { headers: this.getAuthHeaders() }
    );
  }

  // ============================================
  // 🔹 ELIMINAR REQUEST
  // ============================================
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
