import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { authGuard } from './services/auth.guard';
import { DashboardLayoutComponent } from './components/dashboard/dashboard.component';
import { CarbonMarketplaceComponent } from './components/carbon-marketplace/carbon-marketplace.component';
import { TransactionDetailsComponent } from './components/transaction-details/transaction-details.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'carbon-marketplace', component: CarbonMarketplaceComponent },
      { path: 'transaction/:id', component: TransactionDetailsComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  },
  { path: '**', redirectTo: '/login' }
];