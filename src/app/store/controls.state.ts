import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { ControlConfig } from '../features/dynamic-control/control-config';
import { ComponentsActions, ControlsActions } from './controls.actions';
import { DynamicComponentConfig } from '../features/models/dynamic-component-config';
import { ComponentType } from '../features/models/component-type';

interface State {
  controls: ControlConfig[];
  loading: boolean;
  selectedControl: ControlConfig | null;
  inputTypes: string[];
  components: any[];
  componentTypes: ComponentType[] | null;
  selectedComponent: DynamicComponentConfig | null;
}

export const initialState: State = {
  controls: [],
  loading: false,
  selectedControl: null,
  inputTypes: [],
  components: [],
  componentTypes: [],
  selectedComponent: null
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

export const componentsFeature = createFeature({
  name: 'components',
  reducer: createReducer(
    initialState,
    on(ComponentsActions.setComponents, (state, { components }) => ({
      ...state,
      components: [...components],
    })),
    on(ComponentsActions.setComponentTypes, (state, { componentTypes }) => ({
      ...state,
      componentTypes,
    })),
    on(ComponentsActions.addComponent, (state, { component }) => ({
      ...state,
      components: [...state.components, component],
    })),
    on(ComponentsActions.removeComponent, (state, { componentId }) => ({
      ...state,
      components: state.components.filter((component) => component.id !== componentId),
    })),
    on(ComponentsActions.editComponent, (state, { componentId, editedComponent }) => ({
      ...state,
      components: state.components.map((component) => {
        if (component.id === componentId) return editedComponent;
        return component;
      }),
    })),
    on(ComponentsActions.selectComponent, (state, { id }) => ({
      ...state,
      selectedComponent: state.components.find((component) => component.id === id),
    })),
    on(ComponentsActions.noAction, (state) => state)
  ),
  extraSelectors: ({ selectComponents }) => ({
    selectComponentById: (id: string) =>
      createSelector(selectComponents, (state) =>
        state.find((component) => component.id === id)
      ),
  }),
});
