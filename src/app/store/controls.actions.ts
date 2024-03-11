import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ControlConfig } from '../features/dynamic-control/control-config';
import { DynamicComponentConfig } from '../features/models/dynamic-component-config';
import { ComponentType } from '../features/models/component-type';

export const ControlsActions = createActionGroup({
  source: 'Controls',
  events: {
    'Set Controls': props<{ controls: ControlConfig[] }>(),
    'Add Control': props<{ control: ControlConfig }>(),
    'Remove Control': props<{ controlId: string }>(),
    'Edit Control': props<{
      controlId: string;
      editedControl: ControlConfig;
    }>(),
    'Select Control': props<{
      controlId: string;
      selectedControl: ControlConfig;
    }>(),
    'Clear Selected Control': emptyProps(),
    'Set Input Types': props<{ inputTypes: string[] }>(),
    'No Action': emptyProps(),
  },
});

// export const ControlsApiActions = createActionGroup({
//   source: 'Controls API',
//   events: {
//     'Retrieved Controls List': props<{ controls: ReadonlyArray<ControlConfig> }>(),
//   },

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
