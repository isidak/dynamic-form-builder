import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import {
  AsyncPipe,
  JsonPipe,
  NgComponentOutlet,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  Observable,
  combineLatest,
  distinctUntilChanged,
  map,
  mergeMap,
  of,
  tap,
} from 'rxjs';
import { InputComponent } from '../components/input/input.component';
import { DynamicComponentRenderedComponent } from '../dynamic-component-rendered/dynamic-component-rendered.component';
import { EditWrapperComponent } from '../edit-wrapper/edit-wrapper.component';
import { ComponentImporterService } from './../../services/component-importer.service';
import { DynamicComponentConfig } from './../models/dynamic-component-config';

@Component({
  selector: 'app-form-renderer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DragDropModule,
    InputComponent,
    EditWrapperComponent,
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
  componentsCopy: any[];

  @Output() submittedForm = new EventEmitter();
  @Output() selected = new EventEmitter();
  @Output() remove = new EventEmitter();
  @Output() itemsDragged = new EventEmitter();

  importedComponents$: Observable<DynamicComponentConfig[]>;

  destroyRef = inject(DestroyRef);

  form = new FormGroup({});

  private componentImporterService = inject(ComponentImporterService);

  ngOnInit(): void {
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

  removeComponent(id: string) {
    this.remove.emit(id);
  }

  selectComponent(id: string) {
    this.selected.emit(id);
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

  drop(event: CdkDragDrop<string[]>) {
    // this.itemsDragged.emit({
    //   prevIndex: event.previousIndex,
    //   currIndex: event.currentIndex,
    // });
    moveItemInArray(
      this.componentsCopy,
      event.previousIndex,
      event.currentIndex
    );
  }
}
