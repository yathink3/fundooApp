declare var require: any;
import { Component, OnInit, Renderer2, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { NotesService } from '../../services/notes/notes.service';
import { Router } from '@angular/router';
import { GetAllNoteComponent } from '../get-all-note/get-all-note.component';
import { MatSnackBar } from '@angular/material';
const dateFormat = require('dateformat');
@Component({
  providers: [GetAllNoteComponent],
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {
  @Output() noterefreshevt = new EventEmitter();
  noteshow: boolean = true;
  opened: boolean = true;
  title: string = '';
  desc: string = '';
  colorid = 0;
  labelid = 0;
  rem: string = null;
  colorPalette = [
    { name: 'default', colorCode: '#FDFEFE' },
    { name: 'Red', colorCode: '#ef9a9a' },
    { name: 'Cyan', colorCode: '#80deea' },
    { name: 'Blue', colorCode: '#2196f3' },
    { name: 'Indigo', colorCode: '#9fa8da' },
    { name: 'LightBlue', colorCode: '#90caf9' },
    { name: 'Purple', colorCode: '#b39ddb' },
    { name: 'Yellow', colorCode: '#fff59d' },
    { name: 'Lime', colorCode: '#e6ee9c' },
    { name: 'Pink', colorCode: ' #f48fb1' },
    { name: 'gray', colorCode: '#eeeeee' },
    { name: 'Brown', colorCode: '#bcaaa4' },
  ];
  data = JSON.parse(localStorage.getItem('userData'));
  constructor(private svc: NotesService, private route: Router, private getnotes: GetAllNoteComponent, private snackBar: MatSnackBar) {

  }
  ngOnInit() {
  }
  openCreateNote() {
    this.noteshow = false;
  }
  savereminder(date) {
    this.rem = date ? dateFormat(date, 'yyyy-mm-dd HH:MM:ss') : null;
    console.log(this.rem);
  }
  removereminder() {
    this.rem = null;
  }
  medri() {
    this.title = this.title.replace('\n', ' ');
  }
  setcolr(colorcode) {
    this.colorid = colorcode;
  }
  onClickedOutside(e: Event) {
    if (!this.noteshow && !this.opened) {
      if (this.savenote(false)) {
        this.snackBar.open('note saved successfully', 'ok', {
          duration: 2000,
        });
      }
    }
    this.opened = !this.opened;
  }
  closetime() {
    if (this.savenote(false)) {
      this.snackBar.open('note saved successfully', 'ok', {
        duration: 2000,
      });
    }
    this.opened = !this.opened;
  }
  archieveNote() {
    if (this.savenote(true)) {
      this.snackBar.open('note archieved successfully', 'ok', {
        duration: 2000,
      });
    }
    this.opened = !this.opened;
  }
  savenote(isarchieve) {
    const datas = {
      title: this.title,
      desc: this.desc,
      userid: this.data.id,
      rem: this.rem,
      isArchieve: isarchieve,
      colorid: this.colorid,
      labelid: this.labelid,
    };
    this.noteshow = true;
    this.title = '';
    this.desc = '';
    this.rem = null;
    this.colorid = 0;
    this.labelid = 0;

    if (!(/^\s*$/.test(datas.title)) || !(/^\s*$/.test(datas.desc))) {
      console.log(datas);
      this.svc.createnote(datas)
        .subscribe(result => {
          const temp = JSON.stringify(result);
          const results = JSON.parse(temp);
          console.log(results.message, ':', results);
        },
          error => {
            console.log(error.error.message, ':', error.error);
          });
      return true;
    } else {
      return false;
    }
  }
}
