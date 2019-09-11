import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../services/users/users.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-validate',
  templateUrl: './validate.component.html',
  styleUrls: ['./validate.component.css']
})
export class ValidateComponent implements OnInit {

  constructor(private svc: UsersService, private snackBar: MatSnackBar, private route: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    const token = this.activatedRoute.snapshot.queryParamMap.get('token');
    this.svc.validation(token)
      .subscribe(result => {
        console.log(result.message, ':', result);
        this.snackBar.open(result.message, 'ok', {
          duration: 2000,
        });
        this.route.navigate(['/']);
      },
        error => {
          console.log(error.error.message, ':', error.error);
          this.snackBar.open(error.error.message, 'ok', {
            duration: 2000,
          });
        });
    this.route.navigate(['/']);
  }

}
