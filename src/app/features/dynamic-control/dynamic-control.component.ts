import { NgIf, TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ControlConfig } from './control-config';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dynamic-control',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, TitleCasePipe, CdkDrag],
  templateUrl: './dynamic-control.component.html',
})
export class DynamicControlComponent {
  @Output() formSubmit = new EventEmitter();
  @Output() editControl = new EventEmitter();
  controlConfig: ControlConfig;
  formGroup: FormGroup;

  selectControl() {
    console.log(this.controlConfig);
    this.editControl.emit(this.controlConfig);
  }
}
