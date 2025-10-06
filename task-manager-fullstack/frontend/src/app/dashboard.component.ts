import { Component, OnInit } from '@angular/core';
import { TaskService } from './task.service';
import { AuthService } from './auth.service';

@Component({
  template: `
  <h2>Dashboard</h2>
  <button (click)="auth.logout()">Logout</button>
  <h3>Create Task</h3>
  <input placeholder="title" [(ngModel)]="title"><br>
  <textarea placeholder="description" [(ngModel)]="description"></textarea><br>
  <button (click)="create()">Add</button>
  <h3>Your Tasks</h3>
  <ul>
    <li *ngFor="let t of tasks;
            let i = index">
      <strong>{{t.title}}</strong> - {{t.description}}
      <button (click)="edit(t)">Edit</button>
      <button (click)="del(t.id)">Delete</button>
    </li>
  </ul>
  <div *ngIf="editing">
    <h3>Edit Task</h3>
    <input [(ngModel)]="editTitle"><br>
    <textarea [(ngModel)]="editDesc"></textarea><br>
    <button (click)="save()">Save</button>
    <button (click)="cancel()">Cancel</button>
  </div>
  `
})
export class DashboardComponent implements OnInit {
  tasks: any[] = [];
  title = ''; description = '';
  editing = false; editId: number | null = null; editTitle = ''; editDesc = '';
  constructor(public taskService: TaskService, public auth: AuthService) {}
  ngOnInit(){ this.taskService.tasks$.subscribe(t => this.tasks = t); this.taskService.load(); }
  create(){ this.taskService.create({ title: this.title, description: this.description }); this.title=''; this.description=''; }
  del(id: number){ this.taskService.delete(id); }
  edit(t: any){ this.editing = true; this.editId = t.id; this.editTitle = t.title; this.editDesc = t.description; }
  save(){ if(this.editId) this.taskService.update(this.editId, { title: this.editTitle, description: this.editDesc }); this.cancel(); }
  cancel(){ this.editing = false; this.editId = null; this.editTitle=''; this.editDesc=''; }
}
