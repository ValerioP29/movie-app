import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getPopularMovies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/movies-popular`);
  }

  getFavorites(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/favorites?userId=${userId}`);
  }

  addFavorite(favorite: { userId: string; movieId: string }): Observable<any> {

    return this.http.patch(`${this.apiUrl}/users/${favorite.userId}`, {
      favorites: [favorite.movieId]
    });
  }


  removeFavorite(favoriteId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/favorites/${favoriteId}`);
  }
}
