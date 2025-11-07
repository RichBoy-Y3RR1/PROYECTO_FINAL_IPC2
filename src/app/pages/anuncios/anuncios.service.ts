import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Anuncio {
  id?: number;
  tipo: 'TEXTO' | 'TEXTO_IMAGEN' | 'VIDEO_TEXTO';
  contenido: string;
  imagen?: string;
  videoUrl?: string;
  periodoTiempo: '1_DIA' | '3_DIAS' | '1_SEMANA' | '2_SEMANAS';
  fechaInicio: Date;
  fechaFin: Date;
  costo: number;
  estado: 'ACTIVO' | 'INACTIVO';
  anuncianteId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnunciosService {
  private apiUrl = `${environment.apiUrl}/anuncios`;

  constructor(private http: HttpClient) { }

  obtenerAnuncios(estado?: 'ACTIVO' | 'INACTIVO'): Observable<Anuncio[]> {
    let url = this.apiUrl;
    if (estado) {
      url += `?estado=${estado}`;
    }
    return this.http.get<Anuncio[]>(url);
  }

  crearAnuncio(anuncioData: FormData): Observable<Anuncio> {
    return this.http.post<Anuncio>(this.apiUrl, anuncioData);
  }

  actualizarAnuncio(id: number, anuncioData: FormData): Observable<Anuncio> {
    return this.http.put<Anuncio>(`${this.apiUrl}/${id}`, anuncioData);
  }

  desactivarAnuncio(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/desactivar`, {});
  }

  obtenerEstadisticas(desde?: Date, hasta?: Date): Observable<any> {
    let url = `${this.apiUrl}/estadisticas`;
    if (desde && hasta) {
      url += `?desde=${desde.toISOString()}&hasta=${hasta.toISOString()}`;
    }
    return this.http.get<any>(url);
  }
}
