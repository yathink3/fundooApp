import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatTableModule,
  MatToolbarModule, MatMenuModule, MatIconModule, MatProgressSpinnerModule, MatFormFieldModule,
  MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatSelectModule, MatOptionModule,
  MatSlideToggleModule, ErrorStateMatcher, ShowOnDirtyErrorStateMatcher, MatCheckboxModule, MatSnackBarModule, MatGridListModule,
  MatSidenavModule, MatListModule, MatButtonToggleModule, MatTooltipModule, MatChipsModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider, } from 'angularx-social-login';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('636559597730-6fm0o7jslsjsbptgdsmag3trljeag6uv.apps.googleusercontent.com')
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('2446314605580921')
  }
]);

export function provideConfig() {
  return config;
}
fdescribe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        MatButtonModule, MatCardModule, MatInputModule, MatTableModule,
        MatIconModule, MatFormFieldModule,
        MatRadioModule, MatSelectModule, MatOptionModule,
        MatCheckboxModule, MatSnackBarModule,
        MatButtonToggleModule, MatTooltipModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        CommonModule,
        RouterModule,
        RouterTestingModule,
        SocialLoginModule,
        BrowserAnimationsModule
      ],
      providers: [{
        provide: AuthServiceConfig,
        useFactory: provideConfig
      }],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('form should valid', async(() => {
    component.loginForm.controls.Email.setValue('mureharshavardhini@gmail.com');
    component.loginForm.controls.Password.setValue('mureharshavardhin');
    expect(component.loginForm.valid).toBeTruthy();
  }
  ));
});
