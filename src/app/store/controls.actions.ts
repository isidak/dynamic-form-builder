import { createActionGroup, props } from '@ngrx/store';
import { ControlConfig } from '../features/dynamic-control/control-config';


export const ControlsActions = createActionGroup({
  source: 'Controls',
  events: {
    'Set Controls': props<{ controls: ControlConfig[] }>(),
    'Add Control': props<{ control: ControlConfig }>(),
    'Remove Control': props<{ controlId: string }>(),
    'Edit Control': props<{ controlId: string, editedControl: ControlConfig }>(),
    'Select Control': props<{ controlId: string, selectedControl: ControlConfig }>(),
  },
});

export const ControlsApiActions = createActionGroup({
  source: 'Controls API',
  events: {
    'Retrieved Controls List': props<{ controls: ReadonlyArray<ControlConfig> }>(),
  },
});