import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomMaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ClickOutsideModule } from 'ng-click-outside';

import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RegisterationComponent } from './components/registeration/registeration.component';
import { ForgotComponent } from './components/forgot/forgot.component';
import { ResetComponent } from './components/reset/reset.component';
import { ValidateComponent } from './components/validate/validate.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NoteComponent } from './components/note/note.component';
import { GetAllNoteComponent } from './components/get-all-note/get-all-note.component';
import { SinglenoteComponent } from './components/singlenote/singlenote.component';
import { EditlabelComponent } from './components/editlabel/editlabel.component';


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
    EditlabelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CustomMaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DragDropModule,
    ClickOutsideModule
  ],
  entryComponents: [SinglenoteComponent, EditlabelComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
