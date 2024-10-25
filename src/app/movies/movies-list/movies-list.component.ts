import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../movies.service';
import { NotificationService } from '../../shared/notification.service';
import { AuthService } from '../../auth/auth.service';
@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss']
})
export class MoviesListComponent implements OnInit {
  movies: any[] = [];

  constructor(
    private moviesService: MoviesService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getMovies();
  }

  getMovies() {
    this.moviesService.getPopularMovies().subscribe(
      (data) => {
        this.movies = data;
      },
      (error) => {
        this.notificationService.showError('Errore nel recupero dei film.');
      }
    );
  }

  addFavorite(movie: any) {
    this.authService.addToFavorites(movie).subscribe(
      () => {
        this.notificationService.showSuccess('Film aggiunto ai preferiti!');
      },
      (error) => {
        this.notificationService.showError('Errore durante l\'aggiunta ai preferiti.');
      }
    );
  }
}
