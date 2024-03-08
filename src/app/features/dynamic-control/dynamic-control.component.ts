import { CdkDrag } from '@angular/cdk/drag-drop';
import { NgIf, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ControlConfig } from './control-config';

@Component({
  selector: 'app-dynamic-control',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, TitleCasePipe, CdkDrag],
  templateUrl: './dynamic-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicControlComponent {
  @Output() formSubmit = new EventEmitter();
  @Output() editControlEvent = new EventEmitter();
  @Output() removeControlEvent = new EventEmitter();
  @Input() controlConfig: ControlConfig;
  @Input() formGroup: FormGroup;

  selectControl(event: Event) {
    event.stopPropagation();
    this.editControlEvent.emit(this.controlConfig);
  }
  removeControl(event: Event) {
    event.stopPropagation();
    this.removeControlEvent.emit(this.controlConfig);
  }
}
