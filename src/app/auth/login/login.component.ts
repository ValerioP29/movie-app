import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  onLogin() {
    if (this.email && this.password) {
      this.authService.login({ email: this.email, password: this.password }).subscribe(
        (response) => {
          this.notificationService.showSuccess('Login effettuato con successo!');
          localStorage.setItem('token', response.token);
          this.router.navigate(['/movies']);
        },
        (error) => {
          this.notificationService.showError('Errore durante il login. Verifica le credenziali.');
        }
      );
    } else {
      this.notificationService.showError('Inserisci email e password.');
    }
  }
}
