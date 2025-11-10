import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pelicula-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar' : 'Nueva' }} Película</h2>
    <form [formGroup]="peliculaForm" (ngSubmit)="onSubmit()">
      <div mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Título</mat-label>
          <input matInput formControlName="titulo" placeholder="Título de la película">
          <mat-error *ngIf="peliculaForm.get('titulo')?.hasError('required')">
            El título es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descripción</mat-label>
          <textarea matInput formControlName="descripcion" rows="3"
                    placeholder="Descripción de la película"></textarea>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Duración (minutos)</mat-label>
            <input matInput type="number" formControlName="duracion" placeholder="120">
            <mat-error *ngIf="peliculaForm.get('duracion')?.hasError('required')">
              La duración es requerida
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Género</mat-label>
            <mat-select formControlName="genero">
              <mat-option value="Acción">Acción</mat-option>
              <mat-option value="Aventura">Aventura</mat-option>
              <mat-option value="Comedia">Comedia</mat-option>
              <mat-option value="Drama">Drama</mat-option>
              <mat-option value="Terror">Terror</mat-option>
              <mat-option value="Ciencia Ficción">Ciencia Ficción</mat-option>
              <mat-option value="Romance">Romance</mat-option>
              <mat-option value="Animación">Animación</mat-option>
              <mat-option value="Documental">Documental</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Director</mat-label>
            <input matInput formControlName="director" placeholder="Nombre del director">
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Año</mat-label>
            <input matInput type="number" formControlName="anio" placeholder="2024">
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Imagen URL</mat-label>
          <input matInput formControlName="imagen" placeholder="https://ejemplo.com/imagen.jpg">
          <mat-icon matSuffix>image</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Categorías (separadas por comas)</mat-label>
          <input matInput formControlName="categorias" placeholder="Acción, Aventura">
        </mat-form-field>
      </div>

      <div mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">
          Cancelar
        </button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!peliculaForm.valid">
          <mat-icon>save</mat-icon>
          {{ data ? 'Actualizar' : 'Crear' }}
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
  `]
})
export class PeliculaDialogComponent {
  peliculaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PeliculaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.peliculaForm = this.fb.group({
      titulo: [data?.titulo || '', Validators.required],
      descripcion: [data?.descripcion || ''],
      duracion: [data?.duracion || '', Validators.required],
      genero: [data?.genero || ''],
      director: [data?.director || ''],
      anio: [data?.anio || new Date().getFullYear()],
      imagen: [data?.imagen || ''],
      categorias: [data?.categorias || '']
    });
  }

  onSubmit() {
    if (this.peliculaForm.valid) {
      this.dialogRef.close(this.peliculaForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
