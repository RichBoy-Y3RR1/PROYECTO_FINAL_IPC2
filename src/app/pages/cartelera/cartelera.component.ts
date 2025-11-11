import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AnunciosPublicosService, AnuncioPublico } from '../../services/anuncios-publicos.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { TrailerDialogComponent } from './dialogs/trailer-dialog.component';
import { ComprarBoletosDialogComponent } from './dialogs/comprar-boletos-dialog.component';

@Component({
  selector: 'app-cartelera',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatMenuModule,
    MatChipsModule,
    MatSelectModule
  ],
  template: `
    <div class="cartelera-container">
      <!-- Bloque de Anuncios Vigentes -->
      <section class="anuncios-wrapper" *ngIf="anunciosLoading || anunciosError || anunciosPublicos.length">
        <h2 class="anuncios-title">
          <mat-icon>campaign</mat-icon>
          Anuncios Destacados
          <span class="spacer"></span>
          <button mat-stroked-button color="primary" (click)="refreshAnuncios()" [disabled]="anunciosLoading">
            <mat-icon>refresh</mat-icon>
            Refrescar
          </button>
        </h2>
        <div *ngIf="anunciosLoading" class="anuncios-loading">Cargando anuncios...</div>
        <div *ngIf="anunciosError" class="anuncios-error">{{ anunciosError }}</div>
        <div *ngIf="!anunciosLoading && !anunciosError && !anunciosPublicos.length" class="anuncios-empty">
          <mat-icon>info</mat-icon> No hay anuncios vigentes en este momento.
        </div>
        <div class="anuncios-scroll" *ngIf="anunciosPublicos.length">
          <div class="anuncio-card" *ngFor="let anuncio of anunciosPublicos" [attr.data-anuncio-id]="anuncio.id">
            <div class="anuncio-media" [ngClass]="anuncio.tipo">
              <img *ngIf="anuncio.imagenUrl && (anuncio.tipo === 'texto-imagen')" [src]="anuncio.imagenUrl" [alt]="anuncio.titulo">
              <video *ngIf="anuncio.videoUrl && (anuncio.tipo === 'video-texto')" [src]="anuncio.videoUrl" muted autoplay loop playsinline></video>
              <div class="anuncio-texto" *ngIf="anuncio.tipo === 'texto' || (!anuncio.imagenUrl && !anuncio.videoUrl)">
                {{ anuncio.contenido }}
              </div>
            </div>
            <div class="anuncio-body">
              <h3>{{ anuncio.titulo }}</h3>
              <p class="anuncio-contenido" *ngIf="anuncio.tipo !== 'texto'">{{ anuncio.contenido }}</p>
              <div class="anuncio-meta">
                <span><mat-icon>schedule</mat-icon> Hasta {{ anuncio.fechaFin | date:'shortDate' }}</span>
                <span *ngIf="anuncio.anunciante"><mat-icon>person</mat-icon> {{ anuncio.anunciante.nombre }}</span>
              </div>
              <a *ngIf="anuncio.enlaceUrl" class="anuncio-link" [href]="anuncio.enlaceUrl" target="_blank" rel="noopener noreferrer">
                Visitar <mat-icon>open_in_new</mat-icon>
              </a>
            </div>
          </div>
        </div>
      </section>

      <div class="cartelera-header">
        <div class="header-content">
          <h1>Cartelera Actual</h1>
          <p class="subtitle">Las mejores películas en la mejor experiencia cinematográfica</p>
        </div>
        <div class="filters">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Buscar películas</mat-label>
            <input matInput placeholder="Título, director..." [(ngModel)]="searchTerm" (ngModelChange)="aplicarFiltros()">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Género</mat-label>
            <mat-select [(ngModel)]="filtroGenero" (ngModelChange)="aplicarFiltros()">
          <mat-option value="">Todos los géneros</mat-option>
          <mat-option value="Acción">Acción</mat-option>
          <mat-option value="Anime">Anime</mat-option>
          <mat-option value="Animación">Animación</mat-option>
          <mat-option value="Aventura">Aventura</mat-option>
          <mat-option value="Ciencia Ficción">Ciencia Ficción</mat-option>
          <mat-option value="Comedia">Comedia</mat-option>
          <mat-option value="Drama">Drama</mat-option>
          <mat-option value="Terror">Terror</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Clasificación</mat-label>
            <mat-select [(ngModel)]="filtroClasificacion" (ngModelChange)="aplicarFiltros()">
              <mat-option value="">Todas</mat-option>
              <mat-option value="G">G - Apta para todo público</mat-option>
              <mat-option value="PG">PG - Se sugiere orientación</mat-option>
              <mat-option value="PG-13">PG-13 - Mayores de 13</mat-option>
              <mat-option value="R">R - Adultos</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-button-toggle-group [(ngModel)]="selectedView" aria-label="Vista">
            <mat-button-toggle value="grid">
              <mat-icon>grid_view</mat-icon>
            </mat-button-toggle>
            <mat-button-toggle value="list">
              <mat-icon>view_list</mat-icon>
            </mat-button-toggle>
          </mat-button-toggle-group>
        </div>
      </div>

      <div class="peliculas-grid" [class.list-view]="selectedView === 'list'">
        <ng-container *ngFor="let item of interleavedPeliculas">
          <!-- Item Película -->
          <mat-card *ngIf="item.kind==='pelicula'" class="pelicula-card"
                    [class.list-card]="selectedView === 'list'">
          <div class="poster-container">
      <img [src]="item.data.posterUrl || 'assets/default-movie.jpg'" [alt]="item.data.titulo"
        class="poster-image" (error)="onPosterError(item.data)">
            <div class="clasificacion-badge">{{item.data.clasificacion}}</div>
          </div>

          <div class="pelicula-info">
            <mat-card-header>
              <mat-card-title>{{item.data.titulo}}</mat-card-title>
              <mat-card-subtitle>
                <mat-chip-listbox>
                  <mat-chip-option *ngFor="let categoria of item.data.categorias?.split(',') || []">
                    {{categoria.trim()}}
                  </mat-chip-option>
                </mat-chip-listbox>
              </mat-card-subtitle>
            </mat-card-header>

            <mat-card-content>
              <p class="sinopsis">{{item.data.sinopsis}}</p>
              <div class="detalles">
                <div class="detalle-item">
                  <mat-icon>person</mat-icon>
                  <span>{{item.data.director}}</span>
                </div>
                <div class="detalle-item">
                  <mat-icon>schedule</mat-icon>
                  <span>{{item.data.duracionMinutos}} min</span>
                </div>
                <div class="detalle-item">
                  <mat-icon>event</mat-icon>
                  <span>{{item.data.estreno | date}}</span>
                </div>
              </div>
            </mat-card-content>

            <mat-card-actions>
              <button mat-raised-button color="accent" class="trailer-btn" (click)="verTrailer(item.data)">
                <mat-icon>play_circle</mat-icon>
                Ver Trailer
              </button>
              <button mat-raised-button color="primary" class="comprar-btn" (click)="comprarBoletos(item.data)">
                <mat-icon>local_activity</mat-icon>
                Comprar Boletos
              </button>
            </mat-card-actions>

            <div class="feedback-section">
              <div class="rating-row">
                <span class="rating-label">Calificar:</span>
                <button mat-icon-button *ngFor="let star of [1,2,3,4,5]" (click)="calificar(item.data, star)" [color]="(item.data.miCalificacion||0) >= star ? 'warn' : ''">
                  <mat-icon>{{ (item.data.miCalificacion||0) >= star ? 'star' : 'star_border' }}</mat-icon>
                </button>
              </div>
              <form (ngSubmit)="comentar(item.data)" class="comentario-form">
                <mat-form-field appearance="outline" class="comentario-field">
                  <mat-label>Comentario</mat-label>
                  <textarea matInput [(ngModel)]="item.data.nuevoComentario" name="comentario{{item.data.id}}" rows="2" placeholder="Escribe tu opinión" ></textarea>
                </mat-form-field>
                <button mat-stroked-button color="primary" type="submit" [disabled]="!item.data.nuevoComentario">Publicar</button>
              </form>
            </div>
          </div>
          </mat-card>

          <!-- Item Anuncio intercalado -->
          <div *ngIf="item.kind==='anuncio'" class="anuncio-inline" [attr.data-anuncio-id]="item.data.id" (click)="trackClick(item.data)" tabindex="0">
            <div class="anuncio-inline-media" [ngClass]="item.data.tipo">
              <img *ngIf="item.data.imagenUrl && (item.data.tipo === 'texto-imagen')" [src]="item.data.imagenUrl" [alt]="item.data.titulo" (error)="onAnuncioMediaError(item.data, 'imagen')">
              <video *ngIf="item.data.videoUrl && (item.data.tipo === 'video-texto')" [src]="item.data.videoUrl" muted autoplay loop playsinline></video>
              <div class="anuncio-inline-texto">
                <strong>{{ item.data.titulo }}</strong> — {{ item.data.contenido }}
              </div>
            </div>
            <a *ngIf="item.data.enlaceUrl" class="anuncio-inline-link" [href]="item.data.enlaceUrl" target="_blank" rel="noopener noreferrer" (click)="$event.stopPropagation(); trackClick(item.data)">
              Visitar <mat-icon>open_in_new</mat-icon>
            </a>
          </div>
        </ng-container>
      </div>

      <mat-paginator [length]="100"
                    [pageSize]="12"
                    [pageSizeOptions]="[6, 12, 24, 48]"
                    (page)="onPageChange($event)">
      </mat-paginator>
    </div>
  `,
  styles: [`
    .cartelera-container {
      padding: 24px;
      background: #ffffff;
      min-height: calc(100vh - 64px);
    }

    /* Anuncios */
    .anuncios-wrapper {
      background: #fafafa;
      padding: 16px 20px 12px;
      border-radius: 12px;
      margin-bottom: 28px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      position: relative;
      overflow: hidden;
      border: 1px solid #e0e0e0;
    }
    .anuncios-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 12px;
      font-size: 20px;
      font-weight: 600;
      color: #000000;
    }
    .spacer { flex: 1; }
    .anuncios-title mat-icon { color: #000000; }
    .anuncios-scroll {
      display: flex;
      gap: 16px;
      overflow-x: auto;
      padding-bottom: 4px;
      scrollbar-width: thin;
    }
    .anuncios-scroll::-webkit-scrollbar { height: 8px; }
    .anuncios-scroll::-webkit-scrollbar-track { background: transparent; }
    .anuncios-scroll::-webkit-scrollbar-thumb { background: #cccccc; border-radius: 4px; }
    .anuncio-card {
      flex: 0 0 280px;
      background: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 10px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
      display: flex;
      flex-direction: column;
      transition: transform .25s ease, box-shadow .25s ease;
      position: relative;
    }
    .anuncio-card:hover { transform: translateY(-4px); box-shadow: 0 6px 16px rgba(0,0,0,0.12); }
    .anuncio-media { width: 100%; position: relative; background:#151515; display:flex; align-items:center; justify-content:center; min-height:120px; }
    .anuncio-media img, .anuncio-media video { width:100%; height:100%; object-fit:cover; border-radius:10px 10px 0 0; }
    .anuncio-texto { padding:12px; font-size:14px; line-height:1.3; color:#fff; width:100%; }
    .anuncio-body { padding:12px 14px 14px; display:flex; flex-direction:column; gap:6px; }
    .anuncio-body h3 { margin:0; font-size:16px; font-weight:600; color:#1a237e; }
    .anuncio-contenido { margin:0; font-size:13px; color:#555; max-height:60px; overflow:hidden; }
    .anuncio-meta { display:flex; flex-wrap:wrap; gap:10px; font-size:11px; color:#666; }
    .anuncio-meta mat-icon { font-size:16px; height:16px; width:16px; margin-right:4px; }
    .anuncio-link { margin-top:4px; font-size:12px; text-decoration:none; display:inline-flex; align-items:center; gap:4px; color:#1565c0; font-weight:500; }
    .anuncios-loading, .anuncios-error, .anuncios-empty { font-size:13px; color:#444; padding:4px 2px 10px 4px; display:flex; align-items:center; gap:6px; }
    .anuncios-error { color:#c62828; }
    .anuncios-empty mat-icon { color:#757575; }

    /* Anuncio inline intercalado */
    .anuncio-inline {
      border: 1px dashed #c5cae9;
      border-radius: 10px;
      padding: 12px;
      background: #f9faff;
      display: flex;
      flex-direction: column;
      gap: 6px;
      cursor: pointer;
      transition: box-shadow .2s ease, transform .2s ease;
    }
    .anuncio-inline:hover { box-shadow: 0 6px 16px rgba(0,0,0,.12); transform: translateY(-2px); }
    .anuncio-inline-media { display:flex; align-items:center; gap:10px; }
    .anuncio-inline-media img, .anuncio-inline-media video { width: 100%; max-height: 160px; object-fit: cover; border-radius: 8px; }
    .anuncio-inline-texto { font-size: 14px; color:#283593; }
    .anuncio-inline-link { align-self: flex-start; font-size: 12px; text-decoration:none; display:inline-flex; align-items:center; gap:4px; color:#1565c0; font-weight:500; }

    .cartelera-header {
      margin-bottom: 32px;
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .header-content {
      text-align: center;
      margin-bottom: 24px;
    }

    h1 {
      color: #1a237e;
      margin: 0;
      font-size: 32px;
      font-weight: 600;
    }

    .subtitle {
      color: #666;
      margin: 8px 0 0;
      font-size: 16px;
    }

    .filters {
      display: flex;
      gap: 16px;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;
    }

    .search-field {
      flex: 1;
      min-width: 240px;
      max-width: 300px;
    }

    .filter-field {
      min-width: 180px;
    }

    .peliculas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }

    .peliculas-grid.list-view {
      grid-template-columns: 1fr;
    }

    .pelicula-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      overflow: hidden;
    }

    .pelicula-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }

    .pelicula-card.list-card {
      flex-direction: row;
      align-items: stretch;
    }

    .poster-container {
      position: relative;
      padding-top: 150%;
      overflow: hidden;
      border-radius: 8px 8px 0 0;
    }

    .list-card .poster-container {
      padding-top: 0;
      width: 200px;
      flex-shrink: 0;
    }

    .poster-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .list-card .poster-image {
      position: relative;
      height: 100%;
    }

    .clasificacion-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: rgba(0,0,0,0.75);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .pelicula-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 16px;
    }

    mat-card-title {
      font-size: 20px;
      margin-bottom: 8px;
      color: #1a237e;
    }

    mat-chip {
      font-size: 12px;
      height: 24px;
      margin: 4px;
    }

    .sinopsis {
      color: #666;
      margin: 16px 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .detalles {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin: 16px 0;
    }

    .detalle-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 14px;
    }

    .detalle-item mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    mat-card-actions {
      display: flex;
      gap: 12px;
      padding: 16px;
      margin: 0;
    }

    .trailer-btn, .comprar-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    mat-paginator {
      background: white;
      border-radius: 8px;
      margin-top: 24px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    @media (max-width: 600px) {
      .filters {
        flex-direction: column;
        align-items: stretch;
      }

      .search-field {
        max-width: none;
      }

      .list-card {
        flex-direction: column;
      }

      .list-card .poster-container {
        width: 100%;
        padding-top: 150%;
      }

      .list-card .poster-image {
        position: absolute;
      }
    }
  `]
})
export class CarteleraComponent implements OnInit, AfterViewInit, OnDestroy {
  peliculas: any[] = [];
  peliculasFiltradas: any[] = [];
  todasLasPeliculas: any[] = [];
  searchTerm: string = '';
  filtroGenero: string = '';
  filtroClasificacion: string = '';
  selectedView: 'grid' | 'list' = 'grid';
  loading = true;
  error: string | null = null;
  token: string | null = null;
  // Estado anuncios públicos
  anunciosPublicos: AnuncioPublico[] = [];
  anunciosLoading = false;
  anunciosError: string | null = null;
  interleavedPeliculas: any[] = []; // mezcla peliculas + anuncios
  interleaveEvery = 4;
  posterFallback = 'assets/images/movie-placeholder.jpg';
  anuncioImagenFallback = 'assets/images/movie-placeholder.jpg';

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private anunciosService: AnunciosPublicosService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.token = localStorage.getItem('token');
    // Suscripciones a servicio anuncios
    this.anunciosService.getAnuncios().subscribe(a => {
      this.anunciosPublicos = a;
      this.buildInterleaved();
      setTimeout(() => this.observarAnuncios(), 100);
    });
    this.anunciosService.isLoading().subscribe(l => this.anunciosLoading = l);
    this.anunciosService.getError().subscribe(e => this.anunciosError = e);
    this.anunciosService.refresh();
    this.loadPeliculas();
  }

  ngAfterViewInit() {
    this.observarAnuncios();
  }

  ngOnDestroy() {
    // Desobservar todos los anuncios al destruir el componente
    const elementos = this.elementRef.nativeElement.querySelectorAll('[data-anuncio-id]');
    elementos.forEach((el: HTMLElement) => this.anunciosService.desobservarAnuncio(el));
  }

  observarAnuncios() {
    // Observar elementos de anuncios para registrar impresiones cuando sean visibles
    setTimeout(() => {
      const elementos = this.elementRef.nativeElement.querySelectorAll('[data-anuncio-id]');
      elementos.forEach((el: HTMLElement) => {
        this.anunciosService.observarAnuncio(el);
      });
    }, 100);
  }

  refreshAnuncios() {
    this.anunciosService.limpiarImpresionesRegistradas();
    this.anunciosService.refresh();
  }

  buildInterleaved() {
    // Crear mezcla intercalando cada N
    const result: any[] = [];
    const peliculas = [...this.peliculas];
    let anuncioIndex = 0;
    for (let i = 0; i < peliculas.length; i++) {
      result.push({ kind: 'pelicula', data: peliculas[i] });
      if ((i + 1) % this.interleaveEvery === 0 && anuncioIndex < this.anunciosPublicos.length) {
        result.push({ kind: 'anuncio', data: this.anunciosPublicos[anuncioIndex++] });
      }
    }
    // Si sobran anuncios añadirlos al final
    while (anuncioIndex < this.anunciosPublicos.length) {
      result.push({ kind: 'anuncio', data: this.anunciosPublicos[anuncioIndex++] });
    }
    this.interleavedPeliculas = result;
    // Re-observar anuncios después de actualizar la lista
    setTimeout(() => this.observarAnuncios(), 100);
  }

  loadPeliculas(page: number = 1) {
    this.loading = true;
    this.error = null;

    this.http.get<any[]>('http://localhost:4000/api/peliculas')
      .subscribe({
        next: (data) => {
          this.todasLasPeliculas = data.map(pelicula => {
            const poster = pelicula.posterUrl || pelicula.imagen || '';
            return {
              ...pelicula,
              posterUrl: this.ensureAbsoluteImageUrl(poster) || 'assets/images/movie-placeholder.jpg'
            };
          });
          this.aplicarFiltros();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error cargando películas:', error);
          this.error = 'No se pudieron cargar las películas. Por favor, intenta de nuevo más tarde.';
          this.loading = false;
          this.snackBar.open('Error al cargar las películas', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  aplicarFiltros() {
    let resultados = [...this.todasLasPeliculas];

    // Filtro por búsqueda
    if (this.searchTerm && this.searchTerm.trim()) {
      const termino = this.normalizeTxt(this.searchTerm);
      resultados = resultados.filter(p =>
        this.normalizeTxt(p.titulo)?.includes(termino) ||
        this.normalizeTxt(p.director)?.includes(termino) ||
        this.normalizeTxt(p.sinopsis)?.includes(termino) ||
        this.normalizeTxt(p.categorias)?.includes(termino) ||
        this.normalizeTxt(p.cast)?.includes(termino)
      );
    }

    // Filtro por género
    if (this.filtroGenero) {
      const genero = this.normalizeTxt(this.filtroGenero);
      resultados = resultados.filter(p => {
        const cats = this.normalizeTxt(p.categorias || '') + ',' + this.normalizeTxt(p.genero || '');
        return cats.split(',').some(c => c.trim() && cats.includes(genero));
      });
    }

    // Filtro por clasificación
    if (this.filtroClasificacion) {
      resultados = resultados.filter(p =>
        p.clasificacion === this.filtroClasificacion
      );
    }

    this.peliculas = resultados;
    // Reconstituir lista intercalada tras filtrar
    this.buildInterleaved();
  }

  onPageChange(event: any) {
    this.loadPeliculas(event.pageIndex + 1);
  }

  verTrailer(pelicula: any) {
    // Aquí iría la lógica para mostrar el trailer
    this.dialog.open(TrailerDialogComponent, {
      data: { pelicula },
      width: '800px',
      maxHeight: '80vh'
    });
  }

  comprarBoletos(pelicula: any) {
    this.dialog.open(ComprarBoletosDialogComponent, {
      data: { pelicula },
      width: '600px',
      maxHeight: '90vh'
    });
  }

  // Tracking clic anuncio
  trackClick(anuncio: AnuncioPublico) {
    this.anunciosService.registrarClick(anuncio.id).subscribe({
      next: () => {},
      error: (e) => console.warn('No se pudo registrar clic', e)
    });
  }

  calificar(pelicula: any, valor: number) {
    if (!this.token) { this.snackBar.open('Inicia sesión para calificar', 'Cerrar', { duration: 3000 }); return; }
    this.http.post('http://localhost:4000/api/calificaciones/pelicula', { peliculaId: pelicula.id, valor }, { headers: { Authorization: `Bearer ${this.token}` } })
      .subscribe({
        next: (res: any) => {
          pelicula.miCalificacion = valor;
          this.snackBar.open('Calificación registrada', 'Cerrar', { duration: 2500 });
        },
        error: err => {
          console.error('Error calificando', err);
          this.snackBar.open(err.error?.msg || 'Error al calificar', 'Cerrar', { duration: 3000 });
        }
      });
  }

  comentar(pelicula: any) {
    if (!this.token) { this.snackBar.open('Inicia sesión para comentar', 'Cerrar', { duration: 3000 }); return; }
    if (!pelicula.nuevoComentario) return;
    const payload = { tipo: 'pelicula', referenciaId: pelicula.id, texto: pelicula.nuevoComentario };
    this.http.post('http://localhost:4000/api/comentarios', payload, { headers: { Authorization: `Bearer ${this.token}` }})
      .subscribe({
        next: (res: any) => {
          this.snackBar.open('Comentario publicado', 'Cerrar', { duration: 2500 });
          pelicula.nuevoComentario = '';
        },
        error: err => {
          console.error('Error comentando', err);
          this.snackBar.open(err.error?.msg || 'No se pudo publicar', 'Cerrar', { duration: 3000 });
        }
      });
  }

  onPosterError(pelicula: any) {
    if (!pelicula) return;
    pelicula.posterUrl = this.posterFallback;
  }

  onAnuncioMediaError(anuncio: any, tipo: 'imagen'|'video') {
    if (!anuncio) return;
    if (tipo === 'imagen') {
      anuncio.imagenUrl = this.anuncioImagenFallback;
    }
  }

  private ensureAbsoluteImageUrl(url: string): string {
    if (!url) return '';
    const trimmed = url.trim();

    // Ya es absoluta o apunta a nuestros assets
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('assets/')) {
      return trimmed;
    }

    // Clave típica de Amazon/IMDb (MV5B....jpg)
    if (/^MV5[B-Z]/i.test(trimmed)) {
      return `https://m.media-amazon.com/images/M/${trimmed}`;
    }

    // Nombre de archivo local (ej: demon-slayer.jpg) -> buscar en assets/movies/
    if (/^[\w.-]+\.(jpg|jpeg|png|webp|gif)$/i.test(trimmed)) {
      return `assets/movies/${trimmed}`;
    }

    // No reconocido -> vacío para forzar placeholder
    return '';
  }

  private normalizeTxt(v: any): string {
    if (!v) return '';
    return String(v)
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}+/gu, '')
      .trim();
  }
}
