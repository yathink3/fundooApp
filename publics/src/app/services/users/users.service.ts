import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  URL = environment.apiUrl + 'fundooapp/user/';
  constructor(private http: HttpClient) { }

  login(data) {
    return this.http.post(this.URL + 'login', data);
  }
  register(data) {
    return this.http.post(this.URL + 'registration', data);
  }
  forgotPassword(data) {
    return this.http.post(this.URL + 'forgot', data);
  }
  resetPassword(token, data) {
    return this.http.post(this.URL + 'forgotPassword/' + token, data);
  }
  validation(token) {
    return this.http.get(this.URL + 'validateaccount/' + token);
  }
  sociallogin(data) {
    return this.http.post(this.URL + 'sociallogin', data);
  }
  uploadProfilePic(data) {
    return this.http.post(this.URL + 'uploadProfilePic', data);
  }
}
