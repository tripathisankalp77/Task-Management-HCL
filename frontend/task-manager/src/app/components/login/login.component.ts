import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="row justify-content-center mt-5 animate-entrance">
      <div class="col-md-5 col-lg-4">
        <div class="card shadow-2xl border-0 bg-glass overflow-hidden">
          <div class="card-header border-0 bg-gradient-primary text-white text-center py-5">
            <div class="mb-3">
               <i class="bi bi-fingerprint fs-1"></i>
            </div>
            <h3 class="fw-black mb-0 tracking-tighter">AUTHENTICATE</h3>
            <div class="small opacity-75 mt-1 font-monospace">NODE_ACCESS: SECURE</div>
          </div>
          <div class="card-body p-5">

            <div *ngIf="error" class="alert alert-danger bg-danger-subtle border-0 rounded-4 animate-entrance font-monospace small">
              <i class="bi bi-shield-lock-fill me-2"></i>{{ error }}
            </div>

            <form [formGroup]="form" (ngSubmit)="submit()">
              <!-- Email -->
              <div class="mb-4">
                <label class="form-label fw-extrabold small text-uppercase ls-widest text-primary opacity-75">USER_IDENTIFIER</label>
                <input type="email" class="form-control border-0 border-bottom border-primary border-2 rounded-0 bg-transparent px-0 font-monospace"
                       formControlName="email" placeholder="ENTER_EMAIL"
                       [class.is-invalid]="submitted && f['email'].errors" />
              </div>

              <!-- Password -->
              <div class="mb-5">
                <label class="form-label fw-extrabold small text-uppercase ls-widest text-primary opacity-75">ACCESS_CREDENZ</label>
                <input type="password" class="form-control border-0 border-bottom border-primary border-2 rounded-0 bg-transparent px-0 font-monospace"
                       formControlName="password" placeholder="••••••••"
                       [class.is-invalid]="submitted && f['password'].errors" />
              </div>

              <button type="submit" class="btn btn-primary w-100 py-3 fw-black ls-wide rounded-pill" [disabled]="loading">
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ loading ? 'ENCRYPTING...' : 'ESTABLISH_CONNECTION' }}
              </button>
            </form>
          </div>
          <div class="card-footer text-center py-4 bg-transparent border-0 opacity-75">
            <span class="text-muted small font-monospace">NEW_ENTITY?</span> 
            <a routerLink="/register" class="text-primary fw-black text-decoration-none ms-2 small">REQUEST_ACCESS</a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  submitted = false;
  loading   = false;
  error     = '';

  constructor(
    private fb:   FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  get f() { return this.form.controls; }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) return;
    this.loading = true;
    this.error   = '';

    this.auth.login(this.form.value as any).subscribe({
      next: () => this.router.navigate(['/tasks']),
      error: err => {
        this.error   = err.error?.message ?? 'Login failed. Check your credentials.';
        this.loading = false;
      }
    });
  }
}
