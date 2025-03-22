import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// PrimeNG Components
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';

// Models
import { CarbonOfferSummary, OfferStatus } from '../../models/carbon-offer.model';
import { TransactionSummary, TransactionStatus, TransactionType } from '../../models/carbon-transaction.model';
import { WalletBalance } from '../../models/wallet-balance.model';
import { WalletType } from '../../services/wallet.service';

// Services
import { CarbonMarketplaceService } from '../../services/carbon-marketplace.service';
import { LoggerService } from '../../services/logger.service';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-carbon-marketplace',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    CardModule,
    DialogModule,
    InputNumberModule,
    ToastModule,
    TabViewModule,
    TagModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService],
  templateUrl: './carbon-marketplace.component.html',
  styleUrls: ['./carbon-marketplace.component.scss']
})
export class CarbonMarketplaceComponent implements OnInit, OnDestroy {
  offers: CarbonOfferSummary[] = [];
  transactions: TransactionSummary[] = [];
  walletBalance: WalletBalance | null = null;
  
  selectedOffer: CarbonOfferSummary | null = null;
  showOfferDialog = false;
  tokenAmount = 0;
  
  loading = {
    offers: true,
    transactions: true,
    wallet: true,
    acceptingOffer: false
  };
  
  private destroy$ = new Subject<void>();
  
  // Add Math property to component
  protected readonly Math = Math;
  
  constructor(
    private marketplaceService: CarbonMarketplaceService,
    private walletService: WalletService,
    private messageService: MessageService,
    private logger: LoggerService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.loadMarketplaceData();
    this.loadWalletBalance();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  loadMarketplaceData(): void {
    // Load active offers
    this.loading.offers = true;
    this.marketplaceService.getActiveOffers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (offers) => {
          this.offers = offers;
          this.loading.offers = false;
          this.logger.debug('Loaded active offers', { count: offers.length });
        },
        error: (error) => {
          this.loading.offers = false;
          this.logger.error('Error loading offers', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load marketplace offers'
          });
        }
      });
    
    // Load user transactions
    this.loading.transactions = true;
    this.marketplaceService.getUserTransactions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (transactions) => {
          this.transactions = transactions;
          this.loading.transactions = false;
          this.logger.debug('Loaded user transactions', { count: transactions.length });
        },
        error: (error) => {
          this.loading.transactions = false;
          this.logger.error('Error loading transactions', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load transaction history'
          });
        }
      });
  }
  
  loadWalletBalance(): void {
    this.loading.wallet = true;
    
    // Mock token balances for demonstration
    const mockCarbonAmount = 250;
    const mockUsdcAmount = 400;
    const carbonUsdValue = 10;
    const usdcUsdValue = 1;
    
    this.walletService.wallet$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: wallet => {
          if (wallet && wallet.connected) {
            // Create wallet balance with mock data
            this.walletBalance = {
              address: wallet.address,
              carbonTokens: {
                symbol: 'CARBON',
                name: 'Carbon Tokens',
                amount: mockCarbonAmount,
                usdValue: carbonUsdValue,
                icon: 'assets/icons/carbon-token.svg'
              },
              usdcBalance: {
                symbol: 'USDC',
                name: 'USD Coin',
                amount: mockUsdcAmount,
                usdValue: usdcUsdValue,
                icon: 'assets/icons/usdc.svg'
              },
              totalUsdValue: (mockCarbonAmount * carbonUsdValue) + (mockUsdcAmount * usdcUsdValue),
              lastUpdated: new Date()
            };
            
            this.logger.debug('Wallet balance loaded', { 
              address: wallet.address, 
              carbonTokens: mockCarbonAmount,
              usdcBalance: mockUsdcAmount
            });
          } else {
            this.walletBalance = null;
            this.logger.debug('No wallet connected');
          }
          this.loading.wallet = false;
        },
        error: error => {
          this.logger.error('Error loading wallet balance', error);
          this.loading.wallet = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load wallet balance'
          });
        }
      });
  }
  
  openOfferDialog(offer: CarbonOfferSummary): void {
    this.selectedOffer = offer;
    this.tokenAmount = Math.min(offer.tokenAmount, this.walletBalance?.carbonTokens.amount || 0);
    this.showOfferDialog = true;
    this.logger.debug('Opened offer dialog', { offerId: offer.id });
  }
  
  closeOfferDialog(): void {
    this.showOfferDialog = false;
    this.selectedOffer = null;
    this.tokenAmount = 0;
  }
  
  acceptOffer(): void {
    if (!this.selectedOffer || this.tokenAmount <= 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter a valid token amount'
      });
      return;
    }
    
    this.loading.acceptingOffer = true;
    this.logger.debug('Accepting offer', { 
      offerId: this.selectedOffer.id,
      amount: this.tokenAmount
    });
    
    this.marketplaceService.acceptOffer(this.selectedOffer.id, this.tokenAmount)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (transaction) => {
          this.loading.acceptingOffer = false;
          this.closeOfferDialog();
          
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Successfully sold ${this.tokenAmount} carbon tokens for ${transaction.totalAmount} ${transaction.currency}`
          });
          
          // Reload marketplace data
          this.loadMarketplaceData();
          
          this.logger.info('Offer accepted successfully', { 
            transactionId: transaction.id,
            amount: transaction.tokenAmount,
            totalValue: transaction.totalAmount
          });
        },
        error: (error) => {
          this.loading.acceptingOffer = false;
          this.logger.error('Error accepting offer', error);
          
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to accept offer'
          });
        }
      });
  }
  
  getOfferStatusSeverity(status: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (status.toLowerCase()) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'closed': return 'danger';
      default: return 'info';
    }
  }
  
  getTransactionStatusSeverity(status: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (status.toLowerCase()) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'danger';
      default: return 'info';
    }
  }
  
  getTransactionTypeSeverity(type: string): 'success' | 'warning' | 'info' {
    switch (type.toLowerCase()) {
      case 'buy': return 'success';
      case 'sell': return 'warning';
      default: return 'info';
    }
  }
  
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  viewTransactionDetails(transaction: TransactionSummary): void {
    this.router.navigate(['/dashboard/transaction', transaction.id]);
  }
  
  connectWallet(): void {
    // Navigate to wallet connection page or show wallet connection dialog
    this.walletService.connectWallet(WalletType.METAMASK).subscribe({
      next: (wallet) => {
        if (wallet) {
          this.messageService.add({
            severity: 'success',
            summary: 'Wallet Connected',
            detail: `Successfully connected to wallet`
          });
          // Reload wallet balance
          this.loadWalletBalance();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Connection Failed',
            detail: `Failed to connect wallet. Please make sure it's installed and unlocked.`
          });
        }
      },
      error: (error) => {
        this.logger.error('Error connecting wallet', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Connection Error',
          detail: 'An error occurred while connecting to the wallet'
        });
      }
    });
  }
}