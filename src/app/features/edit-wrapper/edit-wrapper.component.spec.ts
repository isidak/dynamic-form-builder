import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWrapperComponent } from './edit-wrapper.component';

describe('EditWrapperComponent', () => {
  let component: EditWrapperComponent;
  let fixture: ComponentFixture<EditWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditWrapperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
