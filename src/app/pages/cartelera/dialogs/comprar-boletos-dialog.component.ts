import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-comprar-boletos-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="compra-container">
      <div class="compra-header">
        <h2>Comprar Boletos - {{ data.pelicula.titulo }}</h2>
        <button mat-icon-button (click)="cerrar()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <form [formGroup]="form" (ngSubmit)="comprar()">
        <div class="pelicula-info">
          <img [src]="data.pelicula.posterUrl" [alt]="data.pelicula.titulo">
          <div class="info-text">
            <p class="clasificacion">{{ data.pelicula.clasificacion }}</p>
            <p class="duracion">{{ data.pelicula.duracionMinutos }} minutos</p>
          </div>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Función</mat-label>
          <mat-select formControlName="funcionId">
            <mat-option *ngFor="let funcion of funciones" [value]="funcion.id">
              {{ funcion.fecha | date:'fullDate' }} - {{ funcion.hora }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Cantidad de Boletos</mat-label>
          <input matInput type="number" min="1" max="10" formControlName="cantidad">
          <mat-hint>Máximo 10 boletos por compra</mat-hint>
        </mat-form-field>

        <div class="resumen">
          <h3>Resumen de Compra</h3>
          <div class="resumen-item">
            <span>Precio por boleto:</span>
            <span>Q{{ getPrecioPorBoleto() }}</span>
          </div>
          <div class="resumen-item">
            <span>Cantidad:</span>
            <span>{{ form.get('cantidad')?.value || 0 }}</span>
          </div>
          <div class="resumen-item total">
            <span>Total:</span>
            <span>Q{{ getTotal() }}</span>
          </div>
        </div>

        <div class="actions">
          <button mat-button type="button" (click)="cerrar()">Cancelar</button>
          <button mat-raised-button color="primary" type="submit"
                  [disabled]="form.invalid || loading">
            <mat-icon>shopping_cart</mat-icon>
            Confirmar Compra
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .compra-container {
      padding: 24px;
      max-width: 500px;
    }

    .compra-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    h2 {
      margin: 0;
      font-size: 24px;
      color: #1a237e;
    }

    .pelicula-info {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;
    }

    .pelicula-info img {
      width: 100px;
      height: 150px;
      object-fit: cover;
      border-radius: 4px;
    }

    .info-text {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .clasificacion {
      font-size: 14px;
      color: #666;
      margin: 0;
    }

    .duracion {
      font-size: 14px;
      color: #666;
      margin: 8px 0 0;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .resumen {
      background: #f8f9fa;
      padding: 16px;
      border-radius: 8px;
      margin: 24px 0;
    }

    .resumen h3 {
      margin: 0 0 16px;
      color: #1a237e;
    }

    .resumen-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      color: #666;
    }

    .total {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #ddd;
      font-weight: bold;
      color: #1a237e;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 24px;
    }
  `]
})
export class ComprarBoletosDialogComponent {
  form: FormGroup;
  funciones: any[] = [];
  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { pelicula: any },
    private dialogRef: MatDialogRef<ComprarBoletosDialogComponent>,
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      funcionId: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1), Validators.max(10)]]
    });

    this.cargarFunciones();
  }

  cargarFunciones() {
    this.http.get<any[]>(`http://localhost:3000/api/funciones/pelicula/${this.data.pelicula.id}`)
      .subscribe({
        next: (funciones) => this.funciones = funciones,
        error: (error) => {
          console.error('Error cargando funciones:', error);
          this.snackBar.open('Error al cargar las funciones disponibles', 'Cerrar', {
            duration: 5000
          });
        }
      });
  }

  getPrecioPorBoleto(): number {
    const funcionId = this.form.get('funcionId')?.value;
    const funcion = this.funciones.find(f => f.id === funcionId);
    return funcion?.precio || 0;
  }

  getTotal(): number {
    const cantidad = this.form.get('cantidad')?.value || 0;
    return this.getPrecioPorBoleto() * cantidad;
  }

  comprar() {
    if (this.form.invalid) return;

    this.loading = true;
    const compra = {
      ...this.form.value,
      peliculaId: this.data.pelicula.id
    };

    this.http.post('http://localhost:3000/api/boletos', compra)
      .subscribe({
        next: () => {
          this.snackBar.open('¡Compra realizada con éxito! 🎉', 'Cerrar', {
            duration: 5000
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error en la compra:', error);
          this.snackBar.open('Error al procesar la compra', 'Cerrar', {
            duration: 5000
          });
          this.loading = false;
        }
      });
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
