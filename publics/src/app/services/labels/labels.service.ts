import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LabelsService {
  URL = 'http://localhost/fundooapp/label/';
  constructor(private http: HttpClient) { }

  createlabel(data) {
    return this.http.post(this.URL + 'createlabel', data);
  }
  getAllLabels(data): Observable<any> {
    return this.http.get(this.URL + 'getAllLabels/' + data);
  }
  addNoteLabel(data) {
    return this.http.post(this.URL + 'addNoteLabel', data);
  }
  removeNotelabel(data) {
    return this.http.post(this.URL + 'removeNoteLabel', data);
  }
  updatelabel(data) {
    return this.http.post(this.URL + 'updatelabel', data);
  }
  deletelabel(labelid) {
    return this.http.get(this.URL + 'deletelabel/' + labelid);
  }
}

