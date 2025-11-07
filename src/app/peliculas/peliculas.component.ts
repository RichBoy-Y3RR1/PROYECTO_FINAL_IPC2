import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';

interface Pelicula {
  id: number;
  titulo: string;
  imagen: string;
  sinopsis: string;
}

@Component({
  selector: 'app-peliculas',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatGridListModule],
  template: `
    <div class="movies-grid">
      <mat-card *ngFor="let pelicula of peliculas">
        <img mat-card-image src="assets/movies/{{pelicula.imagen}}" alt="{{pelicula.titulo}}">
        <mat-card-header>
          <mat-card-title>{{pelicula.titulo}}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>{{pelicula.sinopsis}}</p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary">Ver Detalles</button>
          <button mat-button color="accent">Comprar Boletos</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .movies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      padding: 20px;
    }
    mat-card {
      margin-bottom: 20px;
    }
    mat-card-actions {
      display: flex;
      justify-content: space-between;
      padding: 16px;
    }
    img {
      height: 400px;
      object-fit: cover;
    }
  `]
})
export class PeliculasComponent implements OnInit {
  peliculas: Pelicula[] = [
    {
      id: 1,
      titulo: "Demon Slayer: Infinity Train",
      imagen: "demon-slayer.jpg",
      sinopsis: "Tanjiro y sus compañeros se unen al Hashira de la Llama Kyojuro Rengoku para investigar una misteriosa serie de desapariciones en un tren..."
    },
    {
      id: 2,
      titulo: "Your Name",
      imagen: "your-name.jpg",
      sinopsis: "Dos estudiantes descubren que están conectados misteriosamente. Cuando sus cuerpos se intercambian, comienza una historia única..."
    },
    {
      id: 3,
      titulo: "Mi Vecino Totoro",
      imagen: "totoro.jpg",
      sinopsis: "Dos niñas se mudan al campo con su padre y descubren criaturas mágicas y aventuras maravillosas en su nuevo hogar..."
    }
  ];

  ngOnInit() {
    // Aquí podrías cargar las películas desde un servicio
  }
}