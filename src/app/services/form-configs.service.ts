import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import {
  ComponentInputNames,
  ComponentTypeNames,
  IBaseInput,
  IComponentType,
  IDynamicComponentConfig,
  InputTypes,
} from '../features/models/dynamic-component-config';

@Injectable({
  providedIn: 'root',
})
export class FormConfigsService {

  private COMPONENT_TYPE_INPUTS_CONFIG: IBaseInput = {
      type: InputTypes.Text,
      controlName: 'name',
      label: 'Choose Component type:',
      placeholder: 'select a component type',
      options: [
        { value: ComponentTypeNames.Input, label: 'Input' },
        { value: ComponentTypeNames.Select, label: 'Select' },
        { value: ComponentTypeNames.Checkbox, label: 'Checkbox' },
        { value: ComponentTypeNames.Textarea, label: 'Textarea' },
        { value: ComponentTypeNames.File, label: 'File' },
      ],
      required: true,
    }

    private COMPONENT_CONTROL_NAME_INPUTS_CONFIG: IBaseInput = {
      type: InputTypes.Text,
      controlName: 'controlName',
      label: 'Control name',
      placeholder: 'Enter control name',
      required: true,
      minLength: 3,
      readonly: false,
      autocomplete: 'off',
    }

    private COMPONENT_LABEL_INPUTS_CONFIG: IBaseInput = {
      type: InputTypes.Text,
      controlName: 'label',
      label: 'Label',
      placeholder: 'Enter label name',
      required: true,
      minLength: 3,
      readonly: false,
      autocomplete: 'off',
    }

    private COMPONENT_PLACEHOLDER_INPUTS_CONFIG: IBaseInput = {
      type: InputTypes.Text,
      controlName: 'placeholder',
      label: 'Placeholder',
      placeholder: 'Enter placeholder',
      required: true,
      minLength: 3,
      readonly: false,
      autocomplete: 'on',
    }

    private COMPONENT_MIN_LENGTH_INPUTS_CONFIG: IBaseInput = {
      type: InputTypes.Number,
      controlName: 'minLength',
      label: 'Min Length',
      min: 0,
      max: 50,
      placeholder: 'Enter min length',
      required: true,
      autocomplete: 'on',
    }

    private COMPONENT_REQUIRED_INPUTS_CONFIG: IBaseInput = {
      type: InputTypes.Checkbox,
      controlName: 'required',
      label: 'Required',
      required: true,
      autocomplete: 'on',
    }

    private FORM_CONTROL_TYPE_INPUTS_CONFIG: IBaseInput = {
      type: InputTypes.Checkbox,
      controlName: 'type',
      label: 'Choose FormControl type:',
      placeholder: 'select a control type',
      options: [
        { value: InputTypes.Text, label: 'Text' },
        { value: InputTypes.Number, label: 'Number' },
        { value: InputTypes.Email, label: 'Email' },
        { value: InputTypes.Password, label: 'Password' },
        { value: InputTypes.Date, label: 'Date' },
        { value: InputTypes.Time, label: 'Time' },
        { value: InputTypes.File, label: 'File' },
        { value: InputTypes.Textarea, label: 'Textarea' },
      ],
      required: true,
    }


  private componentTypes: IComponentType[] = [
    {
      name: ComponentTypeNames.Input,
      component: async () =>
        (await import('../features/components/input/input.component'))
          .InputComponent,
      inputs: this.COMPONENT_CONTROL_NAME_INPUTS_CONFIG,
      inputsList: [
        {
          type: ComponentTypeNames.Input,
          name: ComponentInputNames.ControlName,
          validators: [],
          features: [],
        },
        {
          type: ComponentTypeNames.Input,
          name: ComponentInputNames.Label,
          validators: [],
          features: [],
        },
        {
          type: ComponentTypeNames.Input,
          name: ComponentInputNames.Placeholder,
          validators: [],
          features: [],
        },
        {
          type: ComponentTypeNames.Select,
          name: ComponentInputNames.Type,
          options: [
            { value: InputTypes.Text, label: 'Text' },
            { value: InputTypes.Number, label: 'Number' },
            { value: InputTypes.Email, label: 'Email' },
            { value: InputTypes.Password, label: 'Password' },
            { value: InputTypes.Date, label: 'Date' },
            { value: InputTypes.Time, label: 'Time' },
            { value: InputTypes.File, label: 'File' },
            { value: InputTypes.Textarea, label: 'Textarea' },
          ],
          validators: [],
          features: [],
        },
      ],
    },
    {
      name: ComponentTypeNames.Select,
      component: async () =>
        (await import('../features/components/select/select.component'))
          .SelectComponent,
          id: '1',
      inputs: this.COMPONENT_TYPE_INPUTS_CONFIG,
      inputsList: [
        {
          type: ComponentTypeNames.Input,
          name: ComponentInputNames.ControlName,
          validators: [],
          features: [],
        },
        {
          type: ComponentTypeNames.Input,
          name: ComponentInputNames.Label,
          validators: [],
          features: [],
        },
        {
          type: ComponentTypeNames.Input,
          name: ComponentInputNames.Placeholder,
          validators: [],
          features: [],
        },
        {
          type: ComponentTypeNames.Select,
          name: ComponentInputNames.Type,
          options: [
            { value: InputTypes.Text, label: 'Text' },
            { value: InputTypes.Number, label: 'Number' },
            { value: InputTypes.Email, label: 'Email' },
            { value: InputTypes.Password, label: 'Password' },
            { value: InputTypes.Date, label: 'Date' },
            { value: InputTypes.Time, label: 'Time' },
            { value: InputTypes.File, label: 'File' },
            { value: InputTypes.Textarea, label: 'Textarea' },
          ],
          validators: [],
          features: [],
        },
      ],
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
      inputs: this.FORM_CONTROL_TYPE_INPUTS_CONFIG,

      inputsList: [
        {
          type: ComponentTypeNames.Input,
          name: ComponentInputNames.ControlName,
          validators: [],
          features: [],
        },
        {
          type: ComponentTypeNames.Input,
          name: ComponentInputNames.Label,
          validators: [],
          features: [],
        },
        {
          type: ComponentTypeNames.Input,
          name: ComponentInputNames.Placeholder,
          validators: [],
          features: [],
        },
      ],
    },
    // {
    //   name: ComponentTypeNames.Textarea,
    //   component: async () =>
    //     (await import('../features/components/textarea/textarea.component'))
    //       .TextareaComponent,
    // },
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
    // {
    //   name: ComponentTypeNames.File,
    //   component: async () =>
    //     (await import('../features/components/file-input/file-input.component'))
    //       .FileInputComponent,
    // },
    // {
    //   name: 'button',
    //   component: async () =>
    //     (await import('../features/components/button/button.component'))
    //       .ButtonComponent,
    // },
  ];

  private components: IDynamicComponentConfig[] = [
    {
      component: async () =>
        (await import('../features/components/input/input.component'))
          .InputComponent,

      id: '1',
      name: ComponentTypeNames.Input,
      inputs: this.COMPONENT_LABEL_INPUTS_CONFIG,
    },
    {
      component: async () =>
        (await import('../features/components/input/input.component'))
          .InputComponent,

      id: '2',
      name: ComponentTypeNames.Input,
      inputs: this.COMPONENT_CONTROL_NAME_INPUTS_CONFIG,
    },
    {
      component: async () =>
        (await import('../features/components/input/input.component'))
          .InputComponent,

      id: '3',
      name: ComponentTypeNames.Input,
      inputs: this.COMPONENT_PLACEHOLDER_INPUTS_CONFIG,
    },
    {
      component: async () =>
        (await import('../features/components/input/input.component'))
          .InputComponent,

      id: '4',
      name: ComponentTypeNames.Input,
      inputs: this.COMPONENT_MIN_LENGTH_INPUTS_CONFIG,
    },
    {
      component: async () =>
        (await import('../features/components/select/select.component'))
          .SelectComponent,
      id: '5',
      name: ComponentTypeNames.Select,
      inputs: this.COMPONENT_TYPE_INPUTS_CONFIG,
    },
    {
      component: async () =>
        (await import('../features/components/select/select.component'))
          .SelectComponent,
      id: '6',
      name: ComponentTypeNames.Select,
      inputs: this.FORM_CONTROL_TYPE_INPUTS_CONFIG,
    },
    {
      component: async () =>
        (await import('../features/components/checkbox/checkbox.component'))
          .CheckboxComponent,

      id: '7',
      name: ComponentTypeNames.Checkbox,
      inputs: this.COMPONENT_REQUIRED_INPUTS_CONFIG,
    },
  ];

  private inputTypes: InputTypes[] = Object.values(InputTypes);

  getComponents(): Observable<any[]> {
    return of(this.components).pipe(delay(1));
  }
  getComponentTypes(): Observable<IComponentType[]> {
    return of(this.componentTypes).pipe(delay(1));
  }

  submitForm(value: any) {
    console.log(value);
  }

  getInputTypes(): Observable<string[]> {
    return of(this.inputTypes).pipe(delay(1));
  }
}
