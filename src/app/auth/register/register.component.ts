import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  onRegister() {
    if (this.password !== this.confirmPassword) {
      this.notificationService.showError('Le password non corrispondono!');
      return;
    }

    if (this.name && this.email && this.password) {
      this.authService.register({ name: this.name, email: this.email, password: this.password }).subscribe(
        () => {
          this.notificationService.showSuccess('Registrazione avvenuta con successo!');
          this.router.navigate(['/auth/login']);
        },
        (error) => {
          this.notificationService.showError('Errore durante la registrazione. Riprova.');
        }
      );
    } else {
      this.notificationService.showError('Compila tutti i campi.');
    }
  }
}
