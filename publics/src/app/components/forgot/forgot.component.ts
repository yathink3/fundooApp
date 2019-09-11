import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../services/users/users.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {
  fogotForm: FormGroup;
  Email = '';
  constructor(private form: FormBuilder, private svc: UsersService, private snackBar: MatSnackBar, private route: Router) {
    // To initialize FormGroup
    this.fogotForm = form.group({
      Email: [null, Validators.compose([Validators.required, Validators.email])],
    });

  }

  ngOnInit() {
  }
  // Executed When Form Is Submitted
  onFormSubmit(form: NgForm) {
    const data = {
      email: this.fogotForm.value.Email,
    };
    console.log(data);
    this.svc.forgotPassword(data)
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
  }


}

