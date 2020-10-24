import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { RestorePasswordComponent } from './restore-password/restore-password.component';
import { UserActivationComponent } from './user-activation/user-activation.component';
import { LandingAuthUserComponent } from './landing-auth-user/landing-auth-user.component';
import { ChangeForgottenPasswordComponent } from './change-forgotten-password/change-forgotten-password.component';


const routes: Routes = [
  { path: 'login', component: LogInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'restore-password', component: RestorePasswordComponent },
  { path: 'activate', component: UserActivationComponent },
  { path: 'recovery', component: ChangeForgottenPasswordComponent },
  { path: 'app', component: LandingAuthUserComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
