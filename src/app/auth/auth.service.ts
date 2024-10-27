import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(this.isLoggedIn());
  authStatus = this.isAuthenticated.asObservable();
  private apiUrl = 'http://localhost:3000';
  user: any = null;

  constructor(private http: HttpClient, private router: Router) {
    this.isAuthenticated.next(this.isLoggedIn());
  }


  login(credentials: { email: string; password: string }): Observable<{ token: string }> {
    return this.http.get<any[]>(`${this.apiUrl}/users`).pipe(
      map((users) => {
        const user = users.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        );
        if (user) {
          const token = 'mock-jwt-token';
          const userId = user.id;

          localStorage.setItem('userId', userId);
          localStorage.setItem('token', token);

          this.isAuthenticated.next(true);
          this.setTokenExpiration(3600000);
          return { token };
        } else {
          throw new Error('Invalid credentials');
        }
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => new Error('Login failed. Please try again.'));
      })
    );
  }



  register(data: { email: string; password: string; name: string }) {
    return this.http.post(`${this.apiUrl}/users`, data);
  }

  logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    this.isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  setTokenExpiration(duration: number) {
    setTimeout(() => {
      this.logout();
    }, duration);
  }

  getUserDetails(): Observable<any> {
    const userId = this.getUserId();
    if (!userId) {
      return throwError(() => new Error('User ID not found'));
    }


    return this.http.get<any>(`${this.apiUrl}/users/${userId}`);
  }

  addToFavorites(movie: any): Observable<any> {
    const userId = this.getUserId();

    if (!movie || !movie.id) {
      return throwError(() => new Error('Film non valido.'));
    }

    return this.getUserDetails().pipe(
      switchMap((user) => {
        user.favorites = user.favorites || [];

        const alreadyInFavorites = user.favorites.some(
          (fav: any) => fav.id === movie.id
        );

        if (alreadyInFavorites) {
          return of({ message: 'Il film è già nei preferiti' });
        }

        const updatedFavorites = [...user.favorites, movie];

        return this.updateFavorites(userId!, updatedFavorites);
      }),
      catchError((error) => {
        console.error('Errore durante l\'aggiunta ai preferiti:', error);
        return throwError(() => new Error('Errore durante l\'aggiunta ai preferiti.'));
      })
    );
  }


  updateFavorites(userId: string, favorites: any[]): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${userId}`, { favorites });
  }


  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
