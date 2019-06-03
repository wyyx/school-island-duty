import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckPasswordPage } from './check-password.page';

describe('CheckPasswordPage', () => {
  let component: CheckPasswordPage;
  let fixture: ComponentFixture<CheckPasswordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckPasswordPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
