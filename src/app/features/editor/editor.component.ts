import {
  AsyncPipe,
  JsonPipe,
  NgClass,
  NgComponentOutlet,
  NgFor,
  NgIf,
  NgStyle,
} from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject, filter, map, of, tap } from 'rxjs';
import { CardComponent } from '../../shared/card/card.component';
import { FormRendererComponent } from '../form-renderer/form-renderer.component';
import {
  ComponentTypeNames,
  IComponentType,
  IDynamicComponentConfig,
} from '../models/dynamic-component-config';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
export class EditorComponent {
  @Input() componentTypes: IComponentType[] | null = [];
  @Input() inputTypes: string[] | null = [];
  @Input() componentType$: Observable<IComponentType[]>;

  @Output() formValue = new EventEmitter();
  @Output() editCanceled = new EventEmitter();

  @ViewChild('placeholder', { read: ViewContainerRef }) placeholder: ViewContainerRef;

  @ViewChildren(TemplateRef) templates: QueryList<TemplateRef<any>>;

  private store = inject(Store);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  firstStepComponent$ = new Subject<IDynamicComponentConfig>();
  nextStepComponent$ = new Subject<IDynamicComponentConfig>();
  formArray: any = [];
  createdComponentIds: any[] = [];
  numberOfCreatedComponents = 0;

  form = new FormGroup({});

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

      

    this.nextStepComponent$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((component) => {
          this.formArray.push(component);
          console.log(component.id, this.formArray);
        })
      )
      .subscribe();
  }

  async createCmp(component?: IComponentType) {
    if (component === undefined) return;
    const newCmp = {
      ...component,
      importedCmp: await component.component(),
    };
    this.addComponent(newCmp);
    this.numberOfCreatedComponents++;
    this.createdComponentIds.push({step: this.numberOfCreatedComponents, id: newCmp.id});
    this.firstStepComponent$.next(newCmp);
  }

  addComponent(cmp: IDynamicComponentConfig) {
    const addedComponent = this.placeholder.createComponent(cmp.importedCmp);
    // addedComponent.setInput(cmp.inputs);
    
  }

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
