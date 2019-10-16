declare var require: any;
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotesService } from '../../services/notes/notes.service';
import { LabelsService } from '../../services/labels/labels.service';
const dateFormat = require('dateformat');
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');
@Component({
  selector: 'app-singlenote',
  templateUrl: './singlenote.component.html',
  styleUrls: ['./singlenote.component.scss']
})
export class SinglenoteComponent implements OnInit {
  colorPalette;
  itemdata;
  labeldata;
  userid;
  constructor(private svc: NotesService, private lsvc: LabelsService, private dialogRef: MatDialogRef<SinglenoteComponent>,
    // tslint:disable-next-line: align
    @Inject(MAT_DIALOG_DATA) private data) {
    this.itemdata = this.data.itemdataa;
    this.labeldata = this.data.labeldataa;
    this.colorPalette = this.data.colorPalettea;
    this.userid = this.data.userida;
  }

  ngOnInit() {

  }
  reminderPrint(reminder) {
    return timeAgo.format(new Date(reminder));
  }
  stopPropagation(event) {
    event.stopPropagation();
  }
  medri() {
    this.itemdata.title = this.itemdata.title.replace('\n', ' ');
  }
  updatecolor(colorid) {
    this.svc.updateNotecolor({ note_id: this.itemdata.id, color_id: colorid })
      .subscribe(result => {
        const temp = JSON.stringify(result);
        const results = JSON.parse(temp);
        console.log(results.message, ':', results);
        this.itemdata.color_id = colorid;
      },
        error => {
          console.log(error.error.message, ':', error.error);
        });
  }
  updatereminder(date) {
    date = date ? dateFormat(date, 'yyyy-mm-dd HH:MM:ss') : null;
    this.svc.updateNoteReminder({ note_id: this.itemdata.id, reminder: date })
      .subscribe(result => {
        const temp = JSON.stringify(result);
        const results = JSON.parse(temp);
        console.log(results.message, ':', results);
        this.itemdata.reminder = date;
      },
        error => {
          console.log(error.error.message, ':', error.error);
        });
  }
  removereminder() {
    this.svc.updateNoteReminder({ note_id: this.itemdata.id, reminder: null })
      .subscribe(result => {
        const temp = JSON.stringify(result);
        const results = JSON.parse(temp);
        console.log(results.message, ':', results);
        this.itemdata.reminder = null;
      },
        error => {
          console.log(error.error.message, ':', error.error);
        });
  }
  archievenote() {
    this.dialogRef.close({ archieve: true });
  }
  unarchievenote() {
    this.dialogRef.close({ archieve: false });
  }
  addTrashnote() {
    this.dialogRef.close({ trash: true });
  }
  restoreTrashnote() {
    this.dialogRef.close({ trash: false });
  }
  deleteNotePermanently() {
    this.dialogRef.close({ delete: true });
  }
  addnewlabel(newlabel) {
    console.log(newlabel);
    if (newlabel && !this.labeldata.some(ele => ele.label === newlabel)) {
      this.lsvc.createlabel({
        user_id: this.userid,
        label: newlabel
      })
        .subscribe(result => {
          const temp = JSON.stringify(result);
          const results = JSON.parse(temp);
          console.log(results.message, ':', results);
          this.labeldata.unshift(results.data);
        },
          error => {
            console.log(error.error.message, ':', error.error);
          });
    }
  }
  removelabel(templabelid) {
    this.lsvc.removeNotelabel({
      note_id: this.itemdata.id,
      label_id: this.labeldata.filter(ele => ele.label === this.itemdata.labels[templabelid])[0].id
    })
      .subscribe(result => {
        const temp = JSON.stringify(result);
        const results = JSON.parse(temp);
        console.log(results.message, ':', results);
        this.itemdata.labels.splice(templabelid, 1);
        console.log('label removed');
      },
        error => {
          console.log(error.error.message, ':', error.error);
        });
  }
  addlabel(labele, checked) {
    if (checked) {
      this.lsvc.addNoteLabel({
        note_id: this.itemdata.id,
        label_id: labele.id
      })
        .subscribe(result => {
          const temp = JSON.stringify(result);
          const results = JSON.parse(temp);
          console.log(results.message, ':', results);
          this.itemdata.labels.unshift(labele.label);
          console.log('label pushed');
        },
          error => {
            console.log(error.error.message, ':', error.error);
          });
    } else {
      this.lsvc.removeNotelabel({
        note_id: this.itemdata.id,
        label_id: labele.id
      })
        .subscribe(result => {
          const temp = JSON.stringify(result);
          const results = JSON.parse(temp);
          console.log(results.message, ':', results);
          this.itemdata.labels.splice(this.itemdata.labels.indexOf(labele.label), 1);
          console.log('label removed');
        },
          error => {
            console.log(error.error.message, ':', error.error);
          });
    }
  }
  updatenote() {
    this.dialogRef.close();
  }
}
