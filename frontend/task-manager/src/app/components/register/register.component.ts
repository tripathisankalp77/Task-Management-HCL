import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="row justify-content-center mt-5 animate-entrance">
      <div class="col-md-5 col-lg-4">
        <div class="card shadow-2xl border-0 bg-glass overflow-hidden">
          <div class="card-header border-0 bg-success-gradient text-white text-center py-5">
            <div class="mb-3">
               <i class="bi bi-person-bounding-box fs-1"></i>
            </div>
            <h3 class="fw-black mb-0 tracking-tighter">INITIALIZE_NODE</h3>
            <p class="small opacity-75 mt-1 font-monospace">REGISTER_NEW_ENTITY</p>
          </div>
          <div class="card-body p-5">

            <div *ngIf="error" class="alert alert-danger bg-danger-subtle border-0 rounded-4 animate-entrance font-monospace small">
              <i class="bi bi-shield-slash-fill me-2"></i>{{ error }}
            </div>

            <form [formGroup]="form" (ngSubmit)="submit()">
              <!-- Name -->
              <div class="mb-4">
                <label class="form-label fw-extrabold small text-uppercase ls-widest text-success opacity-75">ENTITY_LABEL</label>
                <input type="text" class="form-control border-0 border-bottom border-success border-2 rounded-0 bg-transparent px-0 font-monospace"
                       formControlName="name" placeholder="FULL_NAME" />
              </div>

              <!-- Email -->
              <div class="mb-4">
                <label class="form-label fw-extrabold small text-uppercase ls-widest text-success opacity-75">NODE_IDENTIFIER</label>
                <input type="email" class="form-control border-0 border-bottom border-success border-2 rounded-0 bg-transparent px-0 font-monospace"
                       formControlName="email" placeholder="EMAIL_ADDR" />
              </div>

              <!-- Password -->
              <div class="mb-4">
                <label class="form-label fw-extrabold small text-uppercase ls-widest text-success opacity-75">SECRET_KEY</label>
                <input type="password" class="form-control border-0 border-bottom border-success border-2 rounded-0 bg-transparent px-0 font-monospace"
                       formControlName="password" placeholder="MIN_LEN_06" />
              </div>

              <!-- Confirm Password -->
              <div class="mb-5">
                <label class="form-label fw-extrabold small text-uppercase ls-widest text-success opacity-75">KEY_VERIF</label>
                <input type="password" class="form-control border-0 border-bottom border-success border-2 rounded-0 bg-transparent px-0 font-monospace"
                       formControlName="confirmPassword" placeholder="REPEAT_KEY" />
              </div>

              <button type="submit" class="btn btn-success w-100 py-3 fw-black ls-wide rounded-pill" [disabled]="loading">
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ loading ? 'SYNCING_DATA...' : 'CREATE_ENTITY' }}
              </button>
            </form>
          </div>
          <div class="card-footer text-center py-4 bg-transparent border-0 opacity-75">
            <span class="text-muted small font-monospace">EXISTING_NODE?</span> 
            <a routerLink="/login" class="text-success fw-black text-decoration-none ms-2 small">UPLINK_NOW</a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  form = this.fb.group({
    name:            ['', Validators.required],
    email:           ['', [Validators.required, Validators.email]],
    password:        ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.matchPasswords });

  submitted = false;
  loading   = false;
  error     = '';

  constructor(
    private fb:   FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  get f() { return this.form.controls; }

  matchPasswords(group: AbstractControl) {
    const pw  = group.get('password')?.value;
    const cpw = group.get('confirmPassword')?.value;
    if (pw !== cpw) {
      group.get('confirmPassword')?.setErrors({ mismatch: true });
    }
    return null;
  }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) return;
    this.loading = true;
    this.error   = '';

    const { name, email, password } = this.form.value;
    this.auth.register({ name: name!, email: email!, password: password! }).subscribe({
      next: () => this.router.navigate(['/tasks']),
      error: err => {
        this.error   = err.error?.message ?? 'Registration failed. Try again.';
        this.loading = false;
      }
    });
  }
}
