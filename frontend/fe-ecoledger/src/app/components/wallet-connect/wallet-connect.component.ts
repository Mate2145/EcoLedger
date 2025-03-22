import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { WalletService,WalletType,WalletInfo } from '../../services/wallet.service';


@Component({
  selector: 'app-wallet-connect',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    CardModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './wallet-connect.component.html',
  styleUrls: ['./wallet-connect.component.css']
})
export class WalletConnectComponent implements OnInit, OnDestroy {
  walletDialogVisible = false;
  walletInfo: WalletInfo | null = null;
  isConnecting = false;
  walletTypes = WalletType;
  
  private destroy$ = new Subject<void>();

  constructor(
    private walletService: WalletService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.walletService.wallet$
      .pipe(takeUntil(this.destroy$))
      .subscribe(wallet => {
        this.walletInfo = wallet;
        console.debug('Wallet info updated', wallet);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  showWalletDialog(): void {
    this.walletDialogVisible = true;
  }

  hideWalletDialog(): void {
    this.walletDialogVisible = false;
  }

  connectWallet(type: WalletType): void {
    this.isConnecting = true;
    console.info('Connecting to wallet', { type });
    
    this.walletService.connectWallet(type).subscribe({
      next: (wallet) => {
        if (wallet) {
          this.messageService.add({
            severity: 'success',
            summary: 'Wallet Connected',
            detail: `Successfully connected to ${type} wallet`
          });
          this.hideWalletDialog();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Connection Failed',
            detail: `Failed to connect to ${type} wallet. Please make sure it's installed and unlocked.`
          });
        }
      },
      error: (error) => {
        console.error('Error connecting wallet', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Connection Error',
          detail: 'An error occurred while connecting to the wallet'
        });
      },
      complete: () => {
        this.isConnecting = false;
      }
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

  getShortAddress(address: string): string {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }
}