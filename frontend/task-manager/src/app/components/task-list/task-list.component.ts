import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="animate-entrance">
      <div class="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 class="fw-extrabold mb-1 tracking-tighter">DATA SKELETON</h2>
          <p class="text-muted small text-uppercase fw-bold ls-wide opacity-50">Task Execution Environment</p>
        </div>
        <a routerLink="/tasks/new" class="btn btn-primary d-flex align-items-center gap-2 rounded-pill px-4">
          <i class="bi bi-plus-circle-fill"></i>
          <span>INITIALIZE TASK</span>
        </a>
      </div>

      <!-- Summary -->
      <div class="row g-4 mb-5">
        <div class="col-md-4">
          <div class="card border-0 shadow-lg p-4 bg-glass">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <div class="fs-1 fw-black text-primary">{{ tasks.length }}</div>
                <div class="text-muted small fw-bold text-uppercase ls-widest mt-1">Total Threads</div>
              </div>
              <i class="bi bi-stack fs-2 text-primary opacity-25"></i>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-lg p-4 bg-glass">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <div class="fs-1 fw-black text-warning">{{ pending }}</div>
                <div class="text-muted small fw-bold text-uppercase ls-widest mt-1">Pending Sync</div>
              </div>
              <i class="bi bi-clock-history fs-2 text-warning opacity-25"></i>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-lg p-4 bg-glass">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <div class="fs-1 fw-black text-success">{{ completed }}</div>
                <div class="text-muted small fw-bold text-uppercase ls-widest mt-1">Verified Nodes</div>
              </div>
              <i class="bi bi-shield-check fs-2 text-success opacity-25"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter bar -->
      <div class="card border-0 shadow-lg mb-4 bg-glass overflow-hidden border-start border-primary border-4">
        <div class="card-body d-flex gap-4 flex-wrap align-items-center py-3">
          <div class="input-group flex-nowrap flex-grow-1" style="max-width: 500px;">
            <span class="input-group-text bg-transparent border-0 text-primary">
              <i class="bi bi-terminal-fill"></i>
            </span>
            <input [(ngModel)]="search" class="form-control border-0 bg-transparent text-primary fw-mono"
                   placeholder="Query database..." />
          </div>
          <select [(ngModel)]="filterStatus" class="form-select w-auto border-0 bg-transparent fw-bold text-muted">
            <option value="">ALL STATUS</option>
            <option value="Pending">PENDING</option>
            <option value="Completed">COMPLETED</option>
          </select>
          <button class="btn btn-link text-muted text-decoration-none fw-bold small" (click)="clearFilters()">
            RESET_FILTERS
          </button>
        </div>
      </div>

      <!-- Loading / Error -->
      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-primary border-4" style="width: 3rem; height: 3rem;"></div>
        <p class="mt-4 fw-mono text-muted animate-pulse">BOOTING_SYSTEM...</p>
      </div>

      <!-- Task table -->
      <div *ngIf="!loading && filtered.length > 0" class="card border-0 shadow-2xl overflow-hidden glass-table">
        <div class="table-responsive">
          <table class="table align-middle mb-0">
            <thead>
              <tr>
                <th class="ps-4">Identifier</th>
                <th>Status</th>
                <th>Process Load</th>
                <th>Timeline</th>
                <th class="text-center pe-4">Protocol</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let task of filtered; let i = index" 
                  class="task-row list-item-animate"
                  [style.animation-delay]="i * 0.1 + 's'">
                <td class="ps-4 py-4">
                  <div class="fw-bold fs-5">{{ task.title }}</div>
                  <div class="text-muted small opacity-75 font-monospace">UUID: {{ task.id }}...</div>
                </td>
                <td>
                  <div class="status-badge" [class.pending]="task.status === 'Pending'" [class.completed]="task.status === 'Completed'">
                    <span class="dot"></span>
                    {{ task.status | uppercase }}
                  </div>
                </td>
                <td>
                  <div class="progress" style="height: 6px; width: 100px; background: rgba(0,0,0,0.05);">
                    <div class="progress-bar" [class.bg-success]="task.status === 'Completed'" [class.bg-warning]="task.status === 'Pending'"
                         [style.width]="task.status === 'Completed' ? '100%' : '30%'"></div>
                  </div>
                </td>
                <td>
                  <div class="small fw-bold">{{ task.dueDate ? (task.dueDate | date:'MM.dd.yy') : 'PERSISTENT' }}</div>
                </td>
                <td class="text-center pe-4">
                  <div class="d-flex gap-2 justify-content-center">
                    <button class="action-btn" (click)="toggleStatus(task)" [title]="'TOGGLE_STATUS'">
                      <i class="bi" [class.bi-cpu-fill]="task.status === 'Pending'" [class.bi-check-all]="task.status === 'Completed'"></i>
                    </button>
                    <a class="action-btn edit" [routerLink]="['/tasks/edit', task.id]">
                      <i class="bi bi-sliders"></i>
                    </a>
                    <button class="action-btn delete" (click)="deleteTask(task.id)">
                      <i class="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  `
})
export class TaskListComponent implements OnInit {
  tasks:        Task[] = [];
  loading       = true;
  error         = '';
  search        = '';
  filterStatus  = '';

  get pending():   number { return this.tasks.filter(t => t.status === 'Pending').length; }
  get completed(): number { return this.tasks.filter(t => t.status === 'Completed').length; }

  get filtered(): Task[] {
    return this.tasks.filter(t => {
      const matchSearch = !this.search ||
        t.title.toLowerCase().includes(this.search.toLowerCase()) ||
        (t.description ?? '').toLowerCase().includes(this.search.toLowerCase());
      const matchStatus = !this.filterStatus || t.status === this.filterStatus;
      return matchSearch && matchStatus;
    });
  }

  constructor(private taskService: TaskService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.taskService.getAll().subscribe({
      next: tasks => { this.tasks = tasks; this.loading = false; },
      error: ()   => { this.error = 'Failed to load tasks.'; this.loading = false; }
    });
  }

  toggleStatus(task: Task): void {
    const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
    this.taskService.update(task.id, { ...task, status: newStatus }).subscribe({
      next: updated => {
        const idx = this.tasks.findIndex(t => t.id === task.id);
        if (idx > -1) this.tasks[idx] = updated;
      }
    });
  }

  deleteTask(id: number): void {
    if (!confirm('Delete this task?')) return;
    this.taskService.delete(id).subscribe({
      next: () => this.tasks = this.tasks.filter(t => t.id !== id)
    });
  }

  clearFilters(): void { this.search = ''; this.filterStatus = ''; }
}
