import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cines-public',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule
  ],
  template: `
    <div class="cines-public-container">
      <h1> Nuestros Cines</h1>
      <p class="subtitle">Explora las salas, funciones disponibles y comparte tu experiencia.</p>

      <div class="cines-grid">
        <mat-card *ngFor="let cine of cines" class="cine-card">
          <mat-card-header>
            <mat-card-title>{{ cine.nombre }}</mat-card-title>
            <mat-card-subtitle>{{ cine.direccion || 'Dirección no disponible' }}</mat-card-subtitle>
          </mat-card-header>

            <mat-card-content>
              <div class="salas" *ngIf="cine.Salas?.length > 0; else noSalas">
                <div class="sala-item" *ngFor="let sala of cine.Salas">
                  <div class="sala-header">
                    <mat-icon>meeting_room</mat-icon>
                    <strong>{{ sala.nombre || ('Sala ' + sala.numero) }}</strong>
                    <span class="sala-tipo" *ngIf="sala.tipo">{{ sala.tipo }}</span>
                    <span class="sala-capacidad" *ngIf="sala.capacidad">
                      <mat-icon>event_seat</mat-icon>
                      {{ sala.capacidad }}
                    </span>
                  </div>

                  <div class="funciones" *ngIf="sala.funciones?.length; else noFunciones">
                    <mat-chip-listbox>
                      <mat-chip-option *ngFor="let f of sala.funciones">
                        {{ f.fecha }} {{ f.hora }} - Q{{ f.precio }}
                      </mat-chip-option>
                    </mat-chip-listbox>
                  </div>
                  <ng-template #noFunciones>
                    <p class="sin-funciones">Sin funciones asignadas</p>
                  </ng-template>

                  <!-- Calificación de Sala -->
                  <div class="sala-rating">
                    <div class="rating-row">
                      <span class="rating-label">Calificar sala:</span>
                      <button mat-icon-button *ngFor="let star of [1,2,3,4,5]"
                              (click)="calificarSala(sala, star)"
                              [color]="(sala.miCalificacion||0) >= star ? 'warn' : ''">
                        <mat-icon>{{ (sala.miCalificacion||0) >= star ? 'star' : 'star_border' }}</mat-icon>
                      </button>
                    </div>
                  </div>

                  <!-- Comentarios de Sala -->
                  <div class="sala-comentarios">
                    <form (submit)="comentarSala(sala, $event)" class="comentario-form">
                      <mat-form-field appearance="outline" class="comentario-field">
                        <mat-label>Tu experiencia en esta sala</mat-label>
                        <textarea matInput
                                  [(ngModel)]="sala.nuevoComentario"
                                  [name]="'comentarioSala' + sala.id"
                                  rows="2"
                                  placeholder="Comparte tu opinión sobre esta sala..."></textarea>
                      </mat-form-field>
                      <button mat-stroked-button color="primary" type="submit"
                              [disabled]="!sala.nuevoComentario">
                        <mat-icon>send</mat-icon>
                        Publicar
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              <ng-template #noSalas>
                <p class="sin-salas">Sin salas registradas.</p>
              </ng-template>
            </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .cines-public-container { padding:24px; background:#f8f9fa; min-height:100vh; }
    h1 { margin:0 0 8px; color:#1a237e; font-size:32px; }
    .subtitle { margin:0 0 24px; color:#555; font-size:16px; }
    .cines-grid { display:grid; gap:24px; grid-template-columns:repeat(auto-fill,minmax(380px,1fr)); }
    .cine-card { display:flex; flex-direction:column; }
    .salas { display:flex; flex-direction:column; gap:20px; margin-top:16px; }
    .sala-item { background:#fff; padding:16px; border-radius:12px; border:1px solid #e0e0e0; box-shadow:0 2px 4px rgba(0,0,0,0.05); }
    .sala-header { display:flex; align-items:center; gap:8px; margin-bottom:12px; flex-wrap:wrap; }
    .sala-header strong { color:#1a237e; font-size:16px; }
    .sala-tipo { background:#e3f2fd; color:#1976d2; padding:4px 8px; border-radius:4px; font-size:12px; font-weight:500; }
    .sala-capacidad { display:flex; align-items:center; gap:4px; color:#666; font-size:13px; margin-left:auto; }
    .sala-capacidad mat-icon { font-size:16px; width:16px; height:16px; }
    .funciones { margin:12px 0; }
    .funciones mat-chip-option { font-size:12px; }
    .sin-funciones, .sin-salas { font-size:12px; color:#777; font-style:italic; padding:8px 0; }

    .sala-rating { margin:16px 0 12px; padding-top:12px; border-top:1px solid #e0e0e0; }
    .rating-row { display:flex; align-items:center; gap:8px; }
    .rating-label { font-size:14px; color:#666; }

    .sala-comentarios { margin-top:12px; }
    .comentario-form { display:flex; flex-direction:column; gap:8px; }
    .comentario-field { width:100%; }
    .comentario-form button { align-self:flex-end; }
  `]
})
export class CinesPublicComponent implements OnInit {
  cines: any[] = [];
  token: string | null = null;

  constructor(private http: HttpClient, private snack: MatSnackBar) {}

  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.cargarCines();
  }

  cargarCines() {
    this.http.get<any[]>('http://localhost:4000/api/cines').subscribe({
      next: async (cines) => {
        // Para cada sala, obtener funciones asignadas
        for (const cine of cines) {
          if (cine.Salas) {
            for (const sala of cine.Salas) {
              sala.funciones = await this.obtenerFuncionesSala(sala.id);
            }
          }
        }
        this.cines = cines;
      },
      error: err => {
        console.error('Error cargando cines:', err);
        this.snack.open('Error al cargar cines', 'Cerrar', { duration: 4000 });
      }
    });
  }

  obtenerFuncionesSala(salaId: number) {
    return this.http.get<any[]>(`http://localhost:4000/api/funciones?salaId=${salaId}`).toPromise().catch(() => []);
  }

  calificarSala(sala: any, valor: number) {
    if (!this.token) {
      this.snack.open('Inicia sesión para calificar', 'Cerrar', { duration: 3000 });
      return;
    }

    const payload = {
      salaId: sala.id,
      valor: valor,
      tipo: 'sala'
    };

    this.http.post('http://localhost:4000/api/calificaciones/sala', payload, {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: () => {
        sala.miCalificacion = valor;
  this.snack.open(`Sala calificada con ${valor} estrella${valor > 1 ? 's' : ''}`, 'Cerrar', {
          duration: 2500
        });
      },
      error: err => {
        console.error('Error calificando sala:', err);
        this.snack.open(err.error?.msg || 'Error al calificar la sala', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  comentarSala(sala: any, event: Event) {
    event.preventDefault();

    if (!this.token) {
      this.snack.open('Inicia sesión para comentar', 'Cerrar', { duration: 3000 });
      return;
    }

    if (!sala.nuevoComentario || !sala.nuevoComentario.trim()) {
      return;
    }

    const payload = {
      tipo: 'sala',
      salaId: sala.id,
      texto: sala.nuevoComentario.trim()
    };

    this.http.post('http://localhost:4000/api/comentarios', payload, {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: () => {
        this.snack.open('Comentario publicado exitosamente ', 'Cerrar', {
          duration: 2500
        });
        sala.nuevoComentario = '';
      },
      error: err => {
        console.error('Error publicando comentario:', err);
        this.snack.open(err.error?.msg || 'Error al publicar comentario', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }
}
