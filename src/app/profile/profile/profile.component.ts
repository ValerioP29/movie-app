import { NotificationService } from './../../shared/notification.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { catchError, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any = {};
  favoriteMovies: any[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.loadUserDetails(userId);
    } else {
      console.error('User ID not found in local storage');
    }
  }

  addFavorite(movieId: number) {
    const selectedMovie = this.favoriteMovies.find(movie => movie.id === movieId);
    if (!selectedMovie) {
      this.notificationService.showError('Film non trovato.');
      return;
    }

    this.authService.addToFavorites(selectedMovie).subscribe(
      (response) => {
        if (response?.message) {
          this.notificationService.showError(response.message);
        } else {
          this.notificationService.showSuccess('Film aggiunto ai preferiti!');
          this.loadUserDetails(this.authService.getUserId()!);
        }
      },
      (error) => {
        this.notificationService.showError('Errore durante l\'aggiunta ai preferiti.');
      }
    );
  }


  viewDetails(movieId: number) {

    this.router.navigate(['/movies/movie-details', movieId]);
  }


  removeFavorite(movieId: number) {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.notificationService.showError('User ID non trovato.');
      return;
    }


    const updatedFavorites = this.favoriteMovies.filter(movie => movie.id !== movieId);

    this.authService.updateFavorites(userId, updatedFavorites).subscribe(
      () => {
        this.notificationService.showSuccess('Film rimosso dai preferiti!');
        this.loadUserDetails(userId); // Ricarica i dettagli utente per aggiornare la lista dei preferiti
      },
      (error) => {
        this.notificationService.showError('Errore durante la rimozione del film dai preferiti.');
      }
    );
  }

  loadUserDetails(userId: string) {
    this.http.get<any>(`http://localhost:3000/users/${userId}`).pipe(
      catchError((error) => {
        console.error('Error loading profile:', error);
        return of(null);
      })
    ).subscribe(
      (user) => {
        if (user) {
          this.user = user;
          this.favoriteMovies = user.favorites || [];
        }
      }
    );
  }
}
