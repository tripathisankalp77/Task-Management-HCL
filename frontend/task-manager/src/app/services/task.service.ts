import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, CreateTaskDto, UpdateTaskDto } from '../models/task.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly url = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.url);
  }

  getById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.url}/${id}`);
  }

  create(dto: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(this.url, dto);
  }

  update(id: number, dto: UpdateTaskDto): Observable<Task> {
    return this.http.put<Task>(`${this.url}/${id}`, dto);
  }

  delete(id: number): Observable<unknown> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
