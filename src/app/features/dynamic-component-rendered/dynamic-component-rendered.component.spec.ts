import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicComponentRenderedComponent } from './dynamic-component-rendered.component';

describe('DynamicComponentRenderedComponent', () => {
  let component: DynamicComponentRenderedComponent;
  let fixture: ComponentFixture<DynamicComponentRenderedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicComponentRenderedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DynamicComponentRenderedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
