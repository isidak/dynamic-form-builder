import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IDynamicComponentConfig, IComponentType } from '../features/models/dynamic-component-config';

export const ControlsActions = createActionGroup({
  source: 'Controls',
  events: {
    'Set Input Types': props<{ inputTypes: string[] }>(),
  },
});

export const ComponentsActions = createActionGroup({
  source: 'Components',
  events: {
    'Set Components': props<{ components: IDynamicComponentConfig[] }>(),
    'Set Component Types': props<{ componentTypes: IComponentType[] }>(),
    'Add Component': props<{ component: IDynamicComponentConfig }>(),
    'Remove Component': props<{ id: string }>(),
    'Edit Component': props<{
      editedComponent: IDynamicComponentConfig;
    }>(),
    'Select Component': props<{ id: string }>(),
    'Clear Selected Component': emptyProps(),
  },
});
