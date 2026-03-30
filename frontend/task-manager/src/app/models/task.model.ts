export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'Pending' | 'Completed';
  dueDate?: string;
  userId: number;
  userName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status: string;
  dueDate?: string;
}

export interface UpdateTaskDto {
  title: string;
  description?: string;
  status: string;
  dueDate?: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}
