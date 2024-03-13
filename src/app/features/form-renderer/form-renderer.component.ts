import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  AsyncPipe,
  JsonPipe,
  NgComponentOutlet,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, distinctUntilChanged, map, tap } from 'rxjs';
import { InputComponent } from '../components/input/input.component';
import { EditWrapperComponent } from '../edit-wrapper/edit-wrapper.component';
import { CardComponent } from '../../shared/card/card.component';

@Component({
  selector: 'app-form-renderer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DragDropModule,
    InputComponent,
    EditWrapperComponent,
    CardComponent,
    NgComponentOutlet,
    NgFor,
    JsonPipe,
    AsyncPipe,
    NgIf,
  ],
  templateUrl: './form-renderer.component.html',
})
export class FormRendererComponent implements OnInit, AfterViewInit {
  @Input() components$: Observable<any[]>;
  @Input() isEditMode = true;

  @Output() submittedForm = new EventEmitter();
  @Output() selected = new EventEmitter();
  @Output() remove = new EventEmitter();
  @ViewChildren(NgComponentOutlet) components: QueryList<ComponentRef<any>>;

  importedComponents$: Observable<any[]>;

  destroyRef = inject(DestroyRef);

  form = new FormGroup({});

  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.importedComponents$ = this.components$.pipe(
      takeUntilDestroyed(this.destroyRef),
      distinctUntilChanged(
        (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
      ),
      distinctUntilChanged(
        (prev, curr) => prev.length === 0 && curr.length === 0
      ),
      map((components) => this.createComps(components))
    );

    this.form.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.cdr.detectChanges();
      });
  }

  ngAfterViewInit(): void {
    // this.components.changes
    //   .pipe(
    //     takeUntilDestroyed(this.destroyRef),
    //     tap((components: any) =>
    //       console.log('components', components.toArray())
    //     )
    //   )
    //   .subscribe();
  }

  removeComponent(id: string) {
    this.remove.emit(id);
  }

  selectComponent(id: string) {
    this.selected.emit(id);
  }

  submitForm() {
    this.submittedForm.emit(this.form.value);
  }

  createComps(components: any[]) {
    let newComponents: any[] = [];
    components.forEach(async (component) => {
      newComponents.push(await this.importComponent(component));
    });

    return newComponents;
  }

  async importComponent(configs: any) {
    const newCmp = {
      ...configs,
      importedCmp: await configs['component'](),
    };

    return newCmp;
  }

  trackById(index: number, item: any) {
    return item.id;
  }
}
