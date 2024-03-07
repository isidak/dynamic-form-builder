import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
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
    on(ControlsActions.removeControl, (state, { controlId }) => ({
      ...state,
      controls: state.controls.filter((control) => control.id !== controlId),
    })),
    on(ControlsActions.editControl, (state, { controlId, editedControl }) => ({
      ...state,
      controls: state.controls.map((control) => {
        if (control.id === controlId) return editedControl;
        return control;
      }),
    })),

    on(
      ControlsActions.selectControl,
      (state, { controlId, selectedControl }) => ({
        ...state,
        selectedControl,
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
  ),
  extraSelectors: ({ selectControls }) => ({
    selectControlByName: (name: string) =>
      createSelector(selectControls, (state) =>
        state.find((control) => control.name === name)
      ),
  }),
});
