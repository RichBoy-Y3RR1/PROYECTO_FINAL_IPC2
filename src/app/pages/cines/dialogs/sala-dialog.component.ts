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
  selector: 'app-sala-dialog',
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
    <h2 mat-dialog-title>{{ data?.sala ? 'Editar' : 'Nueva' }} Sala</h2>
    <form [formGroup]="salaForm" (ngSubmit)="onSubmit()">
      <div mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre de la Sala</mat-label>
          <input matInput formControlName="nombre" placeholder="Ej: Sala 1">
          <mat-error *ngIf="salaForm.get('nombre')?.hasError('required')">
            El nombre es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tipo de Sala</mat-label>
          <mat-select formControlName="tipo">
            <mat-option value="Normal">Normal</mat-option>
            <mat-option value="VIP">VIP</mat-option>
            <mat-option value="3D">3D</mat-option>
            <mat-option value="IMAX">IMAX</mat-option>
            <mat-option value="4DX">4DX</mat-option>
          </mat-select>
          <mat-error *ngIf="salaForm.get('tipo')?.hasError('required')">
            El tipo es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Capacidad</mat-label>
          <input matInput type="number" formControlName="capacidad" placeholder="100">
          <mat-error *ngIf="salaForm.get('capacidad')?.hasError('required')">
            La capacidad es requerida
          </mat-error>
          <mat-error *ngIf="salaForm.get('capacidad')?.hasError('min')">
            La capacidad debe ser mayor a 0
          </mat-error>
        </mat-form-field>

        <p class="info-text">
          <mat-icon>info</mat-icon>
          La sala se creará para el cine: <strong>{{ data.cine.nombre }}</strong>
        </p>
      </div>

      <div mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">
          Cancelar
        </button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!salaForm.valid">
          <mat-icon>save</mat-icon>
          {{ data?.sala ? 'Actualizar' : 'Crear' }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    mat-dialog-content {
      min-width: 450px;
      max-height: 70vh;
      overflow-y: auto;
    }

    .info-text {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background-color: #e3f2fd;
      border-radius: 4px;
      margin-top: 16px;
    }
  `]
})
export class SalaDialogComponent {
  salaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SalaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const sala = data?.sala;
    this.salaForm = this.fb.group({
      nombre: [sala?.nombre || '', Validators.required],
      tipo: [sala?.tipo || 'Normal', Validators.required],
      capacidad: [sala?.capacidad || 100, [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit() {
    if (this.salaForm.valid) {
      this.dialogRef.close({
        ...this.salaForm.value,
        cineId: this.data.cine.id
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
