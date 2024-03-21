import { inject, Injectable } from '@angular/core';
import clone from 'just-clone';
import { delay, map, Observable, of } from 'rxjs';
import { ComponentTypeNames, DynamicComponentConfig, InputTypes } from '../features/models/dynamic-component-config';
import { StorageMap } from "@ngx-pwa/local-storage";


const components = [
  {
    id: '1',
    name: ComponentTypeNames.Input,
    index: '0',
    columnId: '0',
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
    index: '1',
    columnId: '1',
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
    index: '2',
    columnId: '2',
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
    index: '3',
    columnId: '3',
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
    index: '4',
    columnId: '4',
    inputs: {
      type: InputTypes.Text,
      controlName: 'name',
      label: 'Choose Component type:',
      placeholder: 'select a component type',
      options: [
        {value: 'input', label: 'Input'},
        {value: 'select', label: 'Select'},
        {value: 'checkbox', label: 'Checkbox'},
        {value: 'textarea', label: 'Textarea'},
        {value: 'file', label: 'File'},
      ],
      required: true,
    },
  },
  {
    id: '6',
    name: ComponentTypeNames.Select,
    index: '5',
    columnId: '5',
    inputs: {
      type: InputTypes.Text,
      controlName: 'type',
      label: 'Choose FormControl type:',
      placeholder: 'select a control type',
      options: [
        {value: 'text', label: 'Text'},
        {value: 'number', label: 'Number'},
        {value: 'email', label: 'Email'},
        {value: 'password', label: 'Password'},
        {value: 'date', label: 'Date'},
        {value: 'time', label: 'Time'},
        {value: 'file', label: 'File'},
        {value: 'textarea', label: 'Textarea'},
      ],
      required: true,
    },
  },
  {
    id: '7',
    name: ComponentTypeNames.Checkbox,
    index: '6',
    columnId: '6',
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
  private storage = inject(StorageMap);

  getComponents(): Observable<DynamicComponentConfig[]> {
    return this.storage.get('form').pipe(
      map((form: any) => Array.isArray(form) ? (form as DynamicComponentConfig[]) : [...components as DynamicComponentConfig[]]),
      delay(20)
    );
  }

  submitForm(value: any) {
    console.log(value);
  }

  getInputTypes(): Observable<InputTypes[]> {
    return of(clone(inputTypes)).pipe(delay(1))
  }
}
