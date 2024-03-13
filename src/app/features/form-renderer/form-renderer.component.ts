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
import { Observable, distinctUntilChanged, map } from 'rxjs';
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

  @Output() submittedForm = new EventEmitter();
  @Output() selected = new EventEmitter();
  @Output() remove = new EventEmitter();

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
