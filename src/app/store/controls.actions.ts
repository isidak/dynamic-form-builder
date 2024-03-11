import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ControlConfig } from '../features/dynamic-control/control-config';

export const ControlsActions = createActionGroup({
  source: 'Controls',
  events: {
    'Set Controls': props<{ controls: ControlConfig[] }>(),
    'Add Control': props<{ control: ControlConfig }>(),
    'Remove Control': props<{ id: string }>(),
    'Edit Control': props<{ editedControl: ControlConfig }>(),
    'Select Control': props<{ id: string}>(),
    'Clear Selected Control': emptyProps(),
    'Set Input Types': props<{ inputTypes: string[] }>(),
    'No Action': emptyProps(),
  },
});
