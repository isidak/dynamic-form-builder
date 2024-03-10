import { ChangeDetectorRef, Directive, Input, inject } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Directive({
  standalone: true,
})
export abstract class BaseInput {
  @Input({ required: true }) controlName: string | number;
  @Input() type = 'text';
  @Input() label: string;
  @Input() placeholder: string;
  @Input() readonly = false;
  @Input() autocomplete = 'off';
  @Input() set required(value: true | false) {
    value
      ? this.validators.push(Validators.required)
      : this.validators.filter(
          (validator) => validator !== Validators.required
        );
  }
  @Input() set minLength(value: number) {
    value > 0 ? this.validators.push(Validators.minLength(value)) : null;
  }

  protected validators: ValidatorFn[] = [];
  protected _controlContainer = inject(ControlContainer);
  protected _parentFormGroup = inject(FormGroupDirective);
  protected changeDetectorRef = inject(ChangeDetectorRef);

  get controlContainer() {
    return this._controlContainer as FormGroupDirective;
  }

  get topLevelFormGroup() {
    return this.controlContainer.form as FormGroup;
  }

  get parentFormGroup() {
    return this._parentFormGroup?.form as FormGroup;
  }

  get control() {
    return this.parentFormGroup.controls[
      this.controlName.toString()
    ] as FormControl;
  }
}
