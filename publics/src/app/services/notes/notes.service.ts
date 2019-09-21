import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  URL = 'http://localhost/fundooapp/note/';
  constructor(private http: HttpClient) { }
  createnote(data) {
    return this.http.post(this.URL + 'createnote', data);
  }
  getAllNotes(userid) {
    return this.http.get(this.URL + 'getAllNotes/' + userid);
  }
}