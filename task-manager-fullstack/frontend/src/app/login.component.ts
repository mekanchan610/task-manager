import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  template: `
  <h2>Login</h2>
  <form [formGroup]="form" (ngSubmit)="submit()">
    <label>Username: <input formControlName="username"></label><br>
    <label>Password: <input type="password" formControlName="password"></label><br>
    <button type="submit">Login</button>
  </form>
  `
})
export class LoginComponent {
  form = this.fb.group({ username: [''], password: [''] });
  constructor(private fb: FormBuilder, private auth: AuthService) {}
  submit(){ this.auth.login(this.form.value.username, this.form.value.password).subscribe({ error: e => alert('Login failed') }); }
}
