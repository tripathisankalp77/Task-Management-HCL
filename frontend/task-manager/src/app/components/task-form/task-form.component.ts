import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="row justify-content-center animate-entrance">
      <div class="col-md-7 col-lg-6">
        <div class="card shadow-2xl border-0 bg-glass overflow-hidden">
          <div class="card-header border-0 bg-gradient-primary py-4 text-center">
            <h3 class="mb-0 fw-black text-white tracking-tighter">
              {{ isEdit ? 'RE-CONFIGURE TASK' : 'INITIALIZE_NEW_THREAD' }}
            </h3>
            <div class="small text-white opacity-75 mt-1 font-monospace">ACCESS_LEVEL: ADMIN</div>
          </div>
          <div class="card-body p-5">

            <div *ngIf="loadError" class="alert alert-danger bg-danger-subtle border-0 rounded-4 animate-entrance">
              <i class="bi bi-shield-exclamation me-2"></i>{{ loadError }}
            </div>

            <div *ngIf="loading" class="text-center py-5">
              <div class="spinner-grow text-primary opacity-50"></div>
              <p class="mt-3 fw-mono text-muted small">FETCHING_REMOTE_DATA...</p>
            </div>

            <form *ngIf="!loading" [formGroup]="form" (ngSubmit)="submit()">

              <!-- Title -->
              <div class="mb-4">
                <label class="form-label fw-extrabold small text-uppercase ls-widest text-primary opacity-75">
                  CORE_IDENTIFIER <span class="text-danger">*</span>
                </label>
                <div class="input-group">
                  <span class="input-group-text bg-transparent border-0 border-bottom border-primary border-2 rounded-0">
                    <i class="bi bi-code-square text-primary"></i>
                  </span>
                  <input type="text" class="form-control border-0 border-bottom border-primary border-2 rounded-0 bg-transparent px-2 font-monospace"
                         formControlName="title"
                         placeholder="TASK_NAME"
                         [class.is-invalid]="submitted && f['title'].errors" />
                </div>
                <div class="invalid-feedback font-monospace small">INVALID_INPUT_DETECTED.</div>
              </div>

              <!-- Description -->
              <div class="mb-4">
                <label class="form-label fw-extrabold small text-uppercase ls-widest text-primary opacity-75">DATA_PAYLOAD</label>
                <textarea class="form-control bg-glass border-1 rounded-4" formControlName="description"
                          rows="4" placeholder="Enter task metadata..."></textarea>
              </div>

              <div class="row g-4">
                <!-- Status -->
                <div class="col-sm-6 mb-3">
                  <label class="form-label fw-extrabold small text-uppercase ls-widest text-primary opacity-75">
                    EXECUTION_STATE <span class="text-danger">*</span>
                  </label>
                  <div class="status-selector d-flex gap-2 mt-1">
                     <button type="button" class="btn btn-sm flex-grow-1 border-1 rounded-pill font-monospace"
                             [class.btn-warning]="form.value.status === 'Pending'"
                             [class.btn-outline-warning]="form.value.status !== 'Pending'"
                             (click)="form.get('status')?.setValue('Pending')">PENDING</button>
                     <button type="button" class="btn btn-sm flex-grow-1 border-1 rounded-pill font-monospace"
                             [class.btn-success]="form.value.status === 'Completed'"
                             [class.btn-outline-success]="form.value.status !== 'Completed'"
                             (click)="form.get('status')?.setValue('Completed')">STABLE</button>
                  </div>
                </div>

                <!-- Due Date -->
                <div class="col-sm-6 mb-4">
                  <label class="form-label fw-extrabold small text-uppercase ls-widest text-primary opacity-75">TARGET_TIMESTAMP</label>
                  <input type="date" class="form-control bg-glass rounded-4" formControlName="dueDate" />
                </div>
              </div>

              <!-- Error -->
              <div *ngIf="submitError" class="alert alert-danger mb-4 animate-entrance font-monospace small">
                <i class="bi bi-x-octagon-fill me-2"></i>{{ submitError }}
              </div>

              <!-- Buttons -->
              <div class="d-grid mt-2">
                <button type="submit" class="btn btn-primary btn-lg rounded-pill fw-black ls-wide py-3"
                        [disabled]="saving">
                  <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
                  {{ saving ? 'EXECUTING...' : (isEdit ? 'UPLINK_CHANGES' : 'DEPLOY_TASK') }}
                </button>
                <a routerLink="/tasks" class="btn btn-link text-muted mt-2 small text-decoration-none fw-bold font-monospace">
                   [ ABORT_OPERATION ]
                </a>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TaskFormComponent implements OnInit {
  form = this.fb.group({
    title:       ['', [Validators.required, Validators.maxLength(200)]],
    description: [''],
    status:      ['Pending', Validators.required],
    dueDate:     ['']
  });

  isEdit      = false;
  taskId      = 0;
  submitted   = false;
  saving      = false;
  loading     = false;
  loadError   = '';
  submitError = '';

  constructor(
    private fb:          FormBuilder,
    private taskService: TaskService,
    private router:      Router,
    private route:       ActivatedRoute
  ) {}

  get f() { return this.form.controls; }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit  = true;
      this.taskId  = +id;
      this.loading = true;
      this.taskService.getById(this.taskId).subscribe({
        next: task => {
          this.form.patchValue({
            title:       task.title,
            description: task.description ?? '',
            status:      task.status,
            dueDate:     task.dueDate ? task.dueDate.substring(0, 10) : ''
          });
          this.loading = false;
        },
        error: () => {
          this.loadError = 'Failed to load task. It may not exist or belong to you.';
          this.loading   = false;
        }
      });
    }
  }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) return;
    this.saving      = true;
    this.submitError = '';

    const payload = {
      title:       this.form.value.title!,
      description: this.form.value.description || undefined,
      status:      this.form.value.status!,
      dueDate:     this.form.value.dueDate || undefined
    };

    const request$ = this.isEdit
      ? this.taskService.update(this.taskId, payload)
      : this.taskService.create(payload);

    request$.subscribe({
      next:  () => this.router.navigate(['/tasks']),
      error: err => {
        this.submitError = err.error?.message ?? 'Failed to save task. Please try again.';
        this.saving      = false;
      }
    });
  }
}
