import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:4000/api';
  private tokenSubject = new BehaviorSubject<string | null>(null);
  token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    if (token) this.tokenSubject.next(token);
  }

  // Mantiene la firma usada por el LoginComponent actual
  login(credentials: { correo: string; contraseña: string }) {
    return this.http.post<any>(`${this.api}/auth/login`, credentials).pipe(
      tap({
        next: (res) => {
          // Persistencia
          localStorage.setItem('token', res.token);
          if (res.usuario) {
            localStorage.setItem('user', JSON.stringify(res.usuario));
          }
          this.tokenSubject.next(res.token);

          // Redirección centralizada por rol
          const role = res?.usuario?.tipo ?? this.getCurrentUser()?.tipo ?? '';
          const target = this.routeForRole(role);
          this.router.navigate([target]);
        },
        error: (err) => {
          console.error('Error en el login:', err);
        },
      })
    );
  }

  private routeForRole(tipo: string): string {
    switch (tipo) {
      case 'admin-general':
      case 'admin':
        return '/admin-sistema';
      case 'admin-cine':
      case 'admin_cine':
        return '/admin-cine';
      case 'anunciante':
        return '/anunciante';
      default:
        // Cliente normal: aterriza en el dashboard público (cartelera por defecto)
        return '/dashboard';
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.tokenSubject.next(null);
  }

  getToken() {
    return this.tokenSubject.value;
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Devuelve información básica del usuario almacenada en localStorage (si existe).
   * Notar: en una implementación real esto debería provenir del backend o ser extraída
   * del token JWT decodificado. Se añade para compatibilidad con componentes.
   */
  getCurrentUser(): any {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }
}
