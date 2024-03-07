import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ControlConfig } from '../dynamic-control/control-config';

@Component({
  selector: 'app-form-renderer',
  standalone: true,
  imports: [ReactiveFormsModule, DragDropModule],
  templateUrl: './form-renderer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormRendererComponent implements OnChanges {
  @Input() controlConfigs: ControlConfig[];
  @Output() formSubmit = new EventEmitter();
  @Output() editControl = new EventEmitter();
  @Output() removeControl = new EventEmitter();

  @ViewChild('dynamicControl', { read: ViewContainerRef })
  dynamicControl: ViewContainerRef;

  form = new FormGroup({});

  ngOnChanges(changes: SimpleChanges) {
    if (changes['controlConfigs'].isFirstChange()) {
      this.createControls();
    } else if (
      changes['controlConfigs'].currentValue !==
      changes['controlConfigs'].previousValue
    ) {
      this.dynamicControl.clear();
      this.createControls();
    }
  }

  private createControls() {
    if (this.controlConfigs?.length > 0) {
      this.controlConfigs.forEach((controlConfig) => {
        for (const key in Object.entries(this.form.controls)) {
          if (key === controlConfig.name) {
            return;
          }
        }
        if (controlConfig.type !== 'submit') {
          this.form.addControl(controlConfig.name, new FormControl());
        }

        this.createComponent(controlConfig);
      });
    }
  }

  private async createComponent(controlConfig: ControlConfig) {
    const component = (
      await import('../dynamic-control/dynamic-control.component')
    ).DynamicControlComponent;
    const control = this.dynamicControl.createComponent(component);
    control.setInput('controlConfig', controlConfig);
    control.setInput('formGroup', this.form);
    const editSub = control.instance.editControlEvent.subscribe(
      (controlConfig: ControlConfig) => {
        this.editControl.emit(controlConfig);
      }
    );
    const removeSub = control.instance.removeControlEvent.subscribe(
      (controlConfig: ControlConfig) => {
        this.removeControl.emit(controlConfig);
        this.form.removeControl(controlConfig.name);
        console.log(this.form);
      }
    );
    control.onDestroy(() => {
      editSub.unsubscribe();
      removeSub.unsubscribe();
    });
  }
}
