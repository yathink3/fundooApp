import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../services/users/users.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  resetForm: FormGroup;
  Password = '';
  cPassword = '';
  constructor(private form: FormBuilder, private svc: UsersService, private snackBar: MatSnackBar, private route: Router,
    private activatedRoute: ActivatedRoute) {
    // To initialize FormGroup
    this.resetForm = form.group({
      Password: [null, Validators.compose([Validators.required, Validators.pattern(
        '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')])],
      cPassword: [null, Validators.compose([Validators.required, Validators.pattern(
        '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')])],
    });
  }


  ngOnInit() {
  }
  ischeck() {
    return (this.resetForm.get('Password').valid && this.resetForm.get('cPassword').valid) ?
      (!(this.resetForm.value.Password === this.resetForm.value.cPassword) ? false : true) : true;
  }
  // Executed When Form Is Submitted
  onFormSubmit(form: NgForm) {
    const data = {
      password: this.resetForm.value.Password,
      cPassword: this.resetForm.value.cPassword
    };
    console.log(data);
    const token = this.activatedRoute.snapshot.queryParamMap.get('token');
    this.svc.resetPassword(token, data)
      .subscribe(result => {
        const temp = JSON.stringify(result);
        const results = JSON.parse(temp);
        console.log(results.message, ':', results);
        this.snackBar.open(results.message, 'ok', {
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
  }

}


