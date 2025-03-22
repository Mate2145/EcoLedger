import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { SidebarModule } from 'primeng/sidebar';
import { AuthService } from '../../services/auth.service';
import { LedgerUser } from '../../models/ledger-user';

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
    SidebarModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardLayoutComponent implements OnInit {
  currentUser: LedgerUser | null = null;
  menuItems: MenuItem[] = [];
  profileMenuItems: MenuItem[] = [];
  mobileMenuVisible: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.initializeMenu();
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
        routerLink: '/dashboard/market'
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
        icon: 'pi pi-cog',
        routerLink: '/dashboard/settings'
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