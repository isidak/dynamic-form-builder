import { ReactiveFormsModule } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { BaseInput } from '../base-input/base-input';
import { NgFor, NgIf } from '@angular/common';
import { Option } from '../../models/dynamic-component-config';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class SelectComponent extends BaseInput {
@Input() options: Option[] = [];
}
