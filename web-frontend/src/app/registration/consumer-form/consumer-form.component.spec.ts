import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerFormComponent } from './consumer-form.component';

describe('ConsumerFormComponent', () => {
  let component: ConsumerFormComponent;
  let fixture: ComponentFixture<ConsumerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumerFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
