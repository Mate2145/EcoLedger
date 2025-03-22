import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LedgerUser } from '../models/ledger-user';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private router: Router,
    private logger: LoggerService
  ) {
    this.logger.info('AuthService initialized');
  }

  /**
   * Get the currently logged in user
   */
  getCurrentUser(): LedgerUser | null {
    const user = LedgerUser.getFromLocalStorage();
    this.logger.debug('Getting current user', user ? { id: user.id, email: user.email } : 'No user found');
    return user;
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    const isLoggedIn = LedgerUser.isLoggedIn();
    this.logger.debug(`User is logged in: ${isLoggedIn}`);
    return isLoggedIn;
  }

  /**
   * Login with email and password
   * @param email User email
   * @param password User password
   */
  login(email: string, password: string): Observable<LedgerUser> {
    this.logger.info(`Attempting login for user: ${email}`);
    
    // This is a simulation - in a real app, you would call your API
    return new Observable<LedgerUser>(observer => {
      setTimeout(() => {
        // Simulate successful login (in real app, validate credentials with backend)
        if (email && password) {
          // Create user with data that would come from backend
          const user = new LedgerUser(
            'user_' + Math.random().toString(36).substr(2, 9),
            'John',
            'Doe',
            'ID12345678',
            '+1234567890',
            email,
            'uploads/land_certificate.pdf'
          );
          
          // Save to localStorage
          user.saveToLocalStorage();
          
          this.logger.info('Login successful', { id: user.id, email: user.email });
          observer.next(user);
          observer.complete();
        } else {
          this.logger.error('Login failed: Invalid credentials');
          observer.error('Invalid credentials');
        }
      }, 1500);
    });
  }

  /**
   * Register a new user
   * @param user User data for registration
   */
  register(user: LedgerUser): Observable<LedgerUser> {
    this.logger.info('Registering new user', { email: user.email });
    
    // This is a simulation - in a real app, you would call your API
    return new Observable<LedgerUser>(observer => {
      setTimeout(() => {
        try {
          // Simulate backend assigning an ID
          user.id = 'user_' + Math.random().toString(36).substr(2, 9);
          
          // Save to localStorage
          user.saveToLocalStorage();
          
          this.logger.info('Registration successful', { id: user.id, email: user.email });
          observer.next(user);
          observer.complete();
        } catch (error) {
          this.logger.error('Registration failed', error);
          observer.error(error);
        }
      }, 1500);
    });
  }

  /**
   * Logout the current user
   */
  logout(): void {
    const user = this.getCurrentUser();
    if (user) {
      this.logger.info('Logging out user', { id: user.id, email: user.email });
    }
    
    LedgerUser.removeFromLocalStorage();
    this.router.navigate(['/login']);
  }
}