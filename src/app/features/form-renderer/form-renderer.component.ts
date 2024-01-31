import {
  Component,
  ComponentFactoryResolver,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { ControlConfig } from '../dynamic-control/control-config';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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

  form = new FormGroup({});

  ngOnChanges(changes: SimpleChanges) {
    if(changes['controlConfigs'].currentValue !== changes['controlConfigs'].previousValue || changes['controlConfigs'].isFirstChange()) {
      this.form = new FormGroup({});
      this.createComponents();
    }
   
  }

  private createComponents() {
    if(this.controlConfigs.length > 0) {

      this.controlConfigs.forEach( controlConfig => {

        this.form.addControl(controlConfig.name, new FormControl());
        
       const control = this.dynamicControl.createComponent(DynamicControlComponent);
        control.instance.controlConfig = controlConfig;
        control.instance.formGroup = this.form;
      })
    }
}
}