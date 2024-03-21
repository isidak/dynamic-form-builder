import { CdkDrag, CdkDragHandle, DragDropModule, } from '@angular/cdk/drag-drop';
import { AsyncPipe, JsonPipe, NgIf, NgStyle } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { ResizableModule } from 'angular-resizable-element';
import { map, Observable, Subject, switchMap, take, tap } from 'rxjs';
import { ComponentCreatorComponent } from './features/component-creator/component-creator.component';
import { InputComponent } from './features/components/input/input.component';
import { FormRendererComponent } from './features/form-renderer/form-renderer.component';
import { DynamicComponentConfig } from './features/models/dynamic-component-config';
import { DynamicComponentsService } from './services/dynamic-components.service';
import { CardComponent } from './shared/card/card.component';
import { ComponentsActions, ComponentsAPIActions, InputTypesAPIActions, } from './store/app.actions';
import { componentsFeature, inputsFeature, selectSortedComponents, } from './store/app.state';
import { StorageMap } from "@ngx-pwa/local-storage";
import { ComponentsMap } from "./features/models/components-map";
import { EditFormWrapperComponent } from "./features/edit-form-wrapper/edit-form-wrapper.component";

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
    EditFormWrapperComponent,
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

  displayGeneratedConfigs = false;
  inputTypes$: Observable<string[]>;
  components$: Observable<DynamicComponentConfig[]>;
  hasComponents$: Observable<boolean>;
  componentTypes$: Observable<ComponentsMap[] | null>;
  selectedComponent$: Observable<DynamicComponentConfig | null | undefined>;
  addComponent$ = new Subject<DynamicComponentConfig>();

  private store = inject(Store);
  private dynamicComponentsService = inject(DynamicComponentsService);
  private destroyRef = inject(DestroyRef);
  private storage = inject(StorageMap)

  ngOnInit(): void {
    this.loadDataToStore();
    this.addComponentSub();
    this.setInputs();
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
    const components = this.store.selectSignal(componentsFeature.selectAll)();

    if (components === null || components.length === 0) return 1;
    if (components.length > 1)
      return (
        Math.max(...components.map((component) => Number(component.id))) + 1);
    return (
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


  sortComponents(cmps: DynamicComponentConfig[]) {
    const components: DynamicComponentConfig[] = this.updateIndex(cmps);
    this.store.dispatch(ComponentsActions.setComponents({components}));

  }

  private setInputs() {
    this.inputTypes$ = this.store.select(inputsFeature.selectInputTypes);
    this.components$ = this.store.select(selectSortedComponents);
    this.componentTypes$ = this.store.select(componentsFeature.selectComponentTypes);
    this.selectedComponent$ = this.store.select(
      componentsFeature.selectSelectedComponent
    );
    this.hasComponents$ = this.components$.pipe(map(components => components.length > 0));
  }

  private addComponentSub() {
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

  private loadDataToStore() {
    this.store.dispatch(InputTypesAPIActions.loadInputTypes());
    this.store.dispatch(ComponentsAPIActions.loadComponents());
    this.store.dispatch(ComponentsAPIActions.loadComponentTypes());
  }

  private updateIndex(componentsCopy: DynamicComponentConfig[]) {
    return componentsCopy.map((component: DynamicComponentConfig) => {
      const cmpClone = {...component};
      delete cmpClone.component;
      cmpClone.index = componentsCopy.indexOf(component).toString();
      return cmpClone;
    });
  }
}
