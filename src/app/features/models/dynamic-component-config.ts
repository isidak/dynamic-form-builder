import { Input } from '@angular/core';
import { Validators } from '@angular/forms';

export interface IComponentName {
  name: string;
  component: () => Promise<any>;
  inputs: IBaseInput;
}

export interface IComponentInputs {
  inputsList?: IComponentInput[];
}

interface IComponentInput {
  type: ComponentTypeNames;
  name: ComponentInputNames;
  options?: IOption[];
  features?: string[];
  validators?: Validators[];
}

export interface IComponentType extends IComponentName, IComponentInputs {
    id?: string;
}

export interface IDynamicComponentConfig extends IComponentType {
  importedCmp?: any;
  
}

export enum ComponentInputNames {
  ControlName = 'controlName',
  Type = 'type',
  Label = 'label',
  Placeholder = 'placeholder',
  Options = 'options',
  Readonly = 'readonly',
  Autocomplete = 'autocomplete',
  Min = 'min',
  Max = 'max',
  Validators = 'validators',
}

export enum ComponentInputFeatures {
  Readonly = 'readonly',
  Autocompolete = 'autocomplete',
  Min = 'min',
  Max = 'max',
}

export interface IBaseInput {
    [key: string]: unknown;
  'controlName': string | number;
  'type': InputTypes;
  'label': string;
  'placeholder'?: string;
  'options'?: IOption[];
  'readonly'?: boolean;
  'autocomplete'?: string;
  'required'?: boolean;
  'minLength'?: number;
  'min'?: number;
  'max'?: number;
  'validators'?: ControlValidators[];
}

export interface ISelectInput extends IBaseInput {
  options: IOption[];
}

export enum ControlValidators {
  Required = 'required',
  MinLength = 'minLength',
  MaxLength = 'maxLength',
  Pattern = 'pattern',
}

export interface IOption {
  value: string;
  label: string;
}

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
