import {
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
import { DynamicControlComponent } from '../dynamic-control/dynamic-control.component';

@Component({
  selector: 'app-form-renderer',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-renderer.component.html',
})
export class FormRendererComponent implements OnChanges {
  form = new FormGroup({});

  @Input() controlConfigs: ControlConfig[];
  @Output() formSubmit = new EventEmitter();
  @ViewChild('dynamicControl', { read: ViewContainerRef })
  dynamicControl: ViewContainerRef;

  ngOnChanges(changes: SimpleChanges) {
    if(changes['controlConfigs'].isFirstChange()){
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
  }
}
