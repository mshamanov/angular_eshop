import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginstatusComponent } from './loginstatus.component';

describe('LoginstatusComponent', () => {
  let component: LoginstatusComponent;
  let fixture: ComponentFixture<LoginstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginstatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
