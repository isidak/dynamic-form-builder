import { Injectable } from '@angular/core';
import memo from 'memo-decorator';
import { delay, from, map, mergeMap, Observable, of, shareReplay } from 'rxjs';
import { ComponentsMap } from '../features/models/components-map';
import { ComponentTypeNames, DynamicComponentConfig } from '../features/models/dynamic-component-config';

@Injectable({
  providedIn: 'root',
})
export class ComponentImporterService {
  getComponentTypes(): Observable<ComponentsMap[]> {
    return of(this.componentsMap).pipe(delay(1), shareReplay(1));
  }

  @memo()
 mapComponent(name: string) {
    return this.componentsMap.find((type) => type.name === name)?.component;
  }


 importComponentByName(name: string) {
    return this.getComponentTypes().pipe(
      mergeMap((types) => {
        if (!types) return of(null);
        const componentType = this.mapComponent(name);
        if (!componentType) return of(null);
        const component = componentType();
        return from(component);
      })
    );
  }

  getImportedComponent(config: DynamicComponentConfig) {
    return this.importComponentByName(config.name).pipe(
      map((component) => {
        return {
          ...config,
          component,
        };
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
