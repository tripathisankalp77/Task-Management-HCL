import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private currentTheme = new BehaviorSubject<'light' | 'dark'>('light');
  theme$ = this.currentTheme.asObservable();

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.setTheme('dark');
    }
  }

  toggleTheme(): void {
    const nextTheme = this.currentTheme.value === 'light' ? 'dark' : 'light';
    this.setTheme(nextTheme);
  }

  private setTheme(theme: 'light' | 'dark'): void {
    this.currentTheme.next(theme);
    localStorage.setItem('theme', theme);
    this.renderer.setAttribute(document.documentElement, 'data-theme', theme);
  }

  isDarkMode(): boolean {
    return this.currentTheme.value === 'dark';
  }
}
