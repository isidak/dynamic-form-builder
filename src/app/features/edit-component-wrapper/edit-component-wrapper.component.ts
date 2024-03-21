import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-edit-component-wrapper',
  standalone: true,
  imports: [CdkDrag, CdkDragHandle],
  templateUrl: './edit-component-wrapper.component.html',
  styleUrl: './edit-component-wrapper.component.css'
})
export class EditComponentWrapperComponent {
  @Output() remove = new EventEmitter();
  @Output() edit = new EventEmitter();

}
