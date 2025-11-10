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
  selector: 'app-cine-dialog',
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
    <h2 mat-dialog-title>{{ data ? 'Editar' : 'Nuevo' }} Cine</h2>
    <form [formGroup]="cineForm" (ngSubmit)="onSubmit()">
      <div mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre del Cine</mat-label>
          <input matInput formControlName="nombre" placeholder="Ej: CineHub Guatemala">
          <mat-error *ngIf="cineForm.get('nombre')?.hasError('required')">
            El nombre es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Dirección</mat-label>
          <textarea matInput formControlName="direccion" rows="2"
                    placeholder="Dirección completa del cine"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Teléfono</mat-label>
          <input matInput formControlName="telefono" placeholder="2222-2222">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" placeholder="contacto@cine.com">
        </mat-form-field>
      </div>

      <div mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">
          Cancelar
        </button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!cineForm.valid">
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

    mat-dialog-content {
      min-width: 450px;
      max-height: 70vh;
      overflow-y: auto;
    }
  `]
})
export class CineDialogComponent {
  cineForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CineDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.cineForm = this.fb.group({
      nombre: [data?.nombre || '', Validators.required],
      direccion: [data?.direccion || ''],
      telefono: [data?.telefono || ''],
      email: [data?.email || '', Validators.email]
    });
  }

  onSubmit() {
    if (this.cineForm.valid) {
      this.dialogRef.close(this.cineForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
