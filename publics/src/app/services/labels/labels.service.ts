import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class LabelsService {
  URL = 'http://localhost/fundooapp/label/';
  constructor(private http: HttpClient) { }

  createlabel(data) {
    return this.http.post(this.URL + 'createlabel', data);
  }
  getAllLabels(data) {
    return this.http.get(this.URL + 'getAllLabels/' + data);
  }
  addNoteLabel(data) {
    return this.http.post(this.URL + 'addNoteLabel', data);
  }
  removeNotelabel(data) {
    return this.http.post(this.URL + 'removeNoteLabel', data);
  }

}

