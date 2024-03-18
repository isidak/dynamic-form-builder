import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CdkDrag, CdkDragHandle],
  templateUrl: './card.component.html',
})
export class CardComponent {
  @Input() title: string;
}
