import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontControllerComponent } from './front-controller.component';

describe('FrontControllerComponent', () => {
  let component: FrontControllerComponent;
  let fixture: ComponentFixture<FrontControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
