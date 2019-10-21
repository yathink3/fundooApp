declare var require: any;
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { NotesService } from 'src/app/services/notes/notes.service';
import { UsersService } from 'src/app/services/users/users.service';
import { LabelsService } from 'src/app/services/labels/labels.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { EditlabelComponent } from '../editlabel/editlabel.component';
const dateFormat = require('dateformat');
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy, OnInit {
  dialoguenote: MatDialogRef<EditlabelComponent>;
  mobileQuery: MediaQueryList;
  isgrid = true;
  trigger = true;
  searched = '';
  labelsData = [];
  notes = [];
  items = [];
  notelabels = [];
  pointer = 'Fundoo';
  temp;
  isrefreshclick = false;
  private mobileQueryListener: () => void;
  userData = JSON.parse(localStorage.getItem('userData'));
  username: string;
  emailid: string;
  profilepic: string;
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
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private snackBar: MatSnackBar, private usvc: UsersService,
    // tslint:disable-next-line: align
    private route: Router, private svc: NotesService, private lsvc: LabelsService, private dialog: MatDialog) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    // tslint:disable-next-line: deprecation
    this.mobileQuery.addListener(this.mobileQueryListener);
    this.username = this.userData ? this.userData.firstname + ' ' + this.userData.lastname : '';
    this.emailid = this.userData ? this.userData.email : '';
    this.profilepic = this.userData ? this.userData.profilepic : '';
  }

  view_mode() {
    this.isgrid = this.isgrid ? false : true;
  }
  ngOnDestroy(): void {
    // tslint:disable-next-line: deprecation
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }
  ngOnInit() {
    if (!this.userData) {
      this.snackBar.open('no one signed in', 'ok', {
        duration: 2000,
      });
      this.route.navigate(['/']);
    }
    this.getAllLabels();
    this.noteclicked();
  }
  stopPropagation(event) {
    event.stopPropagation();
  }
  noteclicked() {
    this.notelabels = [];
    this.getAllNotes();
    setTimeout(() => {
      this.items = this.notes.filter(ele => ele.isArchieve === '0').filter(ele => ele.isTrash === '0');
      this.items.sort((a, b) => (b.isPin - a.isPin));
    }, 200);
  }
  reminderclicked() {
    this.notelabels = [];
    this.getAllNotes();
    setTimeout(() => {
      this.items = this.notes.filter(ele => ele.isTrash === '0').filter(ele => ele.reminder);
    }, 200);
  }
  archieveclicked() {
    this.notelabels = [];
    this.getAllNotes();
    setTimeout(() => {
      this.items = this.notes.filter(ele => ele.isArchieve === '1').filter(ele => ele.isTrash === '0');
    }, 200);
  }
  deleteclicked() {
    this.notelabels = [];
    this.getAllNotes();
    setTimeout(() => {
      this.items = this.notes.filter(ele => ele.isTrash === '1');
    }, 200);
  }
  labelclicked(label) {
    this.notelabels = [label];
    this.items = this.notes.filter(ele => ele.labels.includes(label)).filter(ele => ele.isTrash === '0');
  }
  addaccont() {
    this.route.navigate(['/']);
  }
  signOut() {
    console.log(this.userData.firstname + ' signout successfully');
    this.snackBar.open(this.userData.firstname + ' signed out successfully', 'ok', {
      duration: 2000,
    });
    localStorage.removeItem('userData');
    this.route.navigate(['/']);
  }
  getAllLabels() {
    this.lsvc.getAllLabels(this.userData.id)
      .subscribe(result => {
        const temp = JSON.stringify(result);
        const results = JSON.parse(temp);
        console.log(results.message, ':', results);
        this.labelsData = results.data;
        console.log(this.labelsData);
      },
        error => {
          console.log(error.error.message, ':', error.error);
        });
  }
  getAllNotes() {
    this.svc.getAllNotes(this.userData.id)
      .subscribe(result => {
        const temp = JSON.stringify(result);
        const results = JSON.parse(temp);
        console.log(results.message, ':', results);
        this.notes = results.data;
        console.log(this.notes);
      },
        error => {
          console.log(error.error.message, ':', error.error);
        });
  }
  searching(searchdata) {
    if (!(/^\s*$/.test(searchdata))) {
      setTimeout(() => {
        this.items = this.notes.filter(ele => (ele.title.toLowerCase().match(searchdata.toLowerCase())
          || ele.description.toLowerCase().match(searchdata.toLowerCase())));
      }, 200);
    } else {
      this.searchclear();
    }
  }
  searchclicked() {
    this.temp = JSON.parse(JSON.stringify(this.items));
  }
  searchclear() {
    setTimeout(() => {
      this.items = this.temp;
    }, 200);
  }
  editlabeldialogue() {
    this.dialoguenote = this.dialog.open(EditlabelComponent, {
      data: { labelsdaata: this.labelsData, useraid: this.userData.id },
    });
  }
  refresh() {
    this.pointer = 'Fundoo';
    this.getAllLabels();
    this.noteclicked();
    setTimeout(() => {
      this.isrefreshclick = false;
    }, 1000);
  }
  onSelectImage(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      // tslint:disable-next-line: no-shadowed-variable
      reader.onload = (event: ProgressEvent) => {
        this.profilepic = ((event.target as FileReader).result).toString();
        this.uploadProfilePic();
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  uploadProfilePic() {
    console.log(this.profilepic);
    this.usvc.uploadProfilePic({ profilepic: this.profilepic, id: this.userData.id })
      .subscribe(result => {
        const temp = JSON.stringify(result);
        const results = JSON.parse(temp);
        console.log(results.message, ':', results);
        this.profilepic = results.data;
        this.userData.profilepic = this.profilepic;
        localStorage.setItem('userData', JSON.stringify(this.userData));
        console.log(this.profilepic);
      },
        error => {
          console.log(error.error.message, ':', error);
        });
  }
}
