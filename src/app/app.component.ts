import { ComponentImporterService } from './services/component-importer.service';
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
import { Subject, filter, map, tap, withLatestFrom } from 'rxjs';
import { ComponentCreatorComponent } from './features/component-creator/component-creator.component';
import { InputComponent } from './features/components/input/input.component';
import { FormRendererComponent } from './features/form-renderer/form-renderer.component';
import { DynamicComponentConfig } from './features/models/dynamic-component-config';
import { DynamicComponentsService } from './services/dynamic-components.service';
import { CardComponent } from './shared/card/card.component';
import {
  ComponentsAPIActions,
  ComponentsActions,
  InputTypesAPIActions
} from './store/app.actions';
import {
  appPageViewModel,
  componentsFeature,
  inputsFeature,
  selectFilteredValues,
} from './store/app.state';
import clone from 'just-clone';

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
  private ComponentImporterService = inject(ComponentImporterService);

  selectedComponent$ = this.store.select(
    componentsFeature.selectSelectedComponent
  );
  displayGeneratedConfigs = false;
  // vm$ = this.store.select(appPageViewModel);
  inputTypes$ = this.store.select(inputsFeature.selectInputTypes);
  components$ = this.store.pipe(selectFilteredValues);
  componentTypes$ = this.store.select(componentsFeature.selectComponentTypes);

  addComponent$ = new Subject<DynamicComponentConfig>();

  ngOnInit(): void {
    this.store.dispatch(InputTypesAPIActions.loadInputTypes());
    this.store.dispatch(ComponentsAPIActions.loadComponents());
    this.store.dispatch(ComponentsAPIActions.loadComponentTypes());
    // this.components$ = this.importComponents()

    this.addComponent$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        // withLatestFrom(this.componentTypes$),
        // map(([component, componentTypes]) => {
        //   if (!componentTypes) return component;
        //   const componentType = componentTypes.find(
        //     (type) => type.name === component.name
        //   );
        //   component.id = this.generateId().toString();
        //   component['component'] = componentType!.component;
        //   return component;
        // }),
        map(component => ( {...component, id: this.generateId().toString()})),
        tap((cmp) => console.log(cmp)),
        tap((component: DynamicComponentConfig) =>
          this.store.dispatch(ComponentsActions.addComponent({ component }))
        )
      )
      .subscribe();
  }

  importComponent(component: DynamicComponentConfig) {
    // this.ComponentImporterService.importComponentByName(component.name);

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

  selectComponent(id: string) {
    this.store.dispatch(ComponentsActions.selectComponent({ id }));
  }

  removeComponent(id: string) {
    this.store.dispatch(ComponentsActions.removeComponent({ id }));
  }

  saveComponent(component: DynamicComponentConfig) {
    this.store.dispatch(
      ComponentsActions.editComponent({
        editedComponent: component,
      })
    );
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
}
