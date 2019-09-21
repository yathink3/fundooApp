import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnDestroy, OnInit {
  mobileQuery: MediaQueryList;
  show: boolean = true;
  searchtouch = false;
  searched = '';
  private mobileQueryListener: () => void;
  data = JSON.parse(localStorage.getItem('userData'));
  username: string;
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private snackBar: MatSnackBar, private route: Router) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    // tslint:disable-next-line: deprecation
    this.mobileQuery.addListener(this.mobileQueryListener);
    this.username = this.data ? this.data.firstname : '';
  }

  medri() {
    this.searchtouch = true;
  }

  clear() {
    this.searched = '';
    this.searchtouch = false;
  }
  view_mode() {
    this.show = this.show ? false : true;
  }
  ngOnDestroy(): void {
    // tslint:disable-next-line: deprecation
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }
  crossMark() {
    this.searchtouch = true;
  }
  ngOnInit() {
    if (!this.data) {
      this.snackBar.open('no one signed in', 'ok', {
        duration: 2000,
      });
      this.route.navigate(['/']);
    }
  }
  signOut() {
    console.log(this.data.firstname + ' signout successfully');
    this.snackBar.open(this.data.firstname + ' signed out successfully', 'ok', {
      duration: 2000,
    });
    localStorage.removeItem('userData');
    this.route.navigate(['/']);
  }

}

