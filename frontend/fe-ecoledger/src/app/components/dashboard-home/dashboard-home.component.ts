import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { WalletService,WalletInfo,WalletType } from '../../services/wallet.service';
import { LedgerUser } from '../../models/ledger-user';
import { WalletConnectComponent } from '../wallet-connect/wallet-connect.component';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ChartModule,
    ToastModule,
    WalletConnectComponent
  ],
  providers: [MessageService],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  currentUser: LedgerUser | null = null;
  walletInfo: WalletInfo | null = null;
  chartData: any;
  chartOptions: any;
  tokenBalance: number = 0;
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private authService: AuthService,
    private walletService: WalletService,
    private messageService: MessageService
  ) {}
  
  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.initChartData();
    
    this.walletService.wallet$
      .pipe(takeUntil(this.destroy$))
      .subscribe(wallet => {
        this.walletInfo = wallet;
        
        if (wallet?.connected) {
          this.loadTokenBalance();
        }
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  initChartData(): void {
    this.chartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Carbon Credits',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: '#4caf50',
          tension: 0.4
        },
        {
          label: 'Energy Usage',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderColor: '#2196f3',
          tension: 0.4
        }
      ]
    };
    
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    };
  }
  
  loadTokenBalance(): void {
    this.walletService.getTokenBalance().subscribe(balance => {
      this.tokenBalance = balance;
    });
  }
  
  claimTokens(): void {
    // Simulate token claiming
    setTimeout(() => {
      const claimedAmount = Math.floor(Math.random() * 50) + 10;
      this.tokenBalance += claimedAmount;
      
      this.messageService.add({
        severity: 'success',
        summary: 'Tokens Claimed',
        detail: `You've successfully claimed ${claimedAmount} ECO tokens!`
      });
    }, 1500);
  }
}