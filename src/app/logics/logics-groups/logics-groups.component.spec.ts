import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogicsGroupsComponent } from './logics-groups.component';

describe('LogicsGroupsComponent', () => {
  let component: LogicsGroupsComponent;
  let fixture: ComponentFixture<LogicsGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogicsGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogicsGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
