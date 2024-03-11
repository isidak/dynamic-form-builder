import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ComponentType } from '../features/models/component-type';
import { DynamicComponentConfig } from '../features/models/dynamic-component-config';

export const ControlsActions = createActionGroup({
  source: 'Controls',
  events: {
    'Set Input Types': props<{ inputTypes: string[] }>(),
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
