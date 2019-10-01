import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { NotesService } from 'src/app/services/notes/notes.service';
import { LabelsService } from 'src/app/services/labels/labels.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnDestroy, OnInit {
  mobileQuery: MediaQueryList;
  isgrid: boolean = true;
  trigger = true;
  searched = '';
  labelsData = [];
  notes = [];
  pointer = 'Note';
  private mobileQueryListener: () => void;
  userData = JSON.parse(localStorage.getItem('userData'));
  username: string;
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
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private snackBar: MatSnackBar,
    private route: Router, private svc: NotesService, private lsvc: LabelsService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    // tslint:disable-next-line: deprecation
    this.mobileQuery.addListener(this.mobileQueryListener);
    this.username = this.userData ? this.userData.firstname : '';
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
    this.getAllNotes();
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
}

