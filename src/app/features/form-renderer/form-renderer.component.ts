import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ControlConfig } from '../dynamic-control/control-config';
import { DynamicControlComponent } from '../dynamic-control/dynamic-control.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-form-renderer',
  standalone: true,
  imports: [ReactiveFormsModule, DragDropModule],
  templateUrl: './form-renderer.component.html',
})
export class FormRendererComponent implements OnChanges {
  form = new FormGroup({});

  @Input() controlConfigs: ControlConfig[];
  @Output() formSubmit = new EventEmitter();
  @Output() editControl = new EventEmitter();
  @ViewChild('dynamicControl', { read: ViewContainerRef })
  dynamicControl: ViewContainerRef;
  private destroyRef = inject(DestroyRef);

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
    if (this.controlConfigs.length > 0) {
      this.controlConfigs.forEach((controlConfig) => {
        if (controlConfig.type !== 'submit') {
          this.form.addControl(controlConfig.name, new FormControl());
        }

        this.createComponent(controlConfig);
      });
    }
  }

  private createComponent(controlConfig: ControlConfig) {
    const control = this.dynamicControl.createComponent(
      DynamicControlComponent
    );
    control.instance.controlConfig = controlConfig;
    control.instance.formGroup = this.form;
    control.instance.editControl
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((controlConfig: ControlConfig) => {
        this.editControl.emit(controlConfig);
      });
  }
}
