import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglenoteComponent } from './singlenote.component';

describe('SinglenoteComponent', () => {
  let component: SinglenoteComponent;
  let fixture: ComponentFixture<SinglenoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SinglenoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SinglenoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
