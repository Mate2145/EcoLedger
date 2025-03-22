export interface UserProfile {
    id: string;
    username: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
    bio?: string;
    joinDate: Date;
    walletAddress?: string;
    carbonActivity: CarbonActivity;
    settings: UserSettings;
  }
  
  export interface CarbonActivity {
    totalCarbonTokens: number;
    totalTransactions: number;
    carbonOffset: number;
    carbonFootprint: number;
    lastActivity?: Date;
  }
  
  export interface UserSettings {
    emailNotifications: boolean;
    twoFactorEnabled: boolean;
    theme: 'light' | 'dark' | 'system';
    language: string;
    privacySettings: {
      showWalletAddress: boolean;
      showCarbonActivity: boolean;
      showTransactionHistory: boolean;
    };
  }
  
  export interface ProfileUpdateRequest {
    fullName?: string;
    bio?: string;
    avatarUrl?: string;
    settings?: Partial<UserSettings>;
  }