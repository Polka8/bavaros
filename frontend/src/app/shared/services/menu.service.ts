import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment.component';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = environment.apiUrl;  // Es. http://localhost:3000/api

  constructor(private http: HttpClient) {}

  // Recupera la lista dei piatti disponibili dal backend
  getMenu(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/menu`);
  }

  // Salva un nuovo menù creato dall'admin
  saveMenu(menu: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/menu`, menu, { headers });
  }

  // Aggiorna un menù esistente
  updateMenu(menu: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/menu/${menu.id_menu}`, menu, { headers });
  }

  // Elimina un menù
  deleteMenu(menuId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}/menu/${menuId}`, { headers });
  }

  // Recupera i menù salvati
  getSavedMenus(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/menu/saved`, { headers });
  }
}
