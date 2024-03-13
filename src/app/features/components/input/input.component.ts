import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseInput } from '../base-input/base-input';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
})
export class InputComponent extends BaseInput  {

}
