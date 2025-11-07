import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


@Component({
  selector: 'app-crear-anuncio',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar' : 'Crear' }} Anuncio</h2>
    <form [formGroup]="anuncioForm" (ngSubmit)="onSubmit()">
      <div mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tipo de Anuncio</mat-label>
          <mat-select formControlName="tipo">
            <mat-option value="TEXTO">Solo Texto</mat-option>
            <mat-option value="TEXTO_IMAGEN">Texto e Imagen</mat-option>
            <mat-option value="VIDEO_TEXTO">Video y Texto</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Contenido de Texto</mat-label>
          <textarea matInput formControlName="contenido" rows="4"></textarea>
        </mat-form-field>

        <ng-container *ngIf="anuncioForm.get('tipo')?.value === 'TEXTO_IMAGEN'">
          <div class="imagen-upload">
            <button type="button" mat-stroked-button (click)="fileInput.click()">
              <mat-icon>cloud_upload</mat-icon>
              Subir Imagen
            </button>
            <input hidden (change)="onFileSelected($event)" #fileInput type="file" accept="image/*">
            <span *ngIf="imagenSeleccionada">{{imagenSeleccionada.name}}</span>
          </div>
        </ng-container>

        <ng-container *ngIf="anuncioForm.get('tipo')?.value === 'VIDEO_TEXTO'">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>URL del Video (YouTube)</mat-label>
            <input matInput formControlName="videoUrl" placeholder="https://youtube.com/...">
          </mat-form-field>
        </ng-container>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Período de Tiempo</mat-label>
          <mat-select formControlName="periodoTiempo">
            <mat-option value="1_DIA">1 día</mat-option>
            <mat-option value="3_DIAS">3 días</mat-option>
            <mat-option value="1_SEMANA">1 semana</mat-option>
            <mat-option value="2_SEMANAS">2 semanas</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Fecha de Inicio</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="fechaInicio">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <div class="costo-info" *ngIf="costoCalculado">
          <mat-icon>attach_money</mat-icon>
          <span>Costo estimado: Q{{costoCalculado}}</span>
        </div>
      </div>

      <div mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!anuncioForm.valid">
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

    .imagen-upload {
      margin-bottom: 16px;
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .costo-info {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      margin-top: 16px;
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }
  `]
})
export class CrearAnuncioComponent {
  anuncioForm: FormGroup;
  imagenSeleccionada: File | null = null;
  costoCalculado: number = 0;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CrearAnuncioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.anuncioForm = this.fb.group({
      tipo: ['TEXTO', Validators.required],
      contenido: ['', Validators.required],
      videoUrl: [''],
      periodoTiempo: ['1_DIA', Validators.required],
      fechaInicio: [new Date(), Validators.required]
    });

    // Escuchar cambios para recalcular costo
    this.anuncioForm.valueChanges.subscribe(() => {
      this.calcularCosto();
    });

    if (data) {
      this.anuncioForm.patchValue(data);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.imagenSeleccionada = input.files[0];
      this.calcularCosto();
    }
  }

  calcularCosto() {
    const tipo = this.anuncioForm.get('tipo')?.value;
    const periodo = this.anuncioForm.get('periodoTiempo')?.value;

    // Costos base por tipo
    const costosPorTipo: Record<string, number> = {
      'TEXTO': 50,
      'TEXTO_IMAGEN': 100,
      'VIDEO_TEXTO': 150
    };

    // Multiplicadores por período
    const multiplicadoresPeriodo: Record<string, number> = {
      '1_DIA': 1,
      '3_DIAS': 2.5,
      '1_SEMANA': 5,
      '2_SEMANAS': 8
    };

    const costoBase = costosPorTipo[tipo] ?? 0;
    const multiplicador = multiplicadoresPeriodo[periodo] ?? 1;

    this.costoCalculado = costoBase * multiplicador;
  }

  onSubmit() {
    if (this.anuncioForm.valid) {
      const formData = new FormData();
      Object.keys(this.anuncioForm.value).forEach(key => {
        formData.append(key, this.anuncioForm.value[key]);
      });

      if (this.imagenSeleccionada) {
        formData.append('imagen', this.imagenSeleccionada);
      }

      this.dialogRef.close(formData);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
