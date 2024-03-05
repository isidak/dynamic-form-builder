
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { ControlConfig } from '../features/dynamic-control/control-config';
import { ControlsActions } from './controls.actions';

interface State {
  controls: ControlConfig[];
  loading: boolean;
  selectedControl: ControlConfig | null;
}

export const initialState: State = {
  controls: [],
  loading: false,
  selectedControl: null,
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
      controls: state.controls.filter((control) => control.name !== controlId),
    })),
    on(ControlsActions.editControl, (state, { controlId, editedControl }) => ({
      ...state,
      controls: state.controls.map((control) => {
        if (control.name === controlId) return editedControl;
        return control;
      }),
    })),

    on(
      ControlsActions.selectControl,
      (state, { controlId, selectedControl }) => ({
        ...state,
        selectedControl,
      })
    )
  ),
  extraSelectors: ({selectControls}) => ({
    selectControlByName: (name: string) =>  createSelector(
      selectControls,
      (state) => state.find((control) => control.name === name)
    ),
})  
});
