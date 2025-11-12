import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Permission {
  private apiUrl = `${environment.apiUrl}/api/permissions`;

  constructor(private http: HttpClient) { }

  // Obtener todos los permisos disponibles
  getPermissions(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
