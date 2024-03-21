import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from "@angular/cdk/drag-drop";
import { AsyncPipe, JsonPipe, NgComponentOutlet, NgFor, NgIf } from "@angular/common";
import { EditComponentWrapperComponent } from "../edit-component-wrapper/edit-component-wrapper.component";
import { ReactiveFormsModule } from "@angular/forms";
import { InputComponent } from "../components/input/input.component";
import { DynamicComponentRenderedComponent } from "../dynamic-component-rendered/dynamic-component-rendered.component";
import { FormRendererComponent } from "../form-renderer/form-renderer.component";

@Component({
  selector: 'app-edit-form-wrapper',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DragDropModule,
    InputComponent,
    EditComponentWrapperComponent,
    DynamicComponentRenderedComponent,
    NgComponentOutlet,
    NgFor,
    JsonPipe,
    AsyncPipe,
    NgIf,
  ],
  templateUrl: './edit-form-wrapper.component.html',
  styleUrl: './edit-form-wrapper.component.css'
})
export class EditFormWrapperComponent extends FormRendererComponent  implements OnInit {

  @Output() selected = new EventEmitter();
  @Output() remove = new EventEmitter();
  @Output() itemsDragged = new EventEmitter();
  @Output() saveToLocalStorage = new EventEmitter();

  // private modalService = inject(NgbModal);


  removeComponent(id: string) {
    this.remove.emit(id);
  }

  selectComponent(id: string) {
    this.selected.emit(id);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.componentsCopy,
      event.previousIndex,
      event.currentIndex
    );
    this.itemsDragged.emit( this.componentsCopy);
  }

  openModal() {

  }

}
