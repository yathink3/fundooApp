import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../services/users/users.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  Email = '';
  Password = '';
  constructor(private form: FormBuilder, private svc: UsersService, private snackBar: MatSnackBar, private route: Router) {
    // To initialize FormGroup
    this.loginForm = form.group({
      Email: [null, Validators.compose([Validators.required, Validators.email])],
      Password: [null, Validators.compose([Validators.required])]
    });

  }

  // Executed When Form Is Submitted
  onFormSubmit(form: NgForm) {
    const data = {
      email: this.loginForm.value.Email,
      password: this.loginForm.value.Password
    };
    console.log(data);
    this.svc.login(data)
      .subscribe(result => {
        const temp = JSON.stringify(result);
        const results = JSON.parse(temp);
        console.log(results.message, ':', results);
        this.snackBar.open(results.message, 'ok', {
          duration: 2000,
        });
        const userdata = {
          firstname: results.data.firstname,
          lastname: results.data.firstname,
          email: results.data.email
        };
        localStorage.setItem('userData', JSON.stringify(userdata));
        console.log(results.data);
        this.route.navigate(['/user']);
      },
        error => {
          console.log(error.error.message, ':', error.error);
          this.snackBar.open(error.error.message, 'ok', {
            duration: 2000,
          });
        });
  }
}

