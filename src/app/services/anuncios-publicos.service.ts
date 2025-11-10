import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface AnuncioPublico {
  id: number;
  titulo: string;
  contenido: string;
  tipo: string;
  imagenUrl?: string;
  videoUrl?: string;
  enlaceUrl?: string;
  fechaInicio: string;
  fechaFin: string;
  aprobado: boolean;
  activo: boolean;
  impresiones?: number;
  clics?: number;
  anunciante?: { nombre: string; correo?: string; email?: string };
}

@Injectable({ providedIn: 'root' })
export class AnunciosPublicosService {
  private baseUrl = 'http://localhost:4000/api/anuncios';
  private anuncios$ = new BehaviorSubject<AnuncioPublico[]>([]);
  private loading$ = new BehaviorSubject<boolean>(false);
  private error$ = new BehaviorSubject<string | null>(null);
  private impresionesRegistradas = new Set<number>(); // Para evitar duplicados
  private observer: IntersectionObserver | null = null;

  constructor(private http: HttpClient) {
    this.initIntersectionObserver();
  }

  getAnuncios(): Observable<AnuncioPublico[]> { return this.anuncios$.asObservable(); }
  isLoading(): Observable<boolean> { return this.loading$.asObservable(); }
  getError(): Observable<string | null> { return this.error$.asObservable(); }

  private initIntersectionObserver(): void {
    // IntersectionObserver para detectar cuando un anuncio es visible
    this.observer = new IntersectionObserver(
      (entries) => {
        const idsVisibles: number[] = [];
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.hasAttribute('data-anuncio-id')) {
            const id = parseInt(entry.target.getAttribute('data-anuncio-id') || '0', 10);
            if (id && !this.impresionesRegistradas.has(id)) {
              this.impresionesRegistradas.add(id);
              idsVisibles.push(id);
            }
          }
        });
        if (idsVisibles.length > 0) {
          this.registrarImpresiones(idsVisibles).subscribe({
            next: () => console.log('Impresiones registradas:', idsVisibles),
            error: (err) => console.error('Error registrando impresiones:', err)
          });
        }
      },
      { threshold: 0.5 } // 50% visible
    );
  }

  observarAnuncio(elemento: HTMLElement): void {
    if (this.observer && elemento) {
      this.observer.observe(elemento);
    }
  }

  desobservarAnuncio(elemento: HTMLElement): void {
    if (this.observer && elemento) {
      this.observer.unobserve(elemento);
    }
  }

  refresh(destinatario: string = ''): void {
    this.loading$.next(true);
    this.error$.next(null);
    const query = destinatario ? `?destinatario=${encodeURIComponent(destinatario)}` : '';
    this.http.get<AnuncioPublico[]>(`${this.baseUrl}/vigentes${query}`).subscribe({
      next: data => {
        this.anuncios$.next(data);
        this.loading$.next(false);
        // No registramos impresiones aquí, el IntersectionObserver lo hará cuando sean visibles
      },
      error: err => {
        console.error('Error cargando anuncios públicos', err);
        this.error$.next('No se pudieron cargar los anuncios');
        this.loading$.next(false);
      }
    });
  }

  registrarClick(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/click`, {});
  }

  registrarImpresiones(ids: number[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/impresiones`, { ids });
  }

  limpiarImpresionesRegistradas(): void {
    this.impresionesRegistradas.clear();
  }
}
