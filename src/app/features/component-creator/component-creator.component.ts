import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AsyncValidatorFn,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, of, take, map } from 'rxjs';
import { controlsFeature } from '../../store/controls.state';
import { DynamicComponentConfig } from '../models/dynamic-component-config';
import { NgIf, NgFor, NgStyle, NgClass, JsonPipe } from '@angular/common';
import { CardComponent } from '../../shared/card/card.component';
import { EditorComponent } from '../editor/editor.component';
import { ComponentType } from '../models/component-type';

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
    EditorComponent
  ],
  templateUrl: './component-creator.component.html',
  styleUrl: './component-creator.component.css',
})
export class ComponentCreatorComponent {
  @Input() set selectedComponent(value: DynamicComponentConfig | null) {
    if (!this.form) return;
    value === null ? (this.isEditMode = false) : (this.isEditMode = true);
    this.patchForm(value!);
  }
  @Output() formValue = new EventEmitter();
  @Input() inputTypes: string[] | null = [];
  @Input() componentTypes: ComponentType[] | null = [];

  private store = inject(Store);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

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
    this.formTypeChangeSub();
  }

  patchForm(control: DynamicComponentConfig | null) {
    control === null
      ? this.form.reset()
      : this.form.patchValue(control);
  }

  formTypeChangeSub() {
    this.form
      .get('type')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (value === 'submit') {
          this.isSubmit = true;
          for (const key in this.form.controls) {
            if (key !== 'type') {
              this.form.get(key)?.disable();
            }
          }
        } else {
          this.isSubmit = false;
          for (const key in this.form.controls) {
            if (key !== 'type') {
              this.form.get(key)?.enable();
            }
          }
        }
      });
  }

  createForm(): FormGroup<any> {
    return this.fb.group({
      component: [''],
      importedCmp: [''],
      id: [''],
      name: [
        '',
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
      console.log(this.form.value);
      this.formValue.emit(
      this.form.value
        // isEdit: this.isEditMode,
      );
      this.form.reset();
      this.isEditMode = false;
    }
  }

  cancelEdit() {
    this.form.reset();
    this.isEditMode = false;
  }

  private isValidName(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const value = control.value;
      if (this.isEditMode) return of(null);

      return this.store.select(controlsFeature.selectControls).pipe(
        take(1),
        map((configs) => {
          const isNameExists = configs.some((config) => config.name === value);
          return isNameExists ? { nameExists: true } : null;
        })
      );
    };
  }
}
