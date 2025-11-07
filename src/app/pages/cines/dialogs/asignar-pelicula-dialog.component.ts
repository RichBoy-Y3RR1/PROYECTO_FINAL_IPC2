import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-asignar-pelicula-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>Asignar Película a Sala</h2>
    <form [formGroup]="funcionForm" (ngSubmit)="onSubmit()">
      <div mat-dialog-content>
        <p class="info-text">
          <mat-icon>info</mat-icon>
          Cine: <strong>{{ data.cine.nombre }}</strong> | 
          Sala: <strong>{{ data.sala.nombre }}</strong>
        </p>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Película</mat-label>
          <mat-select formControlName="peliculaId">
            <mat-option *ngFor="let pelicula of peliculas" [value]="pelicula.id">
              {{ pelicula.titulo }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="funcionForm.get('peliculaId')?.hasError('required')">
            Selecciona una película
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Fecha</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="fecha">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error *ngIf="funcionForm.get('fecha')?.hasError('required')">
            La fecha es requerida
          </mat-error>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Hora</mat-label>
            <input matInput type="time" formControlName="hora" placeholder="19:30">
            <mat-error *ngIf="funcionForm.get('hora')?.hasError('required')">
              La hora es requerida
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Precio (GTQ)</mat-label>
            <input matInput type="number" formControlName="precio" placeholder="50.00">
            <mat-icon matSuffix>attach_money</mat-icon>
            <mat-error *ngIf="funcionForm.get('precio')?.hasError('required')">
              El precio es requerido
            </mat-error>
          </mat-form-field>
        </div>
      </div>

      <div mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">
          Cancelar
        </button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!funcionForm.valid || loading">
          <mat-icon>{{ loading ? 'hourglass_empty' : 'check' }}</mat-icon>
          {{ loading ? 'Asignando...' : 'Asignar' }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .half-width {
      flex: 1;
    }

    mat-dialog-content {
      min-width: 500px;
      max-height: 70vh;
      overflow-y: auto;
    }

    .info-text {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #e3f2fd;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 16px;
      color: #1565c0;
    }

    .info-text mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
  `]
})
export class AsignarPeliculaDialogComponent implements OnInit {
  funcionForm: FormGroup;
  peliculas: any[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<AsignarPeliculaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.funcionForm = this.fb.group({
      peliculaId: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      precio: [50, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.cargarPeliculas();
  }

  cargarPeliculas() {
    this.http.get<any[]>('http://localhost:4000/api/peliculas').subscribe({
      next: (data) => {
        this.peliculas = data;
      },
      error: (err) => {
        console.error('Error cargando películas:', err);
      }
    });
  }

  onSubmit() {
    if (this.funcionForm.valid && !this.loading) {
      this.loading = true;
      const formValue = this.funcionForm.value;
      
      // Formatear fecha a YYYY-MM-DD
      const fecha = new Date(formValue.fecha);
      const fechaStr = fecha.toISOString().split('T')[0];

      const payload = {
        peliculaId: formValue.peliculaId,
        salaId: this.data.sala.id,
        cineId: this.data.cine.id,
        fecha: fechaStr,
        hora: formValue.hora,
        precio: parseFloat(formValue.precio)
      };

      this.dialogRef.close(payload);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
