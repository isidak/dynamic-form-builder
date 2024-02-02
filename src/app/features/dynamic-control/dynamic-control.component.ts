import { NgIf, TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ControlConfig } from './control-config';

@Component({
  selector: 'app-dynamic-control',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, TitleCasePipe],
  templateUrl: './dynamic-control.component.html',
})
export class DynamicControlComponent {
  @Output() formSubmit = new EventEmitter();
 controlConfig: ControlConfig;
 formGroup: FormGroup;

}
