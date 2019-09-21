import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterationComponent } from '../components/registeration/registeration.component';
import { LoginComponent } from '../components/login/login.component';
import { ForgotComponent } from '../components/forgot/forgot.component';
import { ResetComponent } from '../components/reset/reset.component';
import { ValidateComponent } from '../components/validate/validate.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { SidenavComponent } from '../components/sidenav/sidenav.component';

const routes: Routes = [
  { path: 'dash', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegisterationComponent },
  { path: 'forgot', component: ForgotComponent },
  { path: 'resetPassword', component: ResetComponent },
  { path: 'validate', component: ValidateComponent },
  { path: '', component: LoginComponent },
  { path: 'temp', component: SidenavComponent }

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
