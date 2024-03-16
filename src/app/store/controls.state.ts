import { createFeature, createReducer, on } from '@ngrx/store';
import { ControlConfig } from '../features/dynamic-control/control-config';
import { ControlsActions } from './controls.actions';

interface State {
  controls: ControlConfig[];
  loading: boolean;
  selectedControl: ControlConfig | null;
  inputTypes: string[];
}

export const initialState: State = {
  controls: [],
  loading: false,
  selectedControl: null,
  inputTypes: [],
};

export const controlsFeature = createFeature({
  name: 'controls',
  reducer: createReducer(
    initialState,
    on(ControlsActions.setControls, (state, { controls }) => ({
      ...state,
      controls: [...controls],
    })),
    on(ControlsActions.addControl, (state, { control }) => ({
      ...state,
      controls: [...state.controls, control],
    })),
    on(ControlsActions.removeControl, (state, { id }) => ({
      ...state,
      controls: state.controls.filter((control) => control.id !== id),
    })),
    on(
      ControlsActions.editControl,
      (state, { editedControl }) => ({
        ...state,
        controls: state.controls.map((control) => {
          if (control.id === editedControl.id) return editedControl;
          return control;
        }),
      })
    ),
    on(
      ControlsActions.selectControl,
      (state, { id }) => ({
        ...state,
        selectedControl: (state.controls.find((control) => control.id === id)) || null,
      })
    ),
    on(ControlsActions.clearSelectedControl, (state) => ({
      ...state,
      selectedControl: null,
    })),
    on(ControlsActions.setInputTypes, (state, { inputTypes }) => ({
      ...state,
      inputTypes,
    }))
  )
});
