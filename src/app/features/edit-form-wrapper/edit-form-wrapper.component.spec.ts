import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFormWrapperComponent } from './edit-form-wrapper.component';

describe('EditFormWrapperComponent', () => {
  let component: EditFormWrapperComponent;
  let fixture: ComponentFixture<EditFormWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFormWrapperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditFormWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
