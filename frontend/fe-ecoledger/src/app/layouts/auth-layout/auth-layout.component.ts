import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginComponent } from '../../components/login/login.component';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, LoginComponent],
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent {
  constructor(private logger: LoggerService) {
    this.logger.debug('AuthLayoutComponent initialized');
  }
}