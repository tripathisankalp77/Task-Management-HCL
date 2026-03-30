import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark animate-entrance">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center gap-2" routerLink="/tasks">
          <div class="logo-box">
             <i class="bi bi-grid-1x2-fill"></i>
          </div>
          <span class="d-none d-sm-inline fw-extrabold ls-tight">HCL Project</span>
        </a>

        <div class="d-flex align-items-center gap-3 ms-auto">
          <!-- Theme Toggle -->
          <button class="theme-toggle rounded-circle" (click)="toggleTheme()" [title]="isDark ? 'Decrypt colors (Light)' : 'Encrypt colors (Dark)'">
            <i class="bi" [ngClass]="isDark ? 'bi-shield-shaded' : 'bi-shield-fill-check'"></i>
          </button>

          <!-- User Info & Actions -->
          <ng-container *ngIf="isLoggedIn$ | async">
            <div class="d-flex align-items-center gap-3 ms-2">
              <div class="user-chip d-none d-md-flex">
                 <img [src]="'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=' + userName" class="avatar" />
                 <span class="userName small">{{ userName }}</span>
              </div>
              <a routerLink="/tasks" class="btn btn-outline-light btn-sm d-flex align-items-center gap-2 border-0">
                <i class="bi bi-activity"></i>
                <span class="d-none d-sm-inline">DASHBOARD</span>
              </a>
              <button (click)="logout()" class="btn btn-outline-danger btn-sm rounded-pill px-3 border-0">
                <i class="bi bi-power"></i>
              </button>
            </div>
          </ng-container>

          <ng-container *ngIf="!(isLoggedIn$ | async)">
            <div class="d-flex gap-3 ms-2">
              <a routerLink="/login"    class="btn btn-link text-white text-decoration-none small fw-bold">SIGN IN</a>
              <a routerLink="/register" class="btn btn-primary rounded-pill btn-sm">GET STARTED</a>
            </div>
          </ng-container>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .logo-box {
      background: linear-gradient(135deg, #3b82f6, #6366f1);
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      color: white;
      font-size: 1.4rem;
      box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .navbar-brand:hover .logo-box {
       transform: rotate(90deg) scale(1.1);
       box-shadow: 0 12px 24px rgba(59, 130, 246, 0.5);
    }
    .user-chip {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      padding: 4px 12px 4px 4px;
      border-radius: 99px;
      align-items: center;
      gap: 8px;
    }
    .avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: white;
    }
    .userName { font-weight: 600; color: rgba(255,255,255,0.8); }
    .ls-tight { letter-spacing: -0.05em; font-size: 1.25rem; }
  `]
})
export class NavbarComponent {
  private auth = inject(AuthService);
  private theme = inject(ThemeService);

  isLoggedIn$ = this.auth.isLoggedIn$;

  get userName(): string {
    return this.auth.getCurrentUser()?.name ?? '';
  }

  get isDark(): boolean {
    return this.theme.isDarkMode();
  }

  toggleTheme(): void {
    this.theme.toggleTheme();
  }

  logout(): void { this.auth.logout(); }
}
