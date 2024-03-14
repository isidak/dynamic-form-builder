import { JsonPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, map, of, take } from 'rxjs';
import { CardComponent } from '../../shared/card/card.component';
import { controlsFeature } from '../../store/controls.state';
import { ComponentType } from '../models/component-type';
import { DynamicComponentConfig } from '../models/dynamic-component-config';

@Component({
  selector: 'app-component-creator',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgFor,
    NgStyle,
    NgClass,
    JsonPipe,
    CardComponent,
  ],
  templateUrl: './component-creator.component.html',
  styleUrl: './component-creator.component.css',
})
export class ComponentCreatorComponent {
  @Input() set selectedComponent(value: DynamicComponentConfig | null | undefined) {
    if (!this.form) return;
    value === null ? (this.isEditMode = false) : (this.isEditMode = true);
    this.patchForm(value!);
  }
  @Output() formValue = new EventEmitter();
  @Output() editCanceled = new EventEmitter();
  @Input() inputTypes: string[] | null = [];
  @Input() componentTypes: ComponentType[] | null = [];

  private store = inject(Store);
  private fb = inject(FormBuilder);

  form: FormGroup;

  isEditMode = false;

  isSubmit = false;
  get type() {
    return this.form.get('type');
  }
  get name() {
    return this.form.get('name');
  }
  get label() {
    return this.form.get('label');
  }
  get placeholder() {
    return this.form.get('placeholder');
  }

  ngOnInit(): void {
    this.form = this.createForm();
  }

  patchForm(control: DynamicComponentConfig | null) {
    control === null ? this.form.reset() : this.form.patchValue(control);
  }

  createForm(): FormGroup<any> {
    return this.fb.group({
      component: [''],
      importedCmp: [''],
      id: [''],
      name: [
        {
          value: '',
          disabled: this.isEditMode,
        },
        [Validators.required, Validators.minLength(3)],
        [this.isValidName()],
      ],
      inputs: this.fb.group({
        controlName: [''],
        required: [false],
        minLength: [0],
        readonly: [false],
        autocomplete: [''],
        type: [''],
        label: ['', [Validators.required, Validators.minLength(3)]],
        placeholder: ['', [Validators.required, Validators.minLength(3)]],
      }),
    });
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
