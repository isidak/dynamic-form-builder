import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  AsyncPipe,
  JsonPipe,
  NgComponentOutlet,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  Component,
  ComponentRef,
  DestroyRef,
  EnvironmentInjector,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  Observable,
  distinctUntilChanged,
  filter,
  map
} from 'rxjs';
import { InputComponent } from '../components/input/input.component';
import { ControlConfig } from '../dynamic-control/control-config';

@Component({
  selector: 'app-form-renderer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DragDropModule,
    NgFor,
    NgComponentOutlet,
    InputComponent,
    JsonPipe,
    AsyncPipe,
    NgIf,
  ],
  templateUrl: './form-renderer.component.html',
})
export class FormRendererComponent implements OnInit {
  @Input() controlConfigs: ControlConfig[];
  @Input() components$: Observable<any[]>;

  @Output() formSubmit = new EventEmitter();
  @Output() editControl = new EventEmitter();
  @Output() removeControl = new EventEmitter();
  
  importedComponents$: Observable<any[]>;

  // @ViewChildren('dynamicControl', { read: ViewContainerRef })
  // dynamicControls: QueryList<ViewContainerRef>;

  selectedComponent: ComponentRef<any>;
  // componentsArray: any[] = [];
  destroyRef = inject(DestroyRef);

  form = new FormGroup({});

  private injector = inject(EnvironmentInjector);

  ngOnInit(): void {
    this.importedComponents$ = this.components$.pipe(
      takeUntilDestroyed(this.destroyRef),
      distinctUntilChanged(
        (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
      ),
      filter((components) => components.length > 0),
      map((components) => this.createComps(components))
    );
  }


  // private createControls() {
  //   if (this.controlConfigs?.length > 0) {
  //     this.controlConfigs.forEach((controlConfig) => {
  //       for (const key in Object.entries(this.form.controls)) {
  //         if (key === controlConfig.name) {
  //           return;
  //         }
  //       }
  //       if (controlConfig.type !== 'submit') {
  //         this.form.addControl(controlConfig.name, new FormControl());
  //       }

  //       // this.createCmp(controlConfig);
  //     });
  //   }
  // }

  // private async createCmp(controlConfig: ControlConfig) {
  //   // const cmt = (
  //   //   await import('../dynamic-control/dynamic-control.component')
  //   // ).DynamicControlComponent;
  //   const cmt = DynamicControlComponent;
  //   let component: Record<string, unknown> = {};
  //   component['cmt'] = cmt;
  //   component['inputs'] = {'controlConfig': controlConfig, 'formGroup': this.form};
  //   component['outputs'] = {
  //     'formSubmit': this.formSubmit,
  //     'editControlEvent': this.editControl,
  //     'removeControlEvent': this.removeControl,
  //   };
  //   component['id'] = controlConfig.id;
  //   const control = createComponent(cmt, {environmentInjector: this.injector});
  //   this.componentsArray.push(component);

  //   control.setInput('controlConfig', controlConfig);
  //   control.setInput('formGroup', this.form);
  //   const editSub = control.instance.editControlEvent.subscribe(
  //     (controlConfig: ControlConfig) => {
  //       this.editControl.emit(controlConfig);
  //     }
  //   );
  //   const removeSub = control.instance.removeControlEvent.subscribe(
  //     (controlConfig: ControlConfig) => {
  //       this.removeControl.emit(controlConfig);
  //       this.form.removeControl(controlConfig.name);
  //     }
  //   );
  //   control.onDestroy(() => {
  //     editSub.unsubscribe();
  //     removeSub.unsubscribe();
  //   });

  //   this.dynamicControls.forEach((container) => {
  //     console.log(container);
  // })

  //   console.log(this.componentsArray);
  // }

  //new implementation

  createComps(components: any[]) {
    let newComponents: any[] = [];
    components.forEach(async (component) => {
      newComponents.push(await this.importComponent(component));
    });

    return newComponents;
  }

  async importComponent(configs: any) {
    const newCmp = {
      ...configs,
      component: await configs['component'](),
    };
    // this.componentsArray.push(newCmp);

    return newCmp;
  }

  trackById(index: number, item: any) {
    return item.id;
  }

}
