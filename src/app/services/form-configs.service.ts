import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { ComponentType } from '../features/models/component-type';
import { DynamicComponentConfig } from '../features/models/dynamic-component-config';

@Injectable({
  providedIn: 'root',
})
export class FormConfigsService {
  private componentTypes: ComponentType[] = [
    {
      name: 'input',
      component: async () =>
        (await import('../features/components/input/input.component'))
          .InputComponent,
    },
    {
      name: 'select',
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
      name: 'checkbox',
      component: async () =>
        (await import('../features/components/checkbox/checkbox.component'))
          .CheckboxComponent,
    },
    {
      name: 'textarea',
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
      name: 'file',
      component: async () =>
        (await import('../features/components/file-input/file-input.component')).FileInputComponent,
    }, 
    {
      name: 'button',
      component: async () =>
        (await import('../features/components/button/button.component')).ButtonComponent,
    }
    
  ];

  private components: DynamicComponentConfig[] = [
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
