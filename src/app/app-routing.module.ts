import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { RestorePasswordComponent } from './restore-password/restore-password.component';
import { UserActivationComponent } from './user-activation/user-activation.component';
import { ChangeForgottenPasswordComponent } from './change-forgotten-password/change-forgotten-password.component';
import { LandingPageDriverComponent } from './landing-page-driver/landing-page-driver.component';
import { LandingPageAdminComponent } from './landing-page-admin/landing-page-admin.component';
import { OrderComponent } from './order/order.component';
import { InviteAdminComponent } from './invite-admin/invite-admin.component';


const routes: Routes = [
  { path: 'login', component: LogInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'restore-password', component: RestorePasswordComponent },
  { path: 'activate', component: UserActivationComponent },
  { path: 'recovery', component: ChangeForgottenPasswordComponent },
  { path: 'app/driver', component: LandingPageDriverComponent },
  { path: 'app/admin', component: LandingPageAdminComponent },
  { path: 'app/admin/order', component: OrderComponent },
  { path: 'app/admin/invite', component: InviteAdminComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
