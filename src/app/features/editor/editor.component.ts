import { JsonPipe, NgClass, NgIf } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Observable, map, take } from 'rxjs';
import { FormConfigsService } from '../../services/form-configs.service';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass, JsonPipe],
  templateUrl: './editor.component.html',
})
export class EditorComponent implements OnInit {
  @Output() formValue = new EventEmitter();
  editorForm: FormGroup;
  fb = inject(FormBuilder);
  formConfigService = inject(FormConfigsService);
  isSubmit = false;
  get type() {
    return this.editorForm.get('type');
  }
  get name() {
    return this.editorForm.get('name');
  }
  get label() {
    return this.editorForm.get('label');
  }
  get placeholder() {
    return this.editorForm.get('placeholder');
  }

  private destroyRef = inject(DestroyRef);

  constructor() {
    this.editorForm = this.createForm();
  }

  ngOnInit(): void {
    this.formTypeChangeSub();
  }

  formTypeChangeSub() {
    this.editorForm
      .get('type')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (value === 'submit') {
          this.isSubmit = true;
          for (const key in this.editorForm.controls) {
            if (key !== 'type') {
              this.editorForm.get(key)?.disable();
            }
          }
        } else {
          this.isSubmit = false;
          for (const key in this.editorForm.controls) {
            if (key !== 'type') {
              this.editorForm.get(key)?.enable();
            }
          }
        }
      });
  }

  createForm(): FormGroup<any> {
    return this.fb.group({
      name: [
        '',
        [Validators.required, Validators.minLength(3)],
        [this.isValidName()],
      ],
      label: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', Validators.required],
      placeholder: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  handleSubmit() {
    if (this.editorForm.valid) {
      this.formValue.emit(this.editorForm.value);
      this.editorForm.reset();
    }
  }

  private isValidName(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const value = control.value;

      return this.formConfigService.formConfigs$.pipe(
        take(1),
        map((configs) => {
          const isNameExists = configs.some((config) => config.name === value);
          return isNameExists ? { nameExists: true } : null;
        }));
     
    };
  }
}
