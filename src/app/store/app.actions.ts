import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ComponentType } from '../features/models/component-type';
import { DynamicComponentConfig } from '../features/models/dynamic-component-config';

export const InputTypesActions = createActionGroup({
  source: 'InputTypes',
  events: {
    'Set Input Types': props<{ inputTypes: string[] }>(),
  },
});

export const InputTypesAPIActions = createActionGroup({
  source: 'InputTypesAPI',
  events: {
    'Load Input Types': emptyProps(),
    'Load Input Types Success': props<{ inputTypes: string[] }>(),
    'Load Input Types Failure': props<{ error: string }>(),
  },
});

export const ComponentsActions = createActionGroup({
  source: 'Components',
  events: {
    'Set Components': props<{ components: DynamicComponentConfig[] }>(),
    'Set Component Types': props<{ componentTypes: ComponentType[] }>(),
    'Add Component': props<{ component: DynamicComponentConfig }>(),
    'Remove Component': props<{ id: string }>(),
    'Edit Component': props<{
      editedComponent: DynamicComponentConfig;
    }>(),
    'Select Component': props<{ id: string }>(),
    'Clear Selected Component': emptyProps(),
  },
});

export const ComponentsAPIActions = createActionGroup({
  source: 'ComponentsAPI',
  events: {
    'Load Component Types': emptyProps(),
    'Load Component Types Success': props<{
      componentTypes: ComponentType[];
    }>(),
    'Load Component Types Failure': props<{ error: string }>(),
    'Load Components': emptyProps(),
    'Load Components Success': props<{
      components: DynamicComponentConfig[];
    }>(),
    'Load Components Failure': props<{ error: string }>(),
  },
});
