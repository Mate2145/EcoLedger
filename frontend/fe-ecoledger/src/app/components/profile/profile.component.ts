import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

// PrimeNG Components
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { AvatarModule } from 'primeng/avatar';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';

// Models and Services
import { UserProfile, UserSettings, ProfileUpdateRequest } from '../../models/user-profile.model';
import { ProfileService } from '../../services/profile.service';
import { WalletService } from '../../services/wallet.service';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TabViewModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    InputSwitchModule,
    DropdownModule,
    AvatarModule,
    ToastModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  userProfile: UserProfile | null = null;
  editableProfile: ProfileUpdateRequest = {};
  
  loading = {
    profile: true,
    updateProfile: false,
    updateSettings: false
  };
  
  themeOptions = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: 'system' }
  ];
  
  languageOptions = [
    { label: 'English', value: 'en' },
    { label: 'Spanish', value: 'es' },
    { label: 'French', value: 'fr' },
    { label: 'German', value: 'de' }
  ];
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private profileService: ProfileService,
    private walletService: WalletService,
    private messageService: MessageService,
    private logger: LoggerService
  ) {}
  
  ngOnInit(): void {
    this.loadUserProfile();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  loadUserProfile(): void {
    this.loading.profile = true;
    
    this.profileService.getUserProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (profile) => {
          this.userProfile = profile;
          this.initEditableProfile();
          this.loading.profile = false;
          this.logger.debug('Profile loaded successfully');
        },
        error: (error) => {
          this.loading.profile = false;
          this.logger.error('Error loading profile', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load profile information'
          });
        }
      });
  }
  
  initEditableProfile(): void {
    if (this.userProfile) {
      this.editableProfile = {
        fullName: this.userProfile.fullName,
        bio: this.userProfile.bio,
        avatarUrl: this.userProfile.avatarUrl,
        settings: { 
          ...this.userProfile.settings,
          privacySettings: { ...this.userProfile.settings.privacySettings }
        }
      };
    }
  }
  
  updateProfile(): void {
    if (!this.userProfile) return;
    
    this.loading.updateProfile = true;
    
    this.profileService.updateUserProfile({
      fullName: this.editableProfile.fullName,
      bio: this.editableProfile.bio,
      avatarUrl: this.editableProfile.avatarUrl
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (profile) => {
          this.userProfile = profile;
          this.loading.updateProfile = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Profile Updated',
            detail: 'Your profile has been updated successfully'
          });
          this.logger.debug('Profile updated successfully');
        },
        error: (error) => {
          this.loading.updateProfile = false;
          this.logger.error('Error updating profile', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update profile information'
          });
        }
      });
  }
  
  updateSettings(): void {
    if (!this.userProfile || !this.editableProfile.settings) return;
    
    this.loading.updateSettings = true;
    
    this.profileService.updateUserSettings(this.editableProfile.settings)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (settings) => {
          if (this.userProfile) {
            this.userProfile.settings = settings;
          }
          this.loading.updateSettings = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Settings Updated',
            detail: 'Your settings have been updated successfully'
          });
          this.logger.debug('Settings updated successfully');
        },
        error: (error) => {
          this.loading.updateSettings = false;
          this.logger.error('Error updating settings', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update settings'
          });
        }
      });
  }
  
  connectWallet(): void {
    // Implement wallet connection logic
    this.messageService.add({
      severity: 'info',
      summary: 'Connect Wallet',
      detail: 'Opening wallet connection dialog...'
    });
  }
  
  disconnectWallet(): void {
    this.walletService.disconnectWallet();
    this.messageService.add({
      severity: 'info',
      summary: 'Wallet Disconnected',
      detail: 'Your wallet has been disconnected'
    });
  }
  
  getShortAddress(address: string | undefined): string {
    if (!address) return 'Not connected';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }
  
  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  updatePrivacySetting(setting: string, value: boolean): void {
    if (!this.editableProfile.settings) {
      this.editableProfile.settings = { ...this.userProfile?.settings! };
    }
    if (!this.editableProfile.settings.privacySettings) {
      this.editableProfile.settings.privacySettings = { ...this.userProfile?.settings?.privacySettings! };
    }
    this.editableProfile.settings.privacySettings[setting as keyof typeof this.editableProfile.settings.privacySettings] = value;
  }
}