import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class NotesService {
  URL = environment.apiUrl + 'fundooapp/note/';
  constructor(private http: HttpClient) { }
  createnote(data) {
    return this.http.post(this.URL + 'createnote', data);
  }
  getAllNotes(userid): Observable<any> {
    return this.http.get(this.URL + 'getAllNotes/' + userid);
  }
  getOneNote(noteid) {
    return this.http.get(this.URL + 'getOneNote/' + noteid);
  }
  updateNotecolor(data) {
    return this.http.post(this.URL + 'updateNotecolor', data);
  }
  updateNoteReminder(data) {
    return this.http.post(this.URL + 'updateNoteReminder', data);
  }
  archievenote(data) {
    return this.http.post(this.URL + 'archievenote', data);
  }
  addTrashnote(data) {
    return this.http.post(this.URL + 'addTrashnote', data);
  }
  updateNotes(data) {
    return this.http.post(this.URL + 'updateNotes', data);
  }
  deleteNotePermanently(noteid) {
    return this.http.get(this.URL + 'deleteNotePermanently/' + noteid);
  }
  dragAndDrop(data) {
    return this.http.post(this.URL + 'dragAndDrop', data);
  }
}
