import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../services/api';

export interface UserDialogData {
  user?: User;
}

@Component({
  selector: 'app-user-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    ReactiveFormsModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.user ? 'Edit User' : 'Add User' }}</h2>

    <mat-dialog-content>
      <form [formGroup]="userForm" class="user-form">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" placeholder="User name">
          <mat-error *ngIf="userForm.get('name')?.invalid && userForm.get('name')?.touched">
            Name is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" placeholder="user@example.com">
          <mat-error *ngIf="userForm.get('email')?.invalid && userForm.get('email')?.touched">
            Valid email is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Phone</mat-label>
          <input matInput formControlName="phone" placeholder="Phone number">
          <mat-error *ngIf="userForm.get('phone')?.invalid && userForm.get('phone')?.touched">
            Phone is required
          </mat-error>
        </mat-form-field>

        @if (!data.user) {
          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput formControlName="password" type="password" placeholder="Password">
            <mat-error *ngIf="userForm.get('password')?.invalid && userForm.get('password')?.touched">
              Password is required
            </mat-error>
          </mat-form-field>
        }

        <mat-slide-toggle formControlName="isAdmin">
          Admin privileges
        </mat-slide-toggle>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="userForm.invalid">
        {{ data.user ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .user-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 400px;
      padding-top: 16px;
    }

    mat-form-field {
      width: 100%;
    }

    mat-slide-toggle {
      margin-top: 8px;
    }
  `]
})
export class UserDialogComponent {
  fb = inject(NonNullableFormBuilder);
  dialogRef = inject(MatDialogRef<UserDialogComponent>);

  userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    password: [''],
    isAdmin: [false]
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: UserDialogData) {
    if (data.user) {
      this.userForm.patchValue(data.user);
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
    } else {
      this.userForm.get('password')?.setValidators(Validators.required);
    }
  }

  save() {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      this.dialogRef.close(userData);
    }
  }
}