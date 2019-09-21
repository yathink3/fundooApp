import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllNoteComponent } from './get-all-note.component';

describe('GetAllNoteComponent', () => {
  let component: GetAllNoteComponent;
  let fixture: ComponentFixture<GetAllNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetAllNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetAllNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
