import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MoviesService } from '../movies.service'; // Assicurati che MoviesService sia importato correttamente

@Component({
  selector: 'app-movie-details',
  templateUrl: '../movie-details/movie-details.component.html',
  styleUrls: ['../movie-details/movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit {
  movieId: string | null = null;
  movie: any;

  constructor(
    private route: ActivatedRoute,
    private moviesService: MoviesService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.movieId = params.get('id');
      if (this.movieId) {
        this.getMovieDetails(this.movieId);
      }
    });
  }

  getMovieDetails(id: string): void {
    this.moviesService.getMovieDetails(id).subscribe(
      (movie: any) => {
        console.log('Movie data received:', movie);
        this.movie = movie;
      },
      (error) => console.error('Errore nel caricamento dei dettagli del film:', error)
    );
  }
}
