import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CdkDrag, CdkDragHandle, NgbTooltipModule],
  templateUrl: './card.component.html',
})
export class CardComponent {
  @Input() title: string;
}
