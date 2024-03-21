import { JsonPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { map, Observable, of, take, withLatestFrom } from 'rxjs';
import { CardComponent } from '../../shared/card/card.component';
import { ComponentsMap } from '../models/components-map';
import { DynamicComponentConfig } from '../models/dynamic-component-config';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { Store } from "@ngrx/store";
import { componentsFeature } from "../../store/app.state";

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
export class ComponentCreatorComponent implements OnInit {
  @Input() set selectedComponent(
    value: DynamicComponentConfig | null | undefined
  ) {
    if (!this.form) return;
    value === null ? (this.isEditMode = false) : (this.isEditMode = true);
    this.patchForm(value!);
  }

  @Input() inputTypes: string[] | null = [];
  @Input() componentTypes: ComponentsMap[] | null = [];
  @Input() minLength = 3;
  @Output() formValue = new EventEmitter();
  @Output() editCanceled = new EventEmitter();

  form: FormGroup;
  isEditMode = false;
  private fb = inject(FormBuilder);
  private store = inject(Store);

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

  handleSubmit() {
    if (this.form.valid) {
      this.formValue.emit({
        form: {...this.form.value},
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

  private patchForm(control: DynamicComponentConfig | null) {
    control === null ? this.form.reset() : this.form.patchValue(control);
  }

  private createForm(): FormGroup<any> {
    return this.fb.group({
      id: [''],
      name: [''],
      inputs: this.fb.group({
        controlName: [
          '',
          [Validators.required, Validators.minLength(this.minLength)],
          [this.isValidName()],
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

  private isValidName(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const value = control.value;

      if (this.isEditMode) return of(null);
      return this.store.select(componentsFeature.selectAll).pipe(
        take(1),
        withLatestFrom(this.store.select(componentsFeature.selectSelectedComponentId)),
        map(([configs, selected]) => {
          if (selected !== null) {
            const selectedName = configs.find((config) => config.id === selected)?.inputs.controlName;
            if (selectedName === value) return null;
          }
          const isNameExists = configs.some((config) => config.inputs.controlName === value);
          return isNameExists ? {nameExists: true} : null;
        })
      );
    };
  };
}
