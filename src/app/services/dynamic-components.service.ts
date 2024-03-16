import { Injectable, inject } from '@angular/core';
import cloneDeep from 'clone-deep';
import clone from 'just-clone';
import {
  Observable,
  delay,
  of
} from 'rxjs';
import {
  ComponentTypeNames,
  InputTypes
} from '../features/models/dynamic-component-config';
import { ComponentImporterService } from './component-importer.service';


const components = [
  {
    id: '1',
    name: ComponentTypeNames.Input,
    inputs: {
      type: InputTypes.Text,
      controlName: 'label',
      label: 'Label',
      placeholder: 'Enter label name',
      required: true,
      minLength: 3,
      readonly: false,
      autocomplete: 'off',
    },
  },
  {
    id: '2',
    name: ComponentTypeNames.Input,
    inputs: {
      type: InputTypes.Text,
      controlName: 'controlName',
      label: 'Control name',
      placeholder: 'Enter control name',
      required: true,
      minLength: 3,
      readonly: false,
      autocomplete: 'off',
    },
  },
  {
    id: '3',
    name: ComponentTypeNames.Input,
    inputs: {
      type: InputTypes.Text,
      controlName: 'placeholder',
      label: 'Placeholder',
      placeholder: 'Enter placeholder',
      required: true,
      minLength: 3,
      readonly: false,
      autocomplete: 'on',
    },
  },
  {
    id: '4',
    name: ComponentTypeNames.Input,
    inputs: {
      type: InputTypes.Number,
      controlName: 'minLength',
      label: 'Min Length',
      min: 0,
      max: 50,
      placeholder: 'Enter min length',
      required: true,
      autocomplete: 'on',
    },
  },
  {
    id: '5',
    name: ComponentTypeNames.Select,
    inputs: {
      type: InputTypes.Text,
      controlName: 'name',
      label: 'Choose Component type:',
      placeholder: 'select a component type',
      options: [
        { value: 'input', label: 'Input' },
        { value: 'select', label: 'Select' },
        { value: 'checkbox', label: 'Checkbox' },
        { value: 'textarea', label: 'Textarea' },
        { value: 'file', label: 'File' },
      ],
      required: true,
    },
  },
  {
    id: '6',
    name: ComponentTypeNames.Select,
    inputs: {
      type: InputTypes.Text,
      controlName: 'type',
      label: 'Choose FormControl type:',
      placeholder: 'select a control type',
      options: [
        { value: 'text', label: 'Text' },
        { value: 'number', label: 'Number' },
        { value: 'email', label: 'Email' },
        { value: 'password', label: 'Password' },
        { value: 'date', label: 'Date' },
        { value: 'time', label: 'Time' },
        { value: 'file', label: 'File' },
        { value: 'textarea', label: 'Textarea' },
      ],
      required: true,
    },
  },
  {
    id: '7',
    name: ComponentTypeNames.Checkbox,
    inputs: {
      type: InputTypes.Checkbox,
      controlName: 'required',
      label: 'Required',
      required: true,
      autocomplete: 'on',
    },
  },
];

const inputTypes: InputTypes[] = [...Object.values(InputTypes)];

@Injectable({
  providedIn: 'root',
})
export class DynamicComponentsService {
  private componentImporterService = inject(ComponentImporterService);

  getComponents(): Observable<any[]> {
    return of(cloneDeep(components)).pipe(
      delay(20)
    );
  }

  submitForm(value: any) {
    console.log(value);
  }

  getInputTypes(): Observable<string[]> {
    return of(clone(inputTypes)).pipe(delay(1));
  }
}
