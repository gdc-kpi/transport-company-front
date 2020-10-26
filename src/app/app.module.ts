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
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
