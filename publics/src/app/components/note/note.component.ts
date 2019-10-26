declare var require: any;
import { Component, OnInit, Input } from '@angular/core';
import { NotesService } from '../../services/notes/notes.service';
import { Router } from '@angular/router';
import { GetAllNoteComponent } from '../get-all-note/get-all-note.component';
import { MatSnackBar } from '@angular/material';
import { LabelsService } from 'src/app/services/labels/labels.service';
const dateFormat = require('dateformat');
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { debug } from 'util';
TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');
@Component({
  providers: [GetAllNoteComponent],
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {
  @Input() notes;
  @Input() pointer;
  @Input() items;
  @Input() labelsData;
  @Input() colorPalette;
  @Input() userData;
  @Input() notelabels;
  noteshow: boolean = true;
  opened: boolean = true;
  title: string = '';
  desc: string = '';
  colorid = 0;
  labelid = 0;
  tempnotelabels = [];
  isPin = false;
  rem: string = null;
  ismenuopened = true;
  data = JSON.parse(localStorage.getItem('userData'));
  constructor(private svc: NotesService, private lsvc: LabelsService, private route: Router,
    private getnotes: GetAllNoteComponent, private snackBar: MatSnackBar) {
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
  reminderPrint(reminder) {
    return timeAgo.format(new Date(reminder));
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
    if (!this.noteshow && !this.opened && this.ismenuopened) {
      if (this.savenote(false)) {
        this.snackBar.open('note saved successfully', 'ok', {
          duration: 2000,
        });
      }
    }
    this.opened = !this.opened;
  }
  pinclicked() {
    this.opened = true;
    this.isPin = !this.isPin;
  }
  menuclicked() {
    this.opened = false;
  }
  menuClosed() {
    this.opened = true;
  }
  menuclicked1() {
    this.ismenuopened = false;
  }
  menuClosed1() {
    this.ismenuopened = true;
    this.opened = true;
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
  stopPropagation(event) {
    event.stopPropagation();
  }
  addnewlabel(newlabel) {
    console.log(newlabel);
    if (newlabel && !this.labelsData.some(ele => ele.label === newlabel)) {
      this.lsvc.createlabel({
        user_id: this.userData.id,
        label: newlabel
      })
        .subscribe(result => {
          const temp = JSON.stringify(result);
          const results = JSON.parse(temp);
          console.log(results.message, ':', results);
          this.labelsData.unshift(results.data);
        },
          error => {
            console.log(error.error.message, ':', error.error);
          });
    }
  }
  removelabel(templabelid) {
    this.notelabels.splice(templabelid, 1);
  }
  addlabel(labele, checked) {
    if (checked) {
      this.notelabels.unshift(labele.label);
      console.log('label pushed');
    } else {
      this.notelabels.splice(this.notelabels.indexOf(labele.label), 1);
      console.log('label removed');
    }
  }

  getOnenote(noteid) {
    this.svc.getOneNote(noteid).subscribe(result => {
      const temp = JSON.stringify(result);
      const results = JSON.parse(temp);
      console.log(results.message, ':', results);
      this.notes.unshift(results.data);
      if (results.data.labels.includes(this.pointer)) {
        this.items.unshift(results.data);
      } else if (this.pointer === 'Fundoo') {
        this.items.unshift(results.data);
      } else if (this.pointer === 'Reminder' && results.data.reminder) {
        this.items.unshift(results.data);
      }
    },
      error => {
        console.log(error.error.message, ':', error.error);
      });

  }
  addlabelstonotes(noteid) {
    this.tempnotelabels.forEach(label => {
      this.lsvc.addNoteLabel({
        note_id: noteid,
        label_id: this.labelsData.filter(el => el.label === label)[0].id
      })
        .subscribe(result => {
          const temp = JSON.stringify(result);
          const results = JSON.parse(temp);
          console.log(results.message, ':', results);
        },
          error => {
            console.log(error.error.message, ':', error.error);
          });
    });

  }
  savenote(isarchieve) {
    const datas = {
      title: this.title,
      desc: this.desc,
      userid: this.data.id,
      rem: this.rem,
      isArchieve: isarchieve,
      colorid: this.colorid,
      isPin: this.isPin
    };
    this.noteshow = true;
    this.title = '';
    this.desc = '';
    this.rem = null;
    this.colorid = 0;
    this.isPin = false;
    this.tempnotelabels = this.notelabels;
    if (this.labelsData.some(ele => ele.label === this.pointer)) {
      this.notelabels = [this.pointer];
    } else {
      this.notelabels = [];
    }
    if (!(/^\s*$/.test(datas.title)) || !(/^\s*$/.test(datas.desc))) {
      console.log(datas);
      this.svc.createnote(datas)
        .subscribe(result => {
          const temp = JSON.stringify(result);
          const results = JSON.parse(temp);
          console.log(results.message, ':', results);
          this.addlabelstonotes(results.id);
          setTimeout(() => {
            this.getOnenote(results.id);
          }, 500);
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
