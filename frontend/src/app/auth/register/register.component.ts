import { Router, RouterLink } from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {merge} from 'rxjs';
@Component({
  selector: 'app-register',
  standalone: true, 
  imports: [RouterLink,MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatIconModule], 
  template: `
  <div class="example-container">
  <mat-form-field>
    <mat-label>Enter your email</mat-label>
    <input
      matInput
      placeholder="pat@example.com"
      [formControl]="email"
      (blur)="updateErrorMessage()"
      required
    />
    @if (email.invalid) {
      <mat-error>{{errorMessage()}}</mat-error>
    }
  </mat-form-field>
</div>

    <a routerLink="/login">Sei già registrato? Accedi</a>
  `,
  styleUrls: ['./register.component.scss']
})


export class RegisterComponent {
  constructor(private router: Router) {
    merge(this.email.statusChanges, this.email.valueChanges)
    .pipe(takeUntilDestroyed())
    .subscribe(() => this.updateErrorMessage());
   }
  readonly email = new FormControl('', [Validators.required, Validators.email]);

  errorMessage = signal('');
  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }
}
