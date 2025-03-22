import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG Components
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Services
import { AuthService } from '../../services/auth.service';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService,
    private logger: LoggerService
  ) {
    this.logger.debug('LoginComponent initialized');
  }

  ngOnInit(): void {
    // Check if user is already logged in
    if (this.authService.isLoggedIn()) {
      this.logger.info('User already logged in, redirecting');
      // Redirect to dashboard or home page
      // this.router.navigate(['/dashboard']);
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    
    this.logger.debug('Login form initialized');
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.logger.warn('Login form submission attempted with invalid data');
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { email, password } = this.loginForm.value;
    
    this.logger.info(`Login attempt for ${email}`);
    
    this.authService.login(email, password).subscribe({
      next: (user) => {
        this.logger.info('Login successful', { id: user.id, email: user.email });
        
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Logged in successfully!'
        });
        
        // Navigate to dashboard or home page after successful login
        // this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.logger.error('Login failed', error);
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid email or password'
        });
      },
      complete: () => {
        this.loading = false;
        this.logger.debug('Login process completed');
      }
    });
  }
}