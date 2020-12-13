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
import { NewAdminPasswordComponent } from './new-admin-password/new-admin-password.component';
import {CarCreatingComponent} from './car-creating/car-creating.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {ShowDaysOffComponent} from './show-days-off/show-days-off.component';


const routes: Routes = [
  { path: 'login', component: LogInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'restore-password', component: RestorePasswordComponent },
  { path: 'activate', component: UserActivationComponent },
  { path: 'recovery', component: ChangeForgottenPasswordComponent },
  { path: 'app/driver', component: LandingPageDriverComponent },
  { path: 'admin-activate', component: NewAdminPasswordComponent, },
  { path: 'app/admin', component: LandingPageAdminComponent },
  { path: 'app/admin/order', component: OrderComponent },
  { path: 'app/admin/invite', component: InviteAdminComponent },
  { path: 'app/admin/car-creating', component: CarCreatingComponent },
  { path: 'app/change-password', component: ChangePasswordComponent },
  { path: 'app/driver/show-days-off', component: ShowDaysOffComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
