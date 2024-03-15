import { Injectable } from '@angular/core';
import memo from 'memo-decorator';
import { ComponentType } from '../features/models/component-type';
import { ComponentTypeNames } from '../features/models/dynamic-component-config';
import {
  BehaviorSubject,
  Observable,
  delay,
  from,
  map,
  mergeMap,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComponentImporterService {

  getComponentTypes(): Observable<ComponentType[]> {
    return of(this.componentTypes).pipe(
      delay(1),
      shareReplay(1)
    );
  }

  @memo()
  async importComponent(component: any) {
    console.log('memoising', component.name);

    return await component();
  }

  getImportedComponent(name: string) {
    console.log('importing', name);
    return this.getComponentTypes().pipe(
      mergeMap((componentTypes) => {
        const component = componentTypes.find(
          (x) => x.name === name
        )?.component;

        if (!component) throw new Error('Component not found');

        return from(this.importComponent(component));
      })
    );
  }

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
}
