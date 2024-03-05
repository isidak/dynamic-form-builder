import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { AsyncPipe, JsonPipe, NgIf, NgStyle } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { ResizableModule, ResizeEvent } from 'angular-resizable-element';
import { ControlConfig } from './features/dynamic-control/control-config';
import { EditorComponent } from './features/editor/editor.component';
import { FormRendererComponent } from './features/form-renderer/form-renderer.component';
import { FormConfigsService } from './services/form-configs.service';
import { CardComponent } from './shared/card/card.component';
import { ControlsActions } from './store/controls.actions';
import { controlsFeature } from './store/controls.state';
import { Observable, filter, take, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    RouterOutlet,
    EditorComponent,
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
  ],
})
export class AppComponent implements OnInit {
  title = 'dynamic-form-builder';
  store = inject(Store);
  selectedControl$ = this.store.select(controlsFeature.selectSelectedControl);
  style = {};
  //  configArray: ControlConfig[] = [];
  private formConfigService = inject(FormConfigsService);
  formConfigs$ = this.store
    .select(controlsFeature.selectControls);

  ngOnInit(): void {
    this.formConfigService
      .getControlConfigs()
      .pipe(take(1), tap())
      .subscribe((controls) => {
        this.store.dispatch(ControlsActions.setControls({ controls }));
      });
  }

  onEditorSubmit(value: any) {
    value.isEdit
      ? this.saveControl(value.formValue)
      : this.addControl(value.formValue);
  }

  addControl(control: ControlConfig) {
    control.id = `${this.generateId()}`;
    this.store.dispatch(ControlsActions.addControl({ control }));
  }

  submitForm(value: any) {
    this.formConfigService.submitForm(value);
  }

  onResizeEnd(event: ResizeEvent): void {
    this.style = {
      position: 'fixed',
      left: `${event.rectangle.left}px`,
      top: `${event.rectangle.top}px`,
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`,
    };
  }

  drop(event: CdkDragDrop<string[]>, formConfigs: ControlConfig[]) {
    // moveItemInArray(this.configArray, event.previousIndex, event.currentIndex);
    // this.store.dispatch(ControlsActions.setControls({ controls: this.configArray }));
  }

  editControl(event: ControlConfig) {
    this.store.dispatch(
      ControlsActions.selectControl({
        controlId: event.name,
        selectedControl: event,
      })
    );
  }

  removeControl(event: ControlConfig) {
    this.store.dispatch(
      ControlsActions.removeControl({ controlId: event.name })
    );
  }

  saveControl(control: ControlConfig) {
    this.store.dispatch(
      ControlsActions.editControl({
        controlId: control.name,
        editedControl: control,
      })
    );
  }

  generateId() {
    let newId;
    const controls = this.store.selectSignal(controlsFeature.selectControls)();

    if (controls.length === 0) return newId = 1;
    if (controls.length > 1)
      return (newId =
        Math.max(...controls.map((control) => Number(control.id))) + 1);
    return (newId =
      (Number(
        controls.reduce((a, b) => ((a?.id ?? 0) > (b?.id ?? 0) ? a : b)).id
      ) ?? 0) + 1);
  }
}
