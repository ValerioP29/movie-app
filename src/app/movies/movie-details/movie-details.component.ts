import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-movies-details',
  templateUrl: '../movie-details/movie-details.component.html',
  styleUrls: ['../movie-details/movie-details.component.scss']
})
export class MoviesDetailsComponent implements OnInit {
  movie: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const movieId = this.route.snapshot.paramMap.get('id');
    this.http.get<any>(`http://localhost:3000/movies/${movieId}`).subscribe(
      (movie) => (this.movie = movie),
      (error) => console.error('Error loading movie details:', error)
    );
  }
}
