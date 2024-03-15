import { ComponentImporterService } from './../../services/component-importer.service';
import { DynamicComponentConfig } from './../models/dynamic-component-config';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  AsyncPipe,
  JsonPipe,
  NgComponentOutlet,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import memo from 'memo-decorator';
import { Observable, combineLatest, distinctUntilChanged, from, map, mergeMap, tap } from 'rxjs';
import { InputComponent } from '../components/input/input.component';
import { EditWrapperComponent } from '../edit-wrapper/edit-wrapper.component';

@Component({
  selector: 'app-form-renderer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DragDropModule,
    InputComponent,
    EditWrapperComponent,
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
  @Input() set components(value: any) {
    if (value !== null) {
      this.componentsCopy = JSON.parse(JSON.stringify(value));
      console.log('components', this.componentsCopy);
    }
  }

  @Output() submittedForm = new EventEmitter();
  @Output() selected = new EventEmitter();
  @Output() remove = new EventEmitter();

  importedComponents$: Observable<any[]>;

  destroyRef = inject(DestroyRef);

  form = new FormGroup({});

  private cdr = inject(ChangeDetectorRef);
  private componentImporterService = inject(ComponentImporterService);

  ngOnInit(): void {
    this.importedComponents$ = this.components$.pipe(
      takeUntilDestroyed(this.destroyRef),
      distinctUntilChanged(
        (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
      ),
      distinctUntilChanged(
        (prev, curr) => prev.length === 0 && curr.length === 0
      ),
      tap((components) => console.log('components', components)),
      mergeMap((components) => combineLatest(components.map(component => this.importComponent(component)))),
    );

    this.form.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.cdr.detectChanges();
      });
  }

  removeComponent(id: string) {
    this.remove.emit(id);
  }

  selectComponent(id: string) {
    this.selected.emit(id);
  }

  submitForm() {
    console.log(this.form.value);
    this.submittedForm.emit(this.form.value);
  }

  // createComps(components: any[]) {
  //   let newComponents: any[] = [];
  //   components.forEach(async (component) => {
  //     newComponents.push(await this.importComponent(component));
  //   });

  //   return newComponents;
  // }

  importComponent(configs: any) {
    return this.componentImporterService.getImportedComponent(configs.name).pipe(
      map((component) => {
        return {
          ...configs,
          component,
        };
      }
    ));
    // const newCmp = {
    //   ...configs,
    //   component: this.componentImporterService.getImportedComponent(configs.name),
    // };

    // return newCmp;
  }

  trackById(index: number, item: any) {
    return item.id;
  }
}
