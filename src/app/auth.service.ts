import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

const TOKEN_STORAGE_KEY = 'token';

@Injectable()
export class AuthService {

  get endpoint() { return `/api/v1`; }

  constructor(private storage: Storage, private http: Http) { }

  private saveToken(token) {
    this.storage.setItem(TOKEN_STORAGE_KEY, token);
  }

  private getToken(): string {
    return this.storage.getItem(TOKEN_STORAGE_KEY);
  }

  private isLoggedIn(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));

    return payload.exp > Date.now() / 1000;
  }

  login(user) {
    this.http.post(this.endpoint + '/login', user).subscribe(res => {
      this.saveToken(res.json().token);
    });
  }

  logout(user) {
    this.storage.removeItem(TOKEN_STORAGE_KEY);
  }

  register(name, email, password) {
    this.http.post(this.endpoint + '/register', {name, email, password}).subscribe(res => {
      this.saveToken(res.json().token);
    });
  }
}
