import { Injectable } from '@angular/core';
import memo from 'memo-decorator';
import { ComponentsMap } from '../features/models/components-map';
import {
  ComponentTypeNames,
  DynamicComponentConfig,
} from '../features/models/dynamic-component-config';
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
  withLatestFrom,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComponentImporterService {
  getComponentTypes(): Observable<ComponentsMap[]> {
    return of(this.componentsMap).pipe(delay(1), shareReplay(1));
  }

  @memo()
  async importComponent(component: () => Promise<any>) {
    console.log('memoising', component);

    return await component();
  }

  @memo()
  importComponentByName(name: string) {
    console.log('memoising', name);

    // return of().pipe(withLatestFrom(this.getComponentTypes(),
    //  mergeMap(
    //   async (types) => from(await types.find((type) => type.name === name)?.component()))
    //   ));
  }

  @memo()
  getImportedComponent(name: string) {
    console.log('importing', name);
    return this.getComponentTypes().pipe(
      mergeMap((types) => {
        if (!types) return of(null);
        const componentType = types.find((type) => type.name === name);
        const component = componentType!.component();
        return from(component);
      })
    );
  }

  private componentsMap: ComponentsMap[] = [
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
