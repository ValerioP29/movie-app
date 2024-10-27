import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  photo: string;
  id: number;
  name: string;
  email: string;
  age: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}


  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
}
