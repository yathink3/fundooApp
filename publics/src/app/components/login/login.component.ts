import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../services/users/users.service';
import { AuthService } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private user;
  private loggedIn: boolean;
  loginForm: FormGroup;
  Email = '';
  Password = '';
  constructor(private form: FormBuilder, private svc: UsersService, private snackBar: MatSnackBar,
    // tslint:disable-next-line: align
    private route: Router, private authService: AuthService) {
    // To initialize FormGroup
    this.loginForm = form.group({
      Email: [null, Validators.compose([Validators.required, Validators.email])],
      Password: [null, Validators.compose([Validators.required])]
    });

  }
  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
  }
  // Executed When Form Is Submitted
  onFormSubmit(form: NgForm) {
    const data = {
      email: this.loginForm.value.Email,
      password: this.loginForm.value.Password
    };
    console.log(data);
    // tslint:disable-next-line: no-debugger
    this.svc.login(data)
      .subscribe(result => {
        const temp = JSON.stringify(result);
        const results = JSON.parse(temp);
        console.log(results.message, ':', results);
        this.snackBar.open(results.message, 'ok', {
          duration: 2000,
        });
        const userdata = {
          id: results.data.id,
          firstname: results.data.firstname,
          lastname: results.data.lastname,
          email: results.data.email,
          profilepic: results.data.profilepic,
        };
        localStorage.setItem('userData', JSON.stringify(userdata));
        console.log(results.data);
        this.route.navigate(['/dashboard']);
      },
        error => {
          console.log(error.error.message, ':', error.error);
          this.snackBar.open(error.error.message, 'ok', {
            duration: 2000,
          });
        });
  }
  async signInWithGoogle() {
    await this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.sociallogin();

  }

  async signInWithFB() {

    await this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.sociallogin();
  }

  signOut(): void {
    this.authService.signOut();
  }

  sociallogin() {
    console.log('photo url:', this.user.photoUrl);
    console.log('user name:', this.user.name);
    console.log('user email:', this.user.email);
    const data = {
      firstname: this.user.name,
      lastname: '',
      email: this.user.email,
      password: '',
      profilepic: this.user.photoUrl
    };
    console.log(data);
    this.svc.sociallogin(data)
      .subscribe(result => {
        const temp = JSON.stringify(result);
        const results = JSON.parse(temp);
        console.log(results.message, ':', results);
        this.snackBar.open(results.message, 'ok', {
          duration: 2000,
        });
        const userdata = {
          id: results.data.id,
          firstname: results.data.firstname,
          lastname: results.data.lastname,
          email: results.data.email,
          profilepic: results.data.profilepic,
        };
        localStorage.setItem('userData', JSON.stringify(userdata));
        console.log(results.data);
        this.route.navigate(['/dashboard']);
      },
        error => {
          console.log(error.error.message, ':', error.error);
          this.snackBar.open(error.error.message, 'ok', {
            duration: 2000,
          });
        });
  }
}


