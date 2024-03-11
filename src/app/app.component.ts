import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { AsyncPipe, JsonPipe, NgIf, NgStyle } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { ResizableModule } from 'angular-resizable-element';
import { Subject, map, take, takeUntil, tap, withLatestFrom } from 'rxjs';
import { ControlConfig } from './features/dynamic-control/control-config';
import { EditorComponent } from './features/editor/editor.component';
import { FormRendererComponent } from './features/form-renderer/form-renderer.component';
import { FormConfigsService } from './services/form-configs.service';
import { CardComponent } from './shared/card/card.component';
import { ComponentsActions, ControlsActions } from './store/controls.actions';
import { componentsFeature, controlsFeature } from './store/controls.state';
import { InputComponent } from './features/components/input/input.component';
import { ComponentCreatorComponent } from './features/component-creator/component-creator.component';
import { DynamicComponentConfig } from './features/models/dynamic-component-config';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    RouterOutlet,
    EditorComponent,
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
  private formConfigService = inject(FormConfigsService);
  private destroyRef = inject(DestroyRef);

  selectedComponent$ = this.store.select(
    componentsFeature.selectSelectedComponent
  );
  selectedControl$ = this.store.select(controlsFeature.selectSelectedControl);
  displayGeneratedConfigs = false;
  //  configArray: ControlConfig[] = [];
  formConfigs$ = this.store.select(controlsFeature.selectControls);
  inputTypes$ = this.store.select(controlsFeature.selectInputTypes);
  components$ = this.store.select(componentsFeature.selectComponents);
  componentTypes$ = this.store.select(componentsFeature.selectComponentTypes);

  addComponent$ = new Subject<DynamicComponentConfig>();

  ngOnInit(): void {
    // this.formConfigService
    //   .getConfigs()
    //   .pipe(take(1))
    //   .subscribe(([controls, inputTypes]) => {
    //     this.store.dispatch(ControlsActions.setControls({ controls }));
    //     this.store.dispatch(ControlsActions.setInputTypes({ inputTypes }));
    //   });

    this.formConfigService
      .getComponents()
      .pipe(take(1))
      .subscribe((components) => {
        this.store.dispatch(ComponentsActions.setComponents({ components }));
      });

    this.formConfigService
      .getComponentTypes()
      .pipe(take(1))
      .subscribe((componentTypes) => {
        this.store.dispatch(
          ComponentsActions.setComponentTypes({ componentTypes })
        );
      });

    this.addComponent$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        withLatestFrom(this.componentTypes$),
        map(([component, componentTypes]) => {
          if (!componentTypes) return component;
          const componentType = componentTypes.find(
            (type) => type.name === component.name
          );
          component.id = this.generateId().toString();
          component['component'] = componentType!.component;
          return component;
        }),
        tap((component) =>
          this.store.dispatch(ComponentsActions.addComponent({ component }))
        )
      )
      .subscribe();
  }

  onEditorSubmit(value: any) {
    // value.isEdit
    //   ? this.saveControl(value.formValue)
    // : // : this.addControl(value.formValue);
    this.addComponent(value);
  }

  addControl(control: ControlConfig) {
    control.id = `${this.generateId()}`;
    this.store.dispatch(ControlsActions.addControl({ control }));
  }

  addComponent(component: DynamicComponentConfig) {
    console.log('component', component);
    this.addComponent$.next(component);
  }

  submitForm(value: any) {
    this.formConfigService.submitForm(value);
  }

  drop(event: CdkDragDrop<string[]>, formConfigs: ControlConfig[]) {
    // moveItemInArray(this.configArray, event.previousIndex, event.currentIndex);
    // this.store.dispatch(ControlsActions.setControls({ controls: this.configArray }));
  }

  selectComponent(id: string) {
    this.store.dispatch(
      ComponentsActions.selectComponent({id})
    );
  }

  removeComponent(id: string) {
    this.store.dispatch(ComponentsActions.removeComponent({ componentId: id }));
  }

  saveControl(control: ControlConfig) {
    this.store.dispatch(
      ControlsActions.editControl({
        controlId: control.id,
        editedControl: control,
      })
    );
  }

  generateId() {
    let newId;
    const components = this.store.selectSignal(
      componentsFeature.selectComponents
    )();
    console.log('id', components);

    if (components.length === 0) return (newId = 1);
    if (components.length > 1)
      return (newId =
        Math.max(...components.map((component) => Number(component.id))) + 1);
    return (newId =
      (Number(
        components.reduce((a, b) => ((a?.id ?? 0) > (b?.id ?? 0) ? a : b)).id
      ) ?? 0) + 1);
  }
}
