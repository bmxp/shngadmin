import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionConfigurationComponent } from './function-configuration.component';

describe('SceneConfigurationComponent', () => {
  let component: FunctionConfigurationComponent;
  let fixture: ComponentFixture<FunctionConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunctionConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
