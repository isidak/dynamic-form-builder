import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditComponentWrapperComponent } from './edit-component-wrapper.component';

describe('EditWrapperComponent', () => {
  let component: EditComponentWrapperComponent;
  let fixture: ComponentFixture<EditComponentWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditComponentWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditComponentWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
