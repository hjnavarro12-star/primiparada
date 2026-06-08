import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private token: string | null = null;

  setToken(token: string | null): void {
    this.token = token;
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (this.token) {
      headers = headers.set('Authorization', `Bearer ${this.token}`);
    }
    return headers;
  }

  async get<T>(path: string): Promise<T> {
    return firstValueFrom(this.http.get<T>(`${this.baseUrl}${path}`, { headers: this.getHeaders() }));
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    return firstValueFrom(this.http.post<T>(`${this.baseUrl}${path}`, body, { headers: this.getHeaders() }));
  }

  async put<T>(path: string, body: unknown): Promise<T> {
    return firstValueFrom(this.http.put<T>(`${this.baseUrl}${path}`, body, { headers: this.getHeaders() }));
  }

  async delete<T>(path: string): Promise<T> {
    return firstValueFrom(this.http.delete<T>(`${this.baseUrl}${path}`, { headers: this.getHeaders() }));
  }
}
