// import { JsonPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
// import {
//   ChangeDetectionStrategy,
//   Component,
//   DestroyRef,
//   EventEmitter,
//   Input,
//   OnInit,
//   Output,
//   inject,
// } from '@angular/core';
// import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// import {
//   AbstractControl,
//   AsyncValidatorFn,
//   FormBuilder,
//   FormGroup,
//   ReactiveFormsModule,
//   ValidationErrors,
//   Validators,
// } from '@angular/forms';
// import { Store } from '@ngrx/store';
// import { Observable, map, of, take } from 'rxjs';
// import { CardComponent } from '../../shared/card/card.component';
// import { controlsFeature } from '../../store/controls.state';
// import { ControlConfig } from '../dynamic-control/control-config';

// @Component({
//   selector: 'app-editor',
//   standalone: true,
//   templateUrl: './editor.component.html',
//   imports: [
//     ReactiveFormsModule,
//     NgIf,
//     NgFor,
//     NgStyle,
//     NgClass,
//     JsonPipe,
//     CardComponent,
//   ],
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class EditorComponent implements OnInit {
//   @Input() set selectedControl(value: ControlConfig | null) {
//     if (!this.editorForm) return;
//     value === null ? (this.isEditMode = false) : (this.isEditMode = true);
//     this.patchForm(value!);
//   }
//   @Output() formValue = new EventEmitter();
//   @Input() inputTypes: string[] | null = [];

//   private store = inject(Store);
//   private fb = inject(FormBuilder);
//   private destroyRef = inject(DestroyRef);

//   editorForm: FormGroup;

//   isEditMode = false;

//   isSubmit = false;
//   get type() {
//     return this.editorForm.get('type');
//   }
//   get name() {
//     return this.editorForm.get('name');
//   }
//   get label() {
//     return this.editorForm.get('label');
//   }
//   get placeholder() {
//     return this.editorForm.get('placeholder');
//   }

//   ngOnInit(): void {
//     this.editorForm = this.createForm();
//     this.formTypeChangeSub();
//   }

//   patchForm(control: ControlConfig | null) {
//     control === null
//       ? this.editorForm.reset()
//       : this.editorForm.patchValue(control);
//   }

//   formTypeChangeSub() {
//     this.editorForm
//       .get('type')
//       ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
//       .subscribe((value) => {
//         if (value === 'submit') {
//           this.isSubmit = true;
//           for (const key in this.editorForm.controls) {
//             if (key !== 'type') {
//               this.editorForm.get(key)?.disable();
//             }
//           }
//         } else {
//           this.isSubmit = false;
//           for (const key in this.editorForm.controls) {
//             if (key !== 'type') {
//               this.editorForm.get(key)?.enable();
//             }
//           }
//         }
//       });
//   }

//   createForm(): FormGroup<any> {
//     return this.fb.group({
//       id: [''],
//       name: [
//         '',
//         [Validators.required, Validators.minLength(3)],
//         [this.isValidName()],
//       ],
//       label: ['', [Validators.required, Validators.minLength(3)]],
//       type: ['', Validators.required],
//       placeholder: ['', [Validators.required, Validators.minLength(3)]],
//     });
//   }

//   handleSubmit() {
//     if (this.editorForm.valid) {
//       this.formValue.emit({
//         formValue: this.editorForm.value,
//         isEdit: this.isEditMode,
//       });
//       this.editorForm.reset();
//       this.isEditMode = false;
//     }
//   }

//   cancelEdit() {
//     this.editorForm.reset();
//     this.isEditMode = false;
//   }

//   private isValidName(): AsyncValidatorFn {
//     return (control: AbstractControl): Observable<ValidationErrors | null> => {
//       const value = control.value;
//       if (this.isEditMode) return of(null);

//       return this.store.select(controlsFeature.selectControls).pipe(
//         take(1),
//         map((configs) => {
//           const isNameExists = configs.some((config) => config.name === value);
//           return isNameExists ? { nameExists: true } : null;
//         })
//       );
//     };
//   }
// }
