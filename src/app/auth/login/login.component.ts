import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

interface LoginForm {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  protected isLoading: boolean = false;
  protected error?: string;
  protected loginForm: FormGroup = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  login() {
    if (this.loginForm.valid) {
      const loginFormValue = this.loginForm.value as LoginForm;

      const result = this.authService.login(
        loginFormValue.username,
        loginFormValue.password
      );

      this.isLoading = true;

      result.subscribe({
        next: (res) => {
          this.error = undefined;

          this.authService.saveToken(res.accessToken);

          this.isLoading = false;

          this.router.navigate(['/spots']);
        },
        error: (err) => {
          this.error = err.error.message;

          this.isLoading = false;
        },
      });
    }
  }
}
