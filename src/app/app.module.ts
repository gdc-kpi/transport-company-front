import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { LogInComponent } from './log-in/log-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { RestorePasswordComponent } from './restore-password/restore-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserActivationComponent } from './user-activation/user-activation.component';
import { ChangeForgottenPasswordComponent } from './change-forgotten-password/change-forgotten-password.component';
import { LandingPageDriverComponent } from './landing-page-driver/landing-page-driver.component';
import { LandingPageAdminComponent } from './landing-page-admin/landing-page-admin.component';
import { OrderComponent } from './order/order.component';
import { GoogleMapsModule } from '@angular/google-maps'

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTabsModule} from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InviteAdminComponent } from './invite-admin/invite-admin.component';
import { NewAdminPasswordComponent } from './new-admin-password/new-admin-password.component';
@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    LogInComponent,
    SignUpComponent,
    RestorePasswordComponent,
    UserActivationComponent,
    ChangeForgottenPasswordComponent,
    LandingPageDriverComponent,
    LandingPageAdminComponent,
    OrderComponent,
    InviteAdminComponent,
    NewAdminPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    GoogleMapsModule,
    MatFormFieldModule,
    BrowserModule,
     FormsModule,
     BrowserAnimationsModule,MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
