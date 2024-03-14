import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { ComponentType } from '../features/models/component-type';
import { ComponentTypeNames, DynamicComponentConfig, InputTypes } from '../features/models/dynamic-component-config';

@Injectable({
  providedIn: 'root',
})
export class FormConfigsService {
  private componentTypes: ComponentType[] = [
    {
      name: ComponentTypeNames.Input,
      component: async () =>
        (await import('../features/components/input/input.component'))
          .InputComponent,
    },
    {
      name: ComponentTypeNames.Select,
      component: async () =>
        (await import('../features/components/select/select.component'))
          .SelectComponent,
    },
    // {
    //   name: 'radio',
    //   component: async () =>
    //     (await import('../features/components/radio/radio.component')).RadioComponent,
    // },
    {
      name: ComponentTypeNames.Checkbox,
      component: async () =>
        (await import('../features/components/checkbox/checkbox.component'))
          .CheckboxComponent,
    },
    {
      name: ComponentTypeNames.Textarea,
      component: async () =>
        (await import('../features/components/textarea/textarea.component'))
          .TextareaComponent,
    },
    // {
    //   name: 'date',
    //   component: async () =>
    //     (await import('../features/components/date/date.component')).DateComponent,
    // },
    // {
    //   name: 'time',
    //   component: async () =>
    //     (await import('../features/components/time/time.component')).TimeComponent,
    // },
    {
      name: ComponentTypeNames.File,
      component: async () =>
        (await import('../features/components/file-input/file-input.component'))
          .FileInputComponent,
    },
    // {
    //   name: 'button',
    //   component: async () =>
    //     (await import('../features/components/button/button.component'))
    //       .ButtonComponent,
    // },
  ];

  private components: DynamicComponentConfig[] = [
    {
      component: async () =>
        (await import('../features/components/input/input.component'))
          .InputComponent,

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
      component: async () =>
        (await import('../features/components/input/input.component'))
          .InputComponent,

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
      component: async () =>
        (await import('../features/components/input/input.component'))
          .InputComponent,

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
      component: async () =>
        (await import('../features/components/input/input.component'))
          .InputComponent,

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
      component: async () =>
        (await import('../features/components/select/select.component'))
          .SelectComponent,
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
      component: async () =>
        (await import('../features/components/select/select.component'))
          .SelectComponent,
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
      component: async () =>
        (await import('../features/components/checkbox/checkbox.component'))
          .CheckboxComponent,

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

  private inputTypes: InputTypes[] = [...Object.values(InputTypes)];

  getComponents(): Observable<any[]> {
    return of(this.components).pipe(delay(1));
  }
  getComponentTypes(): Observable<ComponentType[]> {
    return of(this.componentTypes).pipe(delay(1));
  }

  submitForm(value: any) {
    console.log(value);
  }

  getInputTypes(): Observable<string[]> {
    return of(this.inputTypes).pipe(delay(1));
  }
}
