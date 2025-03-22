import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// PrimeNG Components
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';

// Models
import { CarbonTransaction, TransactionStatus, TransactionType } from '../../models/carbon-transaction.model';
import { WalletBalance } from '../../models/wallet-balance.model';

// Services
import { CarbonMarketplaceService } from '../../services/carbon-marketplace.service';
import { LoggerService } from '../../services/logger.service';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-transaction-details',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    ToastModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService],
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent implements OnInit, OnDestroy {
  transaction: CarbonTransaction | null = null;
  loading = true;
  walletBalance: WalletBalance | null = null;
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private marketplaceService: CarbonMarketplaceService,
    private messageService: MessageService,
    private logger: LoggerService,
    private walletService: WalletService
  ) {}
  
  ngOnInit(): void {
    this.loadWalletBalance();
    const transactionId = this.route.snapshot.paramMap.get('id');
    
    if (!transactionId) {
      this.handleError('Transaction ID not provided');
      return;
    }
    
    this.loadTransactionDetails(transactionId);
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  loadTransactionDetails(transactionId: string): void {
    this.loading = true;
    
    this.marketplaceService.getTransactionById(transactionId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (transaction) => {
          this.transaction = transaction;
          this.loading = false;
          this.logger.debug('Loaded transaction details', { transactionId });
        },
        error: (error) => {
          this.handleError('Failed to load transaction details', error);
        }
      });
  }
  
  loadWalletBalance(): void {
    this.walletService.wallet$
      .pipe(takeUntil(this.destroy$))
      .subscribe(wallet => {
        if (wallet) {
          this.walletBalance = {
            address: wallet.address,
            carbonTokens: {
              symbol: 'CARBON',
              name: 'Carbon Tokens',
              amount: 0, // Fetch actual balance from your token service
              usdValue: 0 // Fetch actual USD value
            },
            usdcBalance: {
              symbol: 'USDC',
              name: 'USD Coin',
              amount: 0, // Fetch actual balance from your token service
              usdValue: 1 // Assuming 1 USDC = 1 USD
            },
            totalUsdValue: 0, // Calculate total value
            lastUpdated: new Date()
          };
        } else {
          this.walletBalance = null;
        }
      });
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
  
  getTransactionTypeIcon(type: TransactionType): string {
    switch (type) {
      case TransactionType.PURCHASE:
        return 'pi pi-shopping-cart';
      case TransactionType.SALE:
        return 'pi pi-dollar';
      case TransactionType.DEPOSIT:
        return 'pi pi-arrow-down';
      case TransactionType.WITHDRAWAL:
        return 'pi pi-arrow-up';
      default:
        return 'pi pi-sync';
    }
  }
  
  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  goBack(): void {
    this.router.navigate(['/dashboard/carbon-marketplace']);
  }
  
  viewOnExplorer(): void {
    if (this.transaction?.txHash) {
      // In a real app, this would open the blockchain explorer for the transaction
      window.open(`https://etherscan.io/tx/${this.transaction.txHash}`, '_blank');
    }
  }
  
  private handleError(message: string, error?: any): void {
    this.loading = false;
    this.logger.error(message, error);
    
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message
    });
    
    // Navigate back to marketplace after a short delay
    setTimeout(() => {
      this.goBack();
    }, 3000);
  }
}