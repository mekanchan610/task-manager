import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  tasks$ = new BehaviorSubject<any[]>([]);
  constructor(private http: HttpClient) {}
  load() { this.http.get<any[]>('/api/tasks').subscribe(list => this.tasks$.next(list)); }
  create(t: any) { return this.http.post('/api/tasks', t).subscribe(() => this.load()); }
  update(id: number, t: any) { return this.http.put(`/api/tasks/${id}`, t).subscribe(() => this.load()); }
  delete(id: number) { return this.http.delete(`/api/tasks/${id}`).subscribe(() => this.load()); }
}
