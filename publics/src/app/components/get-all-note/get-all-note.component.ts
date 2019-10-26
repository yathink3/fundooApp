declare var require: any;
import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotesService } from '../../services/notes/notes.service';
import { LabelsService } from '../../services/labels/labels.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SinglenoteComponent } from '../singlenote/singlenote.component';
import { filter } from 'rxjs/operators';
const dateFormat = require('dateformat');
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');
@Component({
  selector: 'app-get-all-note',
  templateUrl: './get-all-note.component.html',
  styleUrls: ['./get-all-note.component.scss'],
})
export class GetAllNoteComponent implements OnInit {
  dialoguenote: MatDialogRef<SinglenoteComponent>;
  @Input() pointer;
  @Input() isgrid: boolean;
  @Input() mobileQuery;
  @Input() labelsData;
  @Input() items;
  @Input() colorPalette;
  @Input() userData;
  isMatMenuOpen = false;
  grid = true;
  newlabel = '';
  constructor(private svc: NotesService, private lsvc: LabelsService, private route: Router,
    // tslint:disable-next-line: align
    private router: ActivatedRoute, private snackBar: MatSnackBar, private dialog: MatDialog) {
  }
  ngOnInit() {
  }
  mouseleave(data) {
    if (data === true && this.isMatMenuOpen === true) {
      return true;
    } else if (data === true) {
      return false;
    }
  }
  reminderPrint(reminder) {
    return timeAgo.format(new Date(reminder));
  }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.items, event.previousIndex, event.currentIndex);
      this.svc.dragAndDrop(
        {
          note1_id: this.items[event.previousIndex].id,
          note1_dragid: this.items[event.previousIndex].drag_id,
          note2_id: this.items[event.currentIndex].id,
          note2_dragid: this.items[event.currentIndex].drag_id
        })
        .subscribe(result => {
          const temp = JSON.stringify(result);
          const results = JSON.parse(temp);
          console.log(results.message, ':', results);
          const temperory = this.items[event.previousIndex].drag_id;
          this.items[event.previousIndex].drag_id = this.items[event.currentIndex].drag_id;
          this.items[event.currentIndex].drag_id = temperory;
        },
          error => {
            console.log(error.error.message, ':', error.error);
          });

    }

  }

  menuclicked() {
    this.isMatMenuOpen = true;
  }
  menuClosed() {
    this.isMatMenuOpen = false;
  }
  savereminder() {
  }
  updatecolor(colorid, noteindex, noteid) {
    this.svc.updateNotecolor({ note_id: noteid, color_id: colorid })
      .subscribe(result => {
        const temp = JSON.stringify(result);
        const results = JSON.parse(temp);
        console.log(results.message, ':', results);
        this.items[noteindex].color_id = colorid;
      },
        error => {
          console.log(error.error.message, ':', error.error);
        });
  }
  updatereminder(date, noteindex, noteid) {
    date = date ? dateFormat(date, 'yyyy-mm-dd HH:MM:ss') : null;
    this.svc.updateNoteReminder({ note_id: noteid, reminder: date })
      .subscribe(result => {
        const temp = JSON.stringify(result);
        const results = JSON.parse(temp);
        console.log(results.message, ':', results);
        this.items[noteindex].reminder = date;
      },
        error => {
          console.log(error.error.message, ':', error.error);
        });
  }
  removereminder(noteindex, noteid) {
    this.svc.updateNoteReminder({ note_id: noteid, reminder: null })
      .subscribe(result => {
        const temp = JSON.stringify(result);
        const results = JSON.parse(temp);
        console.log(results.message, ':', results);
        this.items[noteindex].reminder = null;
        if (this.pointer === 'Reminder') {
          this.items.splice(noteindex, 1);
        }
      },
        error => {
          console.log(error.error.message, ':', error.error);
        });
  }
  archievenote(noteindex, noteid) {
    this.svc.archievenote({ note_id: noteid, isArchieve: true })
      .subscribe(result => {
        const temp = JSON.stringify(result);
        const results = JSON.parse(temp);
        console.log(results.message, ':', results);
        this.items.splice(noteindex, 1);
        this.snackBar.open(results.message, 'ok', {
          duration: 2000,
        });
      },
        error => {
          console.log(error.error.message, ':', error.error);
        });
  }
  unarchievenote(noteindex, noteid) {
    this.svc.archievenote({ note_id: noteid, isArchieve: false })
      .subscribe(result => {
        const temp = JSON.stringify(result);
        const results = JSON.parse(temp);
        console.log(results.message, ':', results);
        this.items.splice(noteindex, 1);
        this.snackBar.open('note unarchieved', 'ok', {
          duration: 2000,
        });
      },
        error => {
          console.log(error.error.message, ':', error.error);
        });
  }
  addTrashnote(noteindex, noteid) {
    this.svc.addTrashnote({ note_id: noteid, isTrash: true })
      .subscribe(result => {
        const temp = JSON.stringify(result);
        const results = JSON.parse(temp);
        console.log(results.message, ':', results);
        this.items.splice(noteindex, 1);
        this.snackBar.open(results.message, 'ok', {
          duration: 2000,
        });
      },
        error => {
          console.log(error.error.message, ':', error.error);
        });
  }

  restoreTrashnote(noteindex, noteid) {
    this.svc.addTrashnote({ note_id: noteid, isTrash: false })
      .subscribe(result => {
        const temp = JSON.stringify(result);
        const results = JSON.parse(temp);
        console.log(results.message, ':', results);
        this.items.splice(noteindex, 1);
        this.snackBar.open('note restored', 'ok', {
          duration: 2000,
        });
      },
        error => {
          console.log(error.error.message, ':', error.error);
        });
  }
  deleteNotePermanently(noteindex, noteid) {
    this.svc.deleteNotePermanently(noteid)
      .subscribe(result => {
        const temp = JSON.stringify(result);
        const results = JSON.parse(temp);
        console.log(results.message, ':', results);
        this.items.splice(noteindex, 1);
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
      this.lsvc.addNoteLabel({
        note_id: noteid,
        label_id: labele.id
      })
        .subscribe(result => {
          const temp = JSON.stringify(result);
          const results = JSON.parse(temp);
          console.log(results.message, ':', results);
          this.items[noteindex].labels.unshift(labele.label);
          console.log('label pushed');
        },
          error => {
            console.log(error.error.message, ':', error.error);
          });
    } else {
      this.lsvc.removeNotelabel({
        note_id: noteid,
        label_id: labele.id
      })
        .subscribe(result => {
          const temp = JSON.stringify(result);
          const results = JSON.parse(temp);
          console.log(results.message, ':', results);
          this.items[noteindex].labels.splice(this.items[noteindex].labels.indexOf(labele.label), 1);
          console.log('label removed');
          if (this.pointer === labele.label) {
            this.items.splice(noteindex, 1);
          }
        },
          error => {
            console.log(error.error.message, ':', error.error);
          });
    }
  }

  removelabel(noteindex, noteid, templabelid, labeltemp) {
    this.lsvc.removeNotelabel({
      note_id: noteid,
      label_id: this.labelsData.filter(ele => ele.label === this.items[noteindex].labels[templabelid])[0].id
    })
      .subscribe(result => {
        const temp = JSON.stringify(result);
        const results = JSON.parse(temp);
        console.log(results.message, ':', results);
        this.items[noteindex].labels.splice(templabelid, 1);
        console.log('label removed');
        if (this.pointer === labeltemp) {
          this.items.splice(noteindex, 1);
        }
      },
        error => {
          console.log(error.error.message, ':', error.error);
        });
  }
  addnewlabel() {
    if (this.newlabel && !this.labelsData.some(ele => ele.label === this.newlabel)) {
      this.lsvc.createlabel({
        user_id: this.userData.id,
        label: this.newlabel.toLowerCase()
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
  openDialog(noteindex, itemdata) {
    this.items[noteindex].hiden = true;
    const olddata = { title: itemdata.title, description: itemdata.description };
    this.dialoguenote = this.dialog.open(SinglenoteComponent, {
      panelClass: 'my-dialogue',
      data: {
        itemdataa: itemdata,
        labeldataa: this.labelsData,
        colorPalettea: this.colorPalette,
        userida: this.userData.id,
        pointer: this.pointer
      }
    });


    this.dialoguenote
      .afterClosed()
      .subscribe(item => {
        if (!['Fundoo', 'Archieve', 'Reminder', 'Bin'].includes(this.pointer)) {
          if (!itemdata.labels.includes(this.pointer)) {
            console.log('label removed');
            this.items.splice(noteindex, 1);
          }
        }
        if (this.pointer === 'Reminder' && !itemdata.reminder) {
          console.log('removed');
          this.items.splice(noteindex, 1);
        }
        this.updatenotesdata(itemdata, olddata);
        if (item) {
          if (item.trash === true) {
            this.addTrashnote(noteindex, itemdata.id);
          }
          if (item.trash === false) {
            this.restoreTrashnote(noteindex, itemdata.id);
          }
          if (item.archieve === true) {
            this.archievenote(noteindex, itemdata.id);
          }
          if (item.archieve === false) {
            this.unarchievenote(noteindex, itemdata.id);
          }
          if (item.delete === true) {
            this.deleteNotePermanently(noteindex, itemdata.id);
          }
        }
        this.items[noteindex].hiden = false;
      });
  }
  updatenotesdata(itemdata, olddata) {
    if (itemdata.title !== olddata.title || itemdata.description !== olddata.description) {
      this.svc.updateNotes({ note_id: itemdata.id, title: itemdata.title, description: itemdata.description })
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
  }

}
