import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { NotesService } from '../../services/notes/notes.service';
import { Router } from '@angular/router';
import { GetAllNoteComponent } from '../get-all-note/get-all-note.component';
@Component({
  providers: [GetAllNoteComponent],
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {
  noteshow: boolean = true;
  title: string = '';
  desc: string = '';
  colorid = 0;
  labelid = 0;
  rem: string = '';
  remdate: string;
  // tslint:disable-next-line:variable-name
  tx_date: any = 0;
  data = JSON.parse(localStorage.getItem('userData'));
  constructor(private svc: NotesService, private route: Router, private getnotes: GetAllNoteComponent) {

  }
  handleClickOutside() {
    this.noteshow = true;
  }
  ngOnInit() {
  }
  openCreateNote() {
    this.noteshow = false;
  }
  savereminder() {
    this.rem = this.tx_date;
    console.log(this.rem);
    let data = this.rem.toString();
    this.remdate = data.slice(0, -31);
  }
  removereminder() {
    this.rem = '';
  }
  medri() {
    this.title = this.title.replace('\n', ' ');
  }
  closetime() {
    const datas = {
      title: this.title,
      desc: this.desc,
      userid: this.data.id,
      rem: this.rem,
      colorid: this.colorid,
      labelid: this.labelid,
    };
    this.noteshow = true;
    this.title = '';
    this.desc = '';
    this.tx_date = 0;
    this.rem = '';
    this.colorid = 0;
    this.labelid = 0;

    if (!(/^\s*$/.test(datas.title)) || !(/^\s*$/.test(datas.desc))) {
      console.log(datas);
      this.svc.createnote(datas)
        .subscribe(result => {
          const temp = JSON.stringify(result);
          const results = JSON.parse(temp);
          console.log(results.message, ':', results);
          // tslint:disable-next-line: no-unused-expression
          GetAllNoteComponent.apply;
          this.getnotes.getAllNotes();
        },
          error => {
            console.log(error.error.message, ':', error.error);
          });
    }
  }
}
