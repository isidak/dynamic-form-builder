import { CdkDrag } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-edit-wrapper',
  standalone: true,
  imports: [CdkDrag],
  templateUrl: './edit-wrapper.component.html',
  styleUrl: './edit-wrapper.component.css'
})
export class EditWrapperComponent {
  @Output() remove = new EventEmitter();
  @Output() edit = new EventEmitter();

}
