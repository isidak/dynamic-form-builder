import { DragDropModule, } from '@angular/cdk/drag-drop';
import { AsyncPipe, JsonPipe, NgComponentOutlet, NgFor, NgIf, } from '@angular/common';
import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, distinctUntilChanged, map, mergeMap, Observable, of, tap, } from 'rxjs';
import { InputComponent } from '../components/input/input.component';
import { DynamicComponentRenderedComponent } from '../dynamic-component-rendered/dynamic-component-rendered.component';
import { EditComponentWrapperComponent } from '../edit-component-wrapper/edit-component-wrapper.component';
import { ComponentImporterService } from '../../services/component-importer.service';
import { DynamicComponentConfig } from '../models/dynamic-component-config';

@Component({
  selector: 'app-form-renderer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DragDropModule,
    InputComponent,
    EditComponentWrapperComponent,
    DynamicComponentRenderedComponent,
    NgComponentOutlet,
    NgFor,
    JsonPipe,
    AsyncPipe,
    NgIf,
  ],
  templateUrl: './form-renderer.component.html',
})
export class FormRendererComponent implements OnInit {
  @Input() components$: Observable<any[]>;
  @Output() submittedForm = new EventEmitter();
  componentsCopy: any[];
  importedComponents$: Observable<DynamicComponentConfig[]>;
  form = new FormGroup({});

  protected destroyRef = inject(DestroyRef);

  protected componentImporterService = inject(ComponentImporterService);

  ngOnInit(): void {
    this.importComponents();
  }


  submitForm() {
    if (this.form.valid) this.submittedForm.emit(this.form.value);
    (Object.values(this.form.controls) as FormControl[]).forEach((control) => control.markAsTouched());
  }

  importComponent(configs: any) {
    return this.componentImporterService
      .getImportedComponent(configs.name)
      .pipe(
        map((component) => {
          return {
            ...configs,
            component,
          };
        })
      );
  }

  trackById(index: number, item: any) {
    return item.id;
  }

  protected importComponents() {
    this.importedComponents$ = this.components$.pipe(
      takeUntilDestroyed(this.destroyRef),
      distinctUntilChanged(
        (prev, curr) => prev.length === 0 && curr.length === 0
      ),
      mergeMap((components) => {
        if (components.length === 0) {
          return of([]);
        } else {
          return combineLatest(
            components.map((component) => this.importComponent(component))
          );
        }
      }),
      tap((components) => (this.componentsCopy = [...components]))
    );
  }
}
