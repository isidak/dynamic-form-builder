import { CdkDrag } from '@angular/cdk/drag-drop';
import { NgClass, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BaseInput } from '../base-input/base-input';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf, CdkDrag],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
})
export class InputComponent extends BaseInput  {

}
