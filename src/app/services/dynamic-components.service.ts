import { inject, Injectable } from '@angular/core';
import clone from 'just-clone';
import { delay, map, Observable, of } from 'rxjs';
import { ComponentTypeNames, DynamicComponentConfig, InputTypes } from '../features/models/dynamic-component-config';
import { LocalStorageService } from "./local-storage.service";


const exampleComponents: DynamicComponentConfig[] = [
  {
    id: '1',
    name: ComponentTypeNames.Input,
    index: '0',
    columnId: '0',
    inputs: {
      type: InputTypes.Text,
      controlName: 'first_name',
      label: 'First Name',
      placeholder: 'Enter your first name',
      required: true,
      minLength: 2,
      readonly: false,
      autocomplete: 'on',
    },
  },
  {
    id: '2',
    name: ComponentTypeNames.Input,
    index: '1',
    columnId: '1',
    inputs: {
      type: InputTypes.Text,
      controlName: 'last_name',
      label: 'Last Name',
      placeholder: 'Enter your last name',
      required: true,
      minLength: 1,
      readonly: false,
      autocomplete: 'on',
    },
  },
  {
    id: '3',
    name: ComponentTypeNames.Input,
    index: '2',
    columnId: '2',
    inputs: {
      type: InputTypes.Text,
      controlName: 'place_of_birth',
      label: 'Place of Birth',
      placeholder: 'Enter your place of birth',
      required: true,
      minLength: 1,
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
      controlName: 'age',
      label: 'Age',
      min: 0,
      max: 50,
      placeholder: 'Enter your age',
      required: true,
      autocomplete: 'on',
    }
  }
];


const inputTypes: InputTypes[] = [...Object.values(InputTypes)];

@Injectable({
  providedIn: 'root',
})
export class DynamicComponentsService {
  private localStorageService = inject(LocalStorageService);

  getComponents(): Observable<DynamicComponentConfig[]> {
    return this.localStorageService.get().pipe(
      map((form: any) => Array.isArray(form) ? (form as DynamicComponentConfig[]) : [...exampleComponents as DynamicComponentConfig[]]),
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
