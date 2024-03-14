import { createFeature, createReducer, createSelector, on, select } from '@ngrx/store';
import { ComponentType } from '../features/models/component-type';
import { DynamicComponentConfig } from '../features/models/dynamic-component-config';
import { ComponentsActions, ControlsActions } from './controls.actions';
import { Comparer, EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';

export interface State extends EntityState<DynamicComponentConfig> {
  loading: boolean;
  inputTypes: string[];
  componentTypes: ComponentType[] | null;
  selectedComponentId: string | null,
}

const sortComparer: Comparer<DynamicComponentConfig> = (c1, c2) => c1.id.localeCompare(c2.id);

const adapter: EntityAdapter<DynamicComponentConfig> =
  createEntityAdapter<DynamicComponentConfig>({sortComparer});

export const initialState: State = adapter.getInitialState({
  loading: false,
  inputTypes: [],
  componentTypes: [],
 
  selectedComponentId: null,
});

export const enum StateFeatures {
  Controls = 'controls',
  Components = 'components',
}

export const controlsFeature = createFeature({
  name: StateFeatures.Controls,
  reducer: createReducer(
    initialState,
    on(ControlsActions.setInputTypes, (state, { inputTypes }) => ({
      ...state,
      inputTypes,
    }))
  ),
});

export const componentsFeature = createFeature({
  name: StateFeatures.Components,
  reducer: createReducer(
    initialState,
    on(ComponentsActions.setComponents, (state, { components }) => {
      return adapter.setAll(components, state);
    }),
    on(ComponentsActions.setComponentTypes, (state, { componentTypes }) => ({
      ...state,
      componentTypes,
    })),
    on(ComponentsActions.addComponent, (state, { component }) => {
      return adapter.addOne(component, state);
    }),
    on(ComponentsActions.removeComponent, (state, { id: componentId }) => {
      return adapter.removeOne(componentId, state);
    }),
    on(ComponentsActions.editComponent, (state, { editedComponent }) => {
      return adapter.updateOne(
        { id: editedComponent.id, changes: editedComponent },
        state
      );
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
  extraSelectors: ({ selectComponentsState, selectEntities, selectSelectedComponentId }) => ({
    ...adapter.getSelectors(selectComponentsState),
  
  selectIsComponentSelected: createSelector(
    selectSelectedComponentId,
    (selectedId) => selectedId !== null
  ),
  selectSelectedComponent: createSelector(
    selectSelectedComponentId,
    selectEntities,
    (selectedId, entities ) => (selectedId ? entities[selectedId] : null)
  ),
}),
});
