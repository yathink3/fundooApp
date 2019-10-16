import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterationComponent } from './components/registeration/registeration.component';
import { ForgotComponent } from './components/forgot/forgot.component';
import { ResetComponent } from './components/reset/reset.component';
import { ValidateComponent } from './components/validate/validate.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegisterationComponent },
  { path: 'forgot', component: ForgotComponent },
  { path: 'resetPassword', component: ResetComponent },
  { path: 'validate', component: ValidateComponent },
  { path: 'dashboard', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
