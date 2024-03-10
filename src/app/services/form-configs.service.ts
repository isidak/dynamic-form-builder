import { Injectable, Input } from '@angular/core';
import { Observable, combineLatest, delay, of } from 'rxjs';
import { ControlConfig } from '../features/dynamic-control/control-config';
import { InputComponent } from '../features/components/input/input.component';

@Injectable({
  providedIn: 'root',
})
export class FormConfigsService {
  private components: any[] = [
    {
      component: async () =>
        (await import('../features/components/input/input.component'))
          .InputComponent,

      id: '1',
      name: 'input',
      inputs: {
        type: 'text',
        controlName: 'first_name',
        label: 'First Name',
        placeholder: 'Enter your first name',
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
      name: 'input',
      inputs: {
        type: 'text',
        controlName: 'last_name',
        label: 'Last Name',
        placeholder: 'Enter your last name',
        required: true,
        minLength: 3,
        readonly: false,
        autocomplete: 'off',
      },
    },
  ];
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
    // {
    //   id: '2',
    //   name: 'last_name',
    //   label: 'Last Name',
    //   type: 'text',
    //   placeholder: 'Enter your last name',
    // },
    // {
    //   id: '3',
    //   name: 'email',
    //   label: 'Email',
    //   type: 'text',
    //   placeholder: 'Enter your email',
    // },
    // {
    //   id: '4',
    //   name: 'phone',
    //   label: 'Phone',
    //   type: 'number',

    //   placeholder: 'Enter your phone number',
    // },
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

  getComponents(): Observable<any[]> {
    return of(this.components).pipe(delay(1));
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
