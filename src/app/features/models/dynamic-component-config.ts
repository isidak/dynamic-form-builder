import { Validators } from "@angular/forms";

export interface DynamicComponentConfig {
    component: () => Promise<any>;
    importedCmp?: any;
    id: string;
    name: string;
    inputs: BaseInput;
}

export interface BaseInput {
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
    validators?: ControlValidators[];
}

export interface ControlValidators {
    name: string,
    validator: Validators,
    message: string
}

export interface Option {
    value: string;
    label: string;
}