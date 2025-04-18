import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../enviroment/enviroment.qa';
import { User, ResponseUser} from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/'; // Fixed missing closing quote
  constructor(private http: HttpClient) { }

  getUserAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}users`);
  }

  getUser(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}`);
  }

  getUserByEmail(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}users/email/${email}`);
  }


  creationUser(user: User): Observable<ResponseUser> {
    const response= this.http.post<ResponseUser>(`http://localhost:3000/api/users`, user)
    console.log(response)
    return response
  }
}
