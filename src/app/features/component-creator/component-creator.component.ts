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
import { Observable, of } from 'rxjs';
import { CardComponent } from '../../shared/card/card.component';
import { ComponentsMap } from '../models/components-map';
import { DynamicComponentConfig } from '../models/dynamic-component-config';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';

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
    CdkDragHandle,
    CdkDrag
  ],
  templateUrl: './component-creator.component.html',
  styleUrl: './component-creator.component.css',
})
export class ComponentCreatorComponent {
  @Input() set selectedComponent(
    value: DynamicComponentConfig | null | undefined
  ) {
    if (!this.form) return;
    value === null ? (this.isEditMode = false) : (this.isEditMode = true);
    this.patchForm(value!);
  }
  @Output() formValue = new EventEmitter();
  @Output() editCanceled = new EventEmitter();
  @Input() inputTypes: string[] | null = [];
  @Input() componentTypes: ComponentsMap[] | null = [];
  @Input() minLength = 3;

  private fb = inject(FormBuilder);

  form: FormGroup;

  isEditMode = false;

  isSubmit = false;
  get type() {
    return this.form.get('inputs')?.get('type');
  }
  get controlName() {
    return this.form.get('inputs')?.get('controlName');
  }
  get label() {
    return this.form.get('inputs')?.get('label');
  }
  get placeholder() {
    return this.form.get('inputs')?.get('placeholder');
  }

  ngOnInit(): void {
    this.form = this.createForm();
  }

  patchForm(control: DynamicComponentConfig | null) {
    control === null ? this.form.reset() : this.form.patchValue(control);
  }

  createForm(): FormGroup<any> {
    return this.fb.group({
      id: [''],
      name: [''],
      inputs: this.fb.group({
        controlName: [
          {
            value: '',
            disabled: this.isEditMode,
          },
          [Validators.required, Validators.minLength(this.minLength)],
          // [this.isValidName()],
        ],
        required: [false],
        minLength: [0],
        readonly: [false],
        autocomplete: [''],
        type: [''],
        label: [
          '',
          [Validators.required, Validators.minLength(this.minLength)],
        ],
        placeholder: ['', [Validators.minLength(this.minLength)]],
      }),
    });
  }

  handleSubmit() {
    if (this.form.valid) {
      this.formValue.emit({
        form: { ...this.form.value },
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
