import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditlabelComponent } from './editlabel.component';

describe('EditlabelComponent', () => {
  let component: EditlabelComponent;
  let fixture: ComponentFixture<EditlabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditlabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditlabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
