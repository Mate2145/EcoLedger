import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { AuthService } from '../../services/auth.service';
import { LedgerUser } from '../../models/ledger-user';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ChartModule
  ],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
  currentUser: LedgerUser | null = null;
  chartData: any;
  chartOptions: any;
  
  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.initChartData();
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
  
  connectWallet(): void {
    // This will be implemented in Phase 2
    console.log('Connect wallet clicked');
  }
}