declare var require: any;
import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotesService } from '../../services/notes/notes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
const dateFormat = require('dateformat');
@Component({
  selector: 'app-get-all-note',
  templateUrl: './get-all-note.component.html',
  styleUrls: ['./get-all-note.component.css'],
})
export class GetAllNoteComponent implements OnInit {
  @Input() isgrid: boolean;
  items = [];
  isMatMenuOpen = false;
  grid = true;
  newlabel = '';
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
  labelsData = ['manoj', 'narayan'];
  data = JSON.parse(localStorage.getItem('userData'));
  constructor(private svc: NotesService, private route: Router, private router: ActivatedRoute, private snackBar: MatSnackBar) {
  }
  ngOnInit() {
    this.displayallnaotes();
  }
  displayallnaotes() {
    this.svc.getAllNotes(this.data.id)
      .subscribe(result => {
        const temp = JSON.stringify(result);
        const results = JSON.parse(temp);
        console.log(results.message, ':', results);
        this.items = results.data;
        this.items.forEach(im => {
          im.labels = [];
        });
        console.log(this.items);
      },
        error => {
          console.log(error.error.message, ':', error.error);
        });
  }
  refresh($event) {
    this.displayallnaotes();
  }
  mouseleave(data) {
    if (data === true && this.isMatMenuOpen === true) {
      return true;
    } else if (data === true) {
      return false;
    }
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  }

  menuclicked() {
    this.isMatMenuOpen = true;
  }
  menuClosed() {
    this.isMatMenuOpen = false;
    return false;
  }
  savereminder() {
  }
  updatecolor(colorid, noteindex, noteid) {
    this.items[noteindex].color_id = colorid;
    this.svc.updateNotecolor({ note_id: noteid, color_id: colorid })
      .subscribe(result => {
        const temp = JSON.stringify(result);
        const results = JSON.parse(temp);
        console.log(results.message, ':', results);

      },
        error => {
          console.log(error.error.message, ':', error.error);
        });
  }
  updatereminder(date, noteindex, noteid) {
    date = date ? dateFormat(date, 'yyyy-mm-dd HH:MM:ss') : null;
    this.items[noteindex].reminder = date;
    this.svc.updateNoteReminder({ note_id: noteid, reminder: date })
      .subscribe(result => {
        const temp = JSON.stringify(result);
        const results = JSON.parse(temp);
        console.log(results.message, ':', results);
      },
        error => {
          console.log(error.error.message, ':', error.error);
        });
  }
  removereminder(noteindex, noteid) {
    this.items[noteindex].reminder = null;
    this.svc.updateNoteReminder({ note_id: noteid, reminder: null })
      .subscribe(result => {
        const temp = JSON.stringify(result);
        const results = JSON.parse(temp);
        console.log(results.message, ':', results);
      },
        error => {
          console.log(error.error.message, ':', error.error);
        });
  }
  archievenote(noteindex, noteid) {
    this.items.splice(noteindex, 1);
    this.svc.archievenote({ note_id: noteid, isArchieve: true })
      .subscribe(result => {
        const temp = JSON.stringify(result);
        const results = JSON.parse(temp);
        console.log(results.message, ':', results);
        this.snackBar.open(results.message, 'ok', {
          duration: 2000,
        });
      },
        error => {
          console.log(error.error.message, ':', error.error);
        });
  }
  addTrashnote(noteindex, noteid) {
    this.items.splice(noteindex, 1);
    this.svc.addTrashnote({ note_id: noteid, isTrash: true })
      .subscribe(result => {
        const temp = JSON.stringify(result);
        const results = JSON.parse(temp);
        console.log(results.message, ':', results);
        this.snackBar.open(results.message, 'ok', {
          duration: 2000,
        });
      },
        error => {
          console.log(error.error.message, ':', error.error);
        });
  }
  stopPropagation(event) {
    event.stopPropagation();
  }
  addlabel(noteindex, noteid, labele, check) {
    if (check) {
      this.items[noteindex].labels.push(labele);
      console.log('label pushed');
    } else {
      // this.items[noteindex].labels.slice(labele);
      console.log('label removed');
    }
    console.log(this.items);
    console.log(this.items[0].labels[0]);
  }
  removelabel(noteindex, noteid, templabelid) {
    this.items[noteindex].labels.splice(templabelid, 1);
  }
  addnewlabel() {
    if (this.newlabel && !this.labelsData.includes(this.newlabel)) {
      this.labelsData.push(this.newlabel);
    }
  }
}
