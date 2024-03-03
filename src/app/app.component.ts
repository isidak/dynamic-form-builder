import { BehaviorSubject } from 'rxjs';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EditorComponent } from './features/editor/editor.component';
import { FormRendererComponent } from './features/form-renderer/form-renderer.component';
import { ControlConfig } from './features/dynamic-control/control-config';
import { CardComponent } from './shared/card/card.component';
import { AsyncPipe, JsonPipe, NgIf, NgStyle } from '@angular/common';
import { FormConfigsService } from './services/form-configs.service';
import { ResizableModule, ResizeEvent } from 'angular-resizable-element';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

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
export class AppComponent {
  title = 'dynamic-form-builder';
  selectedControl$ = new BehaviorSubject<ControlConfig | null>(null);
  style = {};
  private formConfigService = inject(FormConfigsService);

  formConfigs$ = this.formConfigService.formConfigs$;

  addForm(value: any) {
    this.formConfigService.addForm(value);
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
    console.log(
      moveItemInArray(formConfigs, event.previousIndex, event.currentIndex)
    );
    console.log(formConfigs);
  }

  editControl(event: any) {
    console.log(event);
    this.selectedControl$.next(event);
  }
}
