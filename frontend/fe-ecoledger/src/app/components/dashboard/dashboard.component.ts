import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { SidebarModule } from 'primeng/sidebar';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { WalletService, WalletInfo } from '../../services/wallet.service';
import { LedgerUser } from '../../models/ledger-user';
import { WalletConnectComponent } from '../wallet-connect/wallet-connect.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MenubarModule,
    ButtonModule,
    AvatarModule,
    MenuModule,
    SidebarModule,
    WalletConnectComponent
],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  currentUser: LedgerUser | null = null;
  walletInfo: WalletInfo | null = null;
  menuItems: MenuItem[] = [];
  profileMenuItems: MenuItem[] = [];
  mobileMenuVisible: boolean = false;
  
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private walletService: WalletService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.initializeMenu();
    
    this.walletService.wallet$
      .pipe(takeUntil(this.destroy$))
      .subscribe(wallet => {
        this.walletInfo = wallet;
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeMenu(): void {
    this.menuItems = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: '/dashboard'
      },
      {
        label: 'Market',
        icon: 'pi pi-shopping-cart',
        routerLink: '/dashboard/carbon-marketplace'
      },
      {
        label: 'Profile',
        icon: 'pi pi-user',
        routerLink: '/dashboard/profile'
      }
    ];

    this.profileMenuItems = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        routerLink: '/dashboard/profile'
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog'
      },
      {
        separator: true
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      }
    ];
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleMobileMenu(): void {
    this.mobileMenuVisible = !this.mobileMenuVisible;
  }

  get userInitials(): string {
    if (!this.currentUser) return '';
    return `${this.currentUser.firstName.charAt(0)}${this.currentUser.lastName.charAt(0)}`;
  }
}