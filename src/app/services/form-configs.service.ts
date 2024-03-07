import { Injectable } from '@angular/core';
import {
  Observable,
  combineLatest,
  delay,
  of
} from 'rxjs';
import { ControlConfig } from '../features/dynamic-control/control-config';

@Injectable({
  providedIn: 'root',
})
export class FormConfigsService {
  private configs: ControlConfig[] = [
    {
      id: '1',
      name: 'first_name',
      label: 'First Name',
      type: 'text',
      placeholder: 'Enter your first name',
    },
    {
      id: '2',
      name: 'last_name',
      label: 'Last Name',
      type: 'text',
      placeholder: 'Enter your last name',
    },
    {
      id: '3',
      name: 'email',
      label: 'Email',
      type: 'text',
      placeholder: 'Enter your email',
    },
    {
      id: '4',
      name: 'phone',
      label: 'Phone',
      type: 'number',

      placeholder: 'Enter your phone number',
    },
  ];

  private inputTypes = [
    'text',
    'number',
    'email',
    'password',
    'date',
    'time',
    'file',
    'textarea',
  ];

  getConfigs(): Observable<[ControlConfig[], string[]]> {
    return combineLatest([this.getControlConfigs(), this.getInputTypes()]);
  }

  submitForm(value: any) {
    console.log(value);
  }

  private getControlConfigs(): Observable<ControlConfig[]> {
    return of(this.configs).pipe(delay(1));
  }

  private getInputTypes(): Observable<string[]> {
    return of(this.inputTypes).pipe(delay(1));
  }
}
