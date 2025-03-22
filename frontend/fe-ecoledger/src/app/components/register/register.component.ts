import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG Components
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { StepsModule } from 'primeng/steps';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';

// Models and Services
import { LedgerUser } from '../../models/ledger-user';
import { AuthService } from '../../services/auth.service';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
    StepsModule,
    CardModule,
    FileUploadModule
  ],
  providers: [MessageService],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  user: LedgerUser = new LedgerUser();
  currentStep: number = 0;
  isSubmitting: boolean = false;
  registrationComplete: boolean = false;
  
  personalDetailsForm!: FormGroup;

  steps = [
    { label: 'Personal Details' },
    { label: 'Proof of Land' },
    { label: 'Confirmation' }
  ];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService,
    private logger: LoggerService
  ) {
    this.logger.debug('RegisterComponent initialized');
  }

  ngOnInit(): void {
    // Check if user is already logged in
    if (this.authService.isLoggedIn()) {
      this.logger.info('User already logged in, redirecting');
      // Redirect to dashboard or home page
      // this.router.navigate(['/dashboard']);
    }

    this.personalDetailsForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      idNumber: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
    
    this.logger.debug('Registration form initialized');
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    
    return null;
  }

  nextStep(): void {
    if (this.currentStep === 0) {
      if (this.personalDetailsForm.invalid) {
        this.logger.warn('Personal details form is invalid');
        this.personalDetailsForm.markAllAsTouched();
        this.messageService.add({
          severity: 'error',
          summary: 'Incomplete Information',
          detail: 'Please fill in all personal details before proceeding.'
        });
        return;
      }
      
      // Update user object with form values
      const formValues = this.personalDetailsForm.value;
      this.user.firstName = formValues.firstName;
      this.user.lastName = formValues.lastName;
      this.user.idNumber = formValues.idNumber;
      this.user.phone = formValues.phone;
      this.user.email = formValues.email;
      
      // Store password temporarily
      // @ts-ignore - Adding a temporary property
      this.user.password = formValues.password;
      
      this.logger.info('Personal details completed', { email: this.user.email });
    }
    
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.logger.debug(`Moving to step ${this.currentStep}: ${this.steps[this.currentStep].label}`);
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.logger.debug(`Moving back to step ${this.currentStep}: ${this.steps[this.currentStep].label}`);
    }
  }

  onFileUpload(event: any): void {
    const file = event.files[0];
    this.logger.info('File upload initiated', { fileName: file.name, fileSize: file.size });
    
    // Simulate file upload
    setTimeout(() => {
      this.user.proofOfLand = `uploads/${file.name}`;
      this.logger.info('File uploaded successfully', { filePath: this.user.proofOfLand });
      
      this.messageService.add({
        severity: 'success',
        summary: 'File Uploaded',
        detail: 'Your proof of land certificate has been uploaded successfully.'
      });
    }, 1000);
  }

  submitRegistration(): void {
    if (!this.user.isRegistrationComplete()) {
      this.logger.warn('Registration submission attempted with incomplete data');
      this.messageService.add({
        severity: 'error',
        summary: 'Incomplete Registration',
        detail: 'Please complete all steps before submitting.'
      });
      return;
    }

    this.isSubmitting = true;
    this.logger.info('Submitting registration', { email: this.user.email });
    
    this.authService.register(this.user).subscribe({
      next: (registeredUser) => {
        this.registrationComplete = true;
        this.currentStep = 2; // Move to confirmation step
        
        this.logger.info('Registration successful', { id: registeredUser.id, email: registeredUser.email });
        
        this.messageService.add({
          severity: 'success',
          summary: 'Registration Successful',
          detail: 'Your registration has been submitted for review.'
        });
      },
      error: (error) => {
        this.logger.error('Registration failed', error);
        
        this.messageService.add({
          severity: 'error',
          summary: 'Registration Failed',
          detail: 'There was an error submitting your registration. Please try again.'
        });
      },
      complete: () => {
        this.isSubmitting = false;
        this.logger.debug('Registration process completed');
      }
    });
  }

  goToLogin(): void {
    this.logger.debug('Navigating to login page');
    this.router.navigate(['/login']);
  }
}