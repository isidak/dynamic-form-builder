import {
  Comparer,
  EntityAdapter,
  EntityState,
  createEntityAdapter,
} from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { ComponentType } from '../features/models/component-type';
import { DynamicComponentConfig } from '../features/models/dynamic-component-config';
import { ComponentsActions, ControlsActions } from './app.actions';

interface ControlTypesState {
  inputTypes: string[];
}

interface ComponentsState {
  components: EntityState<DynamicComponentConfig>;
  loading: boolean;
  componentTypes: ComponentType[] | null;
  selectedComponentId: string | null;
}

const controlTypesInitialState: ControlTypesState = {
  inputTypes: [],
};

const sortComparer: Comparer<DynamicComponentConfig> = (c1, c2) =>
  c1.id.localeCompare(c2.id);

const adapter: EntityAdapter<DynamicComponentConfig> =
  createEntityAdapter<DynamicComponentConfig>({ sortComparer });

const componentsInitialState: ComponentsState = {
  components: adapter.getInitialState(),
  loading: false,
  componentTypes: [],
  selectedComponentId: null,
};

const enum StateFeatures {
  Controls = 'controls',
  Components = 'components',
}

export const controlsFeature = createFeature({
  name: StateFeatures.Controls,
  reducer: createReducer(
    controlTypesInitialState,
    on(ControlsActions.setInputTypes, (state, { inputTypes }) => ({
      ...state,
      inputTypes,
    }))
  ),
});

export const componentsFeature = createFeature({
  name: StateFeatures.Components,
  reducer: createReducer(
    componentsInitialState,
    on(ComponentsActions.setComponents, (state, { components }) => {
      return {
        ...state,
        components: adapter.setAll(components, state.components),
      };
    }),
    on(ComponentsActions.setComponentTypes, (state, { componentTypes }) => ({
      ...state,
      componentTypes,
    })),
    on(ComponentsActions.addComponent, (state, { component }) => {
      return {
        ...state,
        components: adapter.addOne(component, state.components),
      };
    }),
    on(ComponentsActions.removeComponent, (state, { id: componentId }) => {
      return {
        ...state,
        components: adapter.removeOne(componentId, state.components),
      };
    }),
    on(ComponentsActions.editComponent, (state, { editedComponent }) => {
      return {
        ...state,
        components: adapter.updateOne(
          { id: editedComponent.id, changes: editedComponent },
          state.components
        ),
      };
    }),
    on(ComponentsActions.selectComponent, (state, { id }) => ({
      ...state,
      selectedComponentId: id,
    })),
    on(ComponentsActions.clearSelectedComponent, (state) => ({
      ...state,
      selectedComponent: null,
    }))
  ),
  extraSelectors: ({ selectComponents, selectSelectedComponentId }) => ({
    ...adapter.getSelectors(selectComponents),

    selectIsComponentSelected: createSelector(
      selectSelectedComponentId,
      (selectedId) => selectedId !== null
    ),
    selectSelectedComponent: createSelector(
      selectSelectedComponentId,
      selectComponents,
      (selectedId, components) =>
        selectedId ? components.entities[selectedId] : null
    ),
  }),
});
