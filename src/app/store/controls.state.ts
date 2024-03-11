import { createFeature, createReducer, on } from '@ngrx/store';
import { ComponentType } from '../features/models/component-type';
import { DynamicComponentConfig } from '../features/models/dynamic-component-config';
import { ComponentsActions, ControlsActions } from './controls.actions';

interface State {
  loading: boolean;
  inputTypes: string[];
  components: any[];
  componentTypes: ComponentType[] | null;
  selectedComponent: DynamicComponentConfig | null;
}

export const initialState: State = {
  loading: false,
  inputTypes: [],
  components: [],
  componentTypes: [],
  selectedComponent: null,
};

export const controlsFeature = createFeature({
  name: 'controls',
  reducer: createReducer(
    initialState,
    on(ControlsActions.setInputTypes, (state, { inputTypes }) => ({
      ...state,
      inputTypes,
    }))
  ),
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
    on(ComponentsActions.removeComponent, (state, { id: componentId }) => ({
      ...state,
      components: state.components.filter(
        (component) => component.id !== componentId
      ),
    })),
    on(ComponentsActions.editComponent, (state, { editedComponent }) => ({
      ...state,
      components: state.components.map((component) => {
        if (component.id === editedComponent.id) return editedComponent;
        return component;
      }),
    })),
    on(ComponentsActions.selectComponent, (state, { id }) => ({
      ...state,
      selectedComponent: state.components.find(
        (component) => component.id === id
      ),
    })),
    on(ComponentsActions.clearSelectedComponent, (state) => ({
      ...state,
      selectedComponent: null,
    }))
  ),
});
