import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../services/users/users.service';
@Component({
  selector: 'app-registeration',
  templateUrl: './registeration.component.html',
  styleUrls: ['./registeration.component.css']
})
export class RegisterationComponent implements OnInit {
  regiForm: FormGroup;
  FirstName = '';
  LastName = '';
  Email = '';
  Password = '';
  constructor(private form: FormBuilder, private svc: UsersService, private snackBar: MatSnackBar, private route: Router) {
    // To initialize FormGroup
    this.regiForm = form.group({
      FirstName: [null, Validators.required],
      LastName: [null, Validators.required],
      Email: [null, Validators.compose([Validators.required, Validators.email])],
      Password: [null, Validators.compose([Validators.required, Validators.pattern(
        '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')])]
    });

  }



  ngOnInit() {
  }

  // Executed When Form Is Submitted
  onFormSubmit(form: NgForm) {
    const data = {
      firstname: this.regiForm.value.FirstName,
      lastname: this.regiForm.value.LastName,
      email: this.regiForm.value.Email,
      password: this.regiForm.value.Password
    };
    console.log(data);
    this.svc.register(data)
      .subscribe(result => {
        const temp = JSON.stringify(result);
        const results = JSON.parse(temp);
        console.log(results.message, ':', results);
        this.snackBar.open(results.message, 'ok', {
          duration: 2000,
        });
        this.route.navigate(['/login']);
      },
        error => {
          console.log(error.error.message, ':', error.error);
          this.snackBar.open(error.error.message, 'ok', {
            duration: 2000,
          });
        });

  }
}

