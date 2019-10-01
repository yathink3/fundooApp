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
@Component({
  selector: 'app-get-all-note',
  templateUrl: './get-all-note.component.html',
  styleUrls: ['./get-all-note.component.css'],
})
export class GetAllNoteComponent implements OnInit {
  dialoguenote: MatDialogRef<SinglenoteComponent>;
  @Input() isgrid: boolean;
  @Input() labelsData;
  @Input() items;
  @Input() colorPalette;
  @Input() userData;
  isMatMenuOpen = false;
  grid = true;
  newlabel = '';
  constructor(private svc: NotesService, private lsvc: LabelsService, private route: Router,
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
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
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
        },
          error => {
            console.log(error.error.message, ':', error.error);
          });
    }
  }

  removelabel(noteindex, noteid, templabelid) {
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
      },
        error => {
          console.log(error.error.message, ':', error.error);
        });
  }
  addnewlabel() {
    if (this.newlabel && !this.labelsData.some(ele => ele.label === this.newlabel)) {
      this.lsvc.createlabel({
        user_id: this.userData.id,
        label: this.newlabel
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
    const olddata = { title: itemdata.title, description: itemdata.description };
    this.dialoguenote = this.dialog.open(SinglenoteComponent, {
      panelClass: 'my-dialogue',
      data: {
        itemdataa: itemdata,
        labeldataa: this.labelsData,
        colorPalettea: this.colorPalette,
        userida: this.userData.id
      }
    });


    this.dialoguenote
      .afterClosed()
      .subscribe(item => {
        this.updatenotesdata(itemdata, olddata);
        if (item) {
          if (item.trash) {
            this.archievenote(noteindex, itemdata.id);
          } else if (item.archieve) {
            this.addTrashnote(noteindex, itemdata.id);
          }
        }
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
