import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { AsyncPipe, JsonPipe, NgIf, NgStyle } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { ResizableModule } from 'angular-resizable-element';
import { Subject, map, tap, Observable, take, switchMap } from 'rxjs';
import { ComponentCreatorComponent } from './features/component-creator/component-creator.component';
import { InputComponent } from './features/components/input/input.component';
import { FormRendererComponent } from './features/form-renderer/form-renderer.component';
import { DynamicComponentConfig } from './features/models/dynamic-component-config';
import { DynamicComponentsService } from './services/dynamic-components.service';
import { CardComponent } from './shared/card/card.component';
import {
  ComponentsAPIActions,
  ComponentsActions,
  InputTypesAPIActions,
} from './store/app.actions';
import {
  componentsFeature,
  inputsFeature,
  selectSortedComponents,
} from './store/app.state';
import { StorageMap } from "@ngx-pwa/local-storage";
import { ComponentsMap } from "./features/models/components-map";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    RouterOutlet,
    ComponentCreatorComponent,
    FormRendererComponent,
    CardComponent,
    JsonPipe,
    NgIf,
    AsyncPipe,
    ResizableModule,
    CdkDrag,
    CdkDragHandle,
    NgStyle,
    CdkDragHandle,
    DragDropModule,
    InputComponent,

  ],
})
export class AppComponent implements OnInit {
  title = 'dynamic-form-builder';

  private store = inject(Store);
  private dynamicComponentsService = inject(DynamicComponentsService);
  private destroyRef = inject(DestroyRef);
  private storage = inject(StorageMap)

  displayGeneratedConfigs = false;
  // vm$ = this.store.select(appPageViewModel);
  inputTypes$: Observable<string[]> = this.store.select(inputsFeature.selectInputTypes);
  components$: Observable<DynamicComponentConfig[]> = this.store.select(selectSortedComponents);
  componentTypes$: Observable<ComponentsMap[] | null> = this.store.select(componentsFeature.selectComponentTypes);
  selectedComponent$: Observable<DynamicComponentConfig | null | undefined> = this.store.select(
    componentsFeature.selectSelectedComponent
  );

  addComponent$ = new Subject<DynamicComponentConfig>();

  ngOnInit(): void {
    this.store.dispatch(InputTypesAPIActions.loadInputTypes());
    this.store.dispatch(ComponentsAPIActions.loadComponents());
    this.store.dispatch(ComponentsAPIActions.loadComponentTypes());

    this.addComponent$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((component) => ({
          ...component,
          id: this.generateId().toString(),
        })),
        tap((component: DynamicComponentConfig) =>
          this.store.dispatch(ComponentsActions.addComponent({component}))
        )
      )
      .subscribe();
  }

  onEditorSubmit(value: any) {
    value.isEdit
      ? this.saveComponent(value.form)
      : this.addComponent(value.form);
  }

  addComponent(component: DynamicComponentConfig) {
    this.addComponent$.next(component);
  }

  submitForm(value: any) {
    this.dynamicComponentsService.submitForm(value);

  }

  drop(event: CdkDragDrop<string[]>) {
    // moveItemInArray(this.configArray, event.previousIndex, event.currentIndex);
    // this.store.dispatch(ControlsActions.setControls({ controls: this.configArray }));
  }

  sortComponents(positions: any) {
    // console.log('positions', positions);
    // this.store.dispatch(ComponentsActions.sortComponents(positions));
  }

  selectComponent(id: string) {
    this.store.dispatch(ComponentsActions.selectComponent({id}));
  }

  removeComponent(id: string) {
    this.store.dispatch(ComponentsActions.removeComponent({id}));
    if (
      this.store.selectSignal(componentsFeature.selectSelectedComponentId)() ===
      id
    ) {
      this.store.dispatch(ComponentsActions.clearSelectedComponent());
    }
  }

  saveComponent(component: DynamicComponentConfig) {
    this.store.dispatch(
      ComponentsActions.editComponent({
        editedComponent: component,
      })
    );
    this.store.dispatch(ComponentsActions.clearSelectedComponent());
  }

  cancelEdit() {
    this.store.dispatch(ComponentsActions.clearSelectedComponent());
  }

  generateId() {
    let newId;
    const components = this.store.selectSignal(componentsFeature.selectAll)();
    // selectSignal(
    //   componentsFeature.selectComponents
    // )();
    console.log('id', components);

    if (components === null || components.length === 0) return (newId = 1);
    if (components.length > 1)
      return (newId =
        Math.max(...components.map((component) => Number(component.id))) + 1);
    return (newId =
      (Number(
        components.reduce((a, b) => ((a?.id ?? 0) > (b?.id ?? 0) ? a : b)).id
      ) ?? 0) + 1);
  }

  saveToLocalStorage() {
    this.components$.pipe(
      take(1),
      switchMap((components) =>
        this.storage.set('form', components))
    ).subscribe();
  }


  saveOrder(cmps: DynamicComponentConfig[]) {
    const components: DynamicComponentConfig[] = this.updateIndex(cmps);
    this.store.dispatch(ComponentsActions.setComponents({components}));

  }

  private updateIndex(componentsCopy: DynamicComponentConfig[]) {
    const components = componentsCopy.map((component: DynamicComponentConfig) => {
      const cmpClone = {...component};
      delete cmpClone.component;
      cmpClone.index = componentsCopy.indexOf(component).toString();
      return cmpClone;
    });
    return components;
  }
}
