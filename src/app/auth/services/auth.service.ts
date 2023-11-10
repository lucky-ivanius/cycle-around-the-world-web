import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface Token {
  accessToken: string;
}

type LoginAPIResponse = Token;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http: HttpClient = inject(HttpClient);
  private loginApi =
    'http://ec2-18-140-54-4.ap-southeast-1.compute.amazonaws.com:3001/api/v1/auth/login';

  private authTokenKey = 'token'; // Key for storing the JWT token in local storage
  private isTokenProvided = false;

  constructor() {
    this.isTokenProvided = this.loadToken(); // Check if the user is already authenticated
  }

  // Perform the login and return the JWT token
  login(username: string, password: string): Observable<LoginAPIResponse> {
    const loginData = { username, password };
    return this.http.post<LoginAPIResponse>(this.loginApi, loginData);
  }

  // Store the JWT token in local storage and set the user as authenticated
  saveToken(token: string) {
    localStorage.setItem(this.authTokenKey, token);
    this.isTokenProvided = true;
  }

  // Load the JWT token from local storage
  loadToken(): boolean {
    const token = localStorage.getItem(this.authTokenKey);
    return !!token;
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return this.isTokenProvided;
  }

  // Create bearer token
  getBearerToken(): string {
    return `Bearer ${localStorage.getItem(this.authTokenKey)}`;
  }

  // Logout the user and remove the JWT token from local storage
  logout() {
    localStorage.removeItem(this.authTokenKey);
    this.isTokenProvided = false;
  }
}
