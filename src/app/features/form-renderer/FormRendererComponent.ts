import {
  Component,
  Input,
  OnChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ControlConfig } from '../dynamic-control/control-config';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicControlComponent } from '../dynamic-control/dynamic-control.component';

@Component({
  selector: 'app-form-renderer',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-renderer.component.html',
})
export class FormRendererComponent implements OnChanges {
  @Input() controlConfigs: ControlConfig[];
  @ViewChild('dynamicControl', { read: ViewContainerRef })
  dynamicControl: ViewContainerRef;

  formGroup = new FormGroup({});

  ngOnChanges(changes: SimpleChanges) {
    if (this.controlConfigs.length > 0) {
      this.createComponents();
    }
  }

  private createComponents() {
    if (this.controlConfigs.length > 0) {
      this.controlConfigs.forEach((controlConfig) => {
        const control = this.dynamicControl.createComponent(
          DynamicControlComponent
        );
        control.instance.controlConfig = controlConfig;
        control.instance.formGroup = this.formGroup;
      });
    }
  }
}
