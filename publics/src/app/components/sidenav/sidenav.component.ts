
import { Component, OnInit } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  constructor(private breakpointObserver: BreakpointObserver, private snackBar: MatSnackBar, private route: Router) { }

  data = JSON.parse(localStorage.getItem('userData'));
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 1 },
          { title: 'Card 4', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Card 1', cols: 2, rows: 1 },
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'Card 3', cols: 1, rows: 2 },
        { title: 'Card 4', cols: 1, rows: 1 }
      ];
    })
  );
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  username = this.data ? this.data.firstname : '';
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
