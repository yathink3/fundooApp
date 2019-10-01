import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './core/app.routing.module';
import { CustomMaterialModule } from './core/material.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ClickOutsideModule } from 'ng-click-outside';

import { RegisterationComponent } from './components/registeration/registeration.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotComponent } from './components/forgot/forgot.component';
import { ResetComponent } from './components/reset/reset.component';
import { ValidateComponent } from './components/validate/validate.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NoteComponent } from './components/note/note.component';
import { GetAllNoteComponent } from './components/get-all-note/get-all-note.component';
import { SinglenoteComponent } from './components/singlenote/singlenote.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterationComponent,
    LoginComponent,
    ForgotComponent,
    ResetComponent,
    ValidateComponent,
    DashboardComponent,
    NoteComponent,
    GetAllNoteComponent,
    SinglenoteComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FlexLayoutModule,
    DragDropModule,
    ClickOutsideModule
  ],
  entryComponents: [SinglenoteComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
