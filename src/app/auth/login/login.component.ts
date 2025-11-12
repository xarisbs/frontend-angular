import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  userName = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) { }

  onSubmit() {
    this.auth.login({ userName: this.userName, password: this.password }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => this.error = 'Credenciales incorrectas'
    });

    // this.router.navigate(['/dashboard']);
  }
}
