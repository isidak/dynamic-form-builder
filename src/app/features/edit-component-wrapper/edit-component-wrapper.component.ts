import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Output } from '@angular/core';
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-edit-component-wrapper',
  standalone: true,
  imports: [CdkDrag, CdkDragHandle, NgbTooltipModule],
  templateUrl: './edit-component-wrapper.component.html',
  styleUrl: './edit-component-wrapper.component.css'
})
export class EditComponentWrapperComponent {
  @Output() remove = new EventEmitter();
  @Output() edit = new EventEmitter();

}
