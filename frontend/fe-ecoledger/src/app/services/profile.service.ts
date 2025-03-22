import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { UserProfile, ProfileUpdateRequest, CarbonActivity, UserSettings } from '../models/user-profile.model';
import { LoggerService } from './logger.service';
import { AuthService } from './auth.service';
import { WalletService } from './wallet.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private mockUserProfile: UserProfile | null = null;

  constructor(
    private logger: LoggerService,
    private authService: AuthService,
    private walletService: WalletService
  ) {
    this.initializeMockProfile();
  }

  /**
   * Get the current user's profile
   */
  getUserProfile(): Observable<UserProfile> {
    this.logger.debug('Fetching user profile');
    
    // In a real application, this would make an API call
    return of(this.mockUserProfile!)
      .pipe(
        delay(800), // Simulate network delay
        tap(profile => this.logger.debug('User profile fetched', { userId: profile.id }))
      );
  }

  /**
   * Update the user's profile
   */
  updateUserProfile(updateRequest: ProfileUpdateRequest): Observable<UserProfile> {
    this.logger.debug('Updating user profile', updateRequest);
    
    if (!this.mockUserProfile) {
      return throwError(() => new Error('User profile not found'));
    }
    
    // Update the mock profile
    this.mockUserProfile = {
      ...this.mockUserProfile,
      ...updateRequest,
      settings: {
        ...this.mockUserProfile.settings,
        ...(updateRequest.settings || {})
      }
    };
    
    // In a real application, this would make an API call
    return of(this.mockUserProfile)
      .pipe(
        delay(1000), // Simulate network delay
        tap(profile => this.logger.debug('User profile updated', { userId: profile.id }))
      );
  }

  /**
   * Get the user's carbon activity
   */
  getCarbonActivity(): Observable<CarbonActivity> {
    this.logger.debug('Fetching carbon activity');
    
    if (!this.mockUserProfile) {
      return throwError(() => new Error('User profile not found'));
    }
    
    // In a real application, this would make an API call
    return of(this.mockUserProfile.carbonActivity)
      .pipe(
        delay(800), // Simulate network delay
        tap(activity => this.logger.debug('Carbon activity fetched', { 
          totalTokens: activity.totalCarbonTokens,
          offset: activity.carbonOffset
        }))
      );
  }

  /**
   * Get the user's settings
   */
  getUserSettings(): Observable<UserSettings> {
    this.logger.debug('Fetching user settings');
    
    if (!this.mockUserProfile) {
      return throwError(() => new Error('User profile not found'));
    }
    
    // In a real application, this would make an API call
    return of(this.mockUserProfile.settings)
      .pipe(
        delay(500), // Simulate network delay
        tap(() => this.logger.debug('User settings fetched'))
      );
  }

  /**
   * Update the user's settings
   */
  updateUserSettings(settings: Partial<UserSettings>): Observable<UserSettings> {
    this.logger.debug('Updating user settings', settings);
    
    if (!this.mockUserProfile) {
      return throwError(() => new Error('User profile not found'));
    }
    
    // Update the mock settings
    this.mockUserProfile.settings = {
      ...this.mockUserProfile.settings,
      ...settings
    };
    
    // In a real application, this would make an API call
    return of(this.mockUserProfile.settings)
      .pipe(
        delay(800), // Simulate network delay
        tap(() => this.logger.debug('User settings updated'))
      );
  }

  /**
   * Initialize mock user profile data
   */
  private initializeMockProfile(): void {
    // Subscribe to wallet service to get the wallet address
    this.walletService.wallet$.subscribe(wallet => {
      const walletAddress = wallet?.address || undefined;
      
      this.mockUserProfile = {
        id: '123456',
        username: 'johndoe',
        email: 'john.doe@example.com',
        fullName: 'John Doe',
        avatarUrl: 'assets/images/avatar-placeholder.png',
        bio: 'Passionate about sustainability and reducing carbon footprint.',
        joinDate: new Date('2023-01-15'),
        walletAddress,
        carbonActivity: {
          totalCarbonTokens: 250,
          totalTransactions: 12,
          carbonOffset: 15.75,
          carbonFootprint: 8.25,
          lastActivity: new Date('2023-06-10')
        },
        settings: {
          emailNotifications: true,
          twoFactorEnabled: false,
          theme: 'system',
          language: 'en',
          privacySettings: {
            showWalletAddress: true,
            showCarbonActivity: true,
            showTransactionHistory: true
          }
        }
      };
    });
  }
}