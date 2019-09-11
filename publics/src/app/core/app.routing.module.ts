import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterationComponent } from '../components/registeration/registeration.component';
import { LoginComponent } from '../components/login/login.component';
import { UserComponent } from '../components/user/user.component';
import { ForgotComponent } from '../components/forgot/forgot.component';
import { ResetComponent } from '../components/reset/reset.component';

const routes: Routes = [
  { path: 'user', component: UserComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegisterationComponent },
  { path: 'forgot', component: ForgotComponent },
  { path: 'resetPassword', component: ResetComponent },
  { path: '', component: LoginComponent },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
