import { NgIf, TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewContainerRef, inject } from '@angular/core';
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
  @Output() editControlEvent = new EventEmitter();
  @Output() removeControlEvent = new EventEmitter();
  @Input() controlConfig: ControlConfig;
  @Input() formGroup: FormGroup;

  selectControl() {
    this.editControlEvent.emit(this.controlConfig);
  }
  removeControl() {
    this.removeControlEvent.emit(this.controlConfig);
  }
}
