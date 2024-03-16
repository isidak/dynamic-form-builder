
export interface DynamicComponentConfig {
    component: any;
    importedCmp?: any;
    id: string;
    name: string;
    inputs: BaseInput | Record<string, unknown>;
}

export interface BaseInput {
  [key: string]: any;
  controlName: string | number;
  type: string;
  label: string;
  placeholder?: string;
  options?: Option[];
  readonly?: boolean;
  autocomplete?: string;
  required?: boolean;
  minLength?: number;
  min?: number;
  max?: number;
  // validators?: ControlValidators[];
}

export interface Option {
    value: string;
    label: string;
}

// export enum ControlValidators {
//     Required = 'required',
//     MinLength = 'minLength',
//     MaxLength = 'maxLength',
//     Pattern = 'pattern',
//   }
  
  
  export enum ComponentTypeNames {
    Input = 'input',
    Select = 'select',
    Checkbox = 'checkbox',
    Radio = 'radio',
    Textarea = 'textarea',
    File = 'file',
  }
  
  export enum InputTypes {
    Text = 'text',
    Number = 'number',
    Email = 'email',
    Password = 'password',
    Date = 'date',
    Time = 'time',
    File = 'file',
    Textarea = 'textarea',
    Checkbox = 'checkbox',
  }
  
//   export enum ComponentInputNames {
//       ControlName = 'controlName',
//       Type = 'type',
//       Label = 'label',
//       Placeholder = 'placeholder',
//       Options = 'options',
//       Readonly = 'readonly',
//       Autocomplete = 'autocomplete',
//       Min = 'min',
//       Max = 'max',
//       Validators = 'validators',
//     }
    
    // export enum ComponentInputFeatures {
    //   Readonly = 'readonly',
    //   Autocompolete = 'autocomplete',
    //   Min = 'min',
    //   Max = 'max',
    // }