import {
  AsyncPipe,
  JsonPipe,
  NgComponentOutlet,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  AfterViewInit,
  Component,
  ComponentRef,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import {
  BehaviorSubject,
  Observable,
  Subject,
  filter,
  map,
  of,
  scan,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { CardComponent } from '../../shared/card/card.component';
import { FormRendererComponent } from '../form-renderer/form-renderer.component';
import {
  ComponentTypeNames,
  IComponentType,
  IDynamicComponentConfig,
} from '../models/dynamic-component-config';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormRendererComponent,
    CardComponent,
    NgComponentOutlet,
    NgFor,
    JsonPipe,
    AsyncPipe,
    NgIf,
  ],
  templateUrl: './editor.component.html',
})
export class EditorComponent implements AfterViewInit {
  @Input() componentTypes$: Observable<IComponentType[]>;
  @Input() inputTypes: string[] | null = [];
  @Input() componentType$: Observable<IComponentType[]>;

  @Output() formValue = new EventEmitter();
  @Output() editCanceled = new EventEmitter();

  @ViewChild('placeholder', { read: ViewContainerRef })
  placeholder: ViewContainerRef;
  @ViewChildren(NgComponentOutlet) components: QueryList<ComponentRef<any>>;

  form = new FormGroup({});
  private destroyRef = inject(DestroyRef);
  // private controlContainer = inject(FormGroupDirective).form as FormGroup;
  displayComponent$ = new BehaviorSubject<IDynamicComponentConfig[]>([]);
  nextStepComponent$ = new Subject<IDynamicComponentConfig>();
  formArray: any = [];
  createdComponentIds: any[] = [];
  numberOfCreatedComponents = 0;
  addedComponents$ = new BehaviorSubject<ComponentRef<any>[]>([]);
  private _currentStepComponentRefs = new BehaviorSubject<any[]>([]);
  currentStepComponentRefs$ = this._currentStepComponentRefs
    .asObservable()
    .pipe(
      scan((acc, curr) => {
        return [...acc, curr];
      })
    );
  currentStep$ = new BehaviorSubject<number>(1);
  stepComponentMap$ = new BehaviorSubject<any[]>([]);
  displayedComponentsArray: any[] = [];

  isEditMode = false;

  isSubmit = false;
  // get type() {
  //   return this.form.get('type');
  // }
  // get name() {
  //   return this.form.get('name');
  // }
  // get label() {
  //   return this.form.get('label');
  // }
  // get placeholder() {
  //   return this.form.get('placeholder');
  // }

  ngOnInit(): void {

    this.componentType$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((types) => types !== undefined),
        filter((types) => types.length > 0),
        map((types) =>
          types?.find((type) => type['name'] === ComponentTypeNames.Select)
        ),
        tap((type) => this.createCmp(type))
      )
      .subscribe();

    this.addedComponents$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((components) => components.length > 0),
        map(
          (components: any[]) => components[components.length - 1]._componentRef
        ),
        withLatestFrom(this.currentStep$),
        tap(([component, step]) =>
          this._currentStepComponentRefs.next([{ component, step }])
        ),
        switchMap(([component, step]) => {
          const formControl = this.form.get(
            component.instance.controlName.toString()
          );

          if (formControl) {
            return formControl.valueChanges;
          } else {
            return of(component);
          }
        }),
        tap((componentType) => {
          this.nextStepComponent$.next(componentType);
        })
      )
      .subscribe((components) => {
        console.log('components', components);
      });

    this.nextStepComponent$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        withLatestFrom(this.componentTypes$),
        map(([name, componentTypes]) => {
          const componentType = componentTypes.find(
            (type) => type.name === name.toString()
          );
          console.log('componentTypes', componentType);
          return componentType;
        }),
        tap((cmp) => this.createCmp(cmp))
      )
      .subscribe();

    this.currentStepComponentRefs$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((step) => {
        console.log('step', step);
      });
  }

  ngAfterViewInit(): void {
    this.components.changes
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((components) => this.addedComponents$.next(components.toArray()))
      )
      .subscribe();
  }

  async createCmp(component?: IComponentType) {
    if (component === undefined) return;
    const newCmp = {
      ...component,
      importedCmp: await component.component(),
    };
    // this.addComponent(newCmp);
    this.numberOfCreatedComponents++;
    this.createdComponentIds.push({
      step: this.numberOfCreatedComponents,
      id: newCmp.id,
    });
    const currentCmps = this.displayComponent$.getValue();
    this.displayComponent$.next([...currentCmps, newCmp]);
  }

  // addComponent(cmp: IDynamicComponentConfig) {
  //   console.log('cmp', cmp);
  //   const addedComponent = this.placeholder.createComponent(cmp.importedCmp);
  //   addedComponent.setInput('inputs', cmp.inputs);
  //   addedComponent.setInput('options', cmp.inputs.options);
  //   this.addedComponents.push(addedComponent);

  //   addedComponent.onDestroy(() => {
  //     const cmpIndex = this.addedComponents.findIndex(
  //       (cmp) => cmp === addedComponent
  //     );
  //     this.addedComponents = [
  //       ...this.addedComponents.slice(0, cmpIndex),
  //       ...this.addedComponents.slice(
  //         cmpIndex + 1,
  //         this.addedComponents.length
  //       ),
  //     ];
  //   });
  // }

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
      importedCmp: await configs['component'](),
    };

    return newCmp;
  }

  patchForm(control: IDynamicComponentConfig | null) {
    control === null ? this.form.reset() : this.form.patchValue(control);
  }

  handleSubmit() {
    if (this.form.valid) {
      this.formValue.emit({
        form: this.form.value,
        isEdit: this.isEditMode,
      });
      this.form.reset();
      this.isEditMode = false;
    }
  }

  cancelEdit() {
    this.form.reset();
    this.isEditMode = false;
    this.editCanceled.emit();
  }

  private isValidName(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return of(null);
      //   const value = control.value;
      //   if (this.isEditMode) return of(null);

      //   return this.store.select(controlsFeature.selectControls).pipe(
      //     take(1),
      //     map((configs) => {
      //       const isNameExists = configs.some((config) => config.name === value);
      //       return isNameExists ? { nameExists: true } : null;
      //     })
      //   );
      // };
    };
  }
}
