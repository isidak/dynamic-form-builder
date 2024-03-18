import {
  Comparer,
  EntityAdapter,
  EntityState,
  createEntityAdapter,
} from '@ngrx/entity';
import {
  createFeature,
  createReducer,
  createSelector,
  on,
  select,
} from '@ngrx/store';
import { filter, pipe } from 'rxjs';
import { ComponentsMap } from '../features/models/components-map';
import { DynamicComponentConfig } from '../features/models/dynamic-component-config';
import {
  ComponentsAPIActions,
  ComponentsActions,
  InputTypesAPIActions
} from './app.actions';

interface InputTypesState {
  inputTypes: string[];
}

interface ComponentsState {
  components: EntityState<DynamicComponentConfig>;
  loading: boolean;
  componentTypes: ComponentsMap[] | null;
  selectedComponentId: string | null;
}

const inputTypesInitialState: InputTypesState = {
  inputTypes: [],
};

const sortComparer: Comparer<DynamicComponentConfig> = (c1: any, c2: any) =>
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
  Inputs = 'inputs',
  Components = 'components',
}

export const inputsFeature = createFeature({
  name: StateFeatures.Inputs,
  reducer: createReducer(
    inputTypesInitialState,
    on(InputTypesAPIActions.loadInputTypesSuccess, (state, { inputTypes }) => ({
      ...state,
      inputTypes,
    }))
  ),
});

export const componentsFeature = createFeature({
  name: StateFeatures.Components,
  reducer: createReducer(
    componentsInitialState,
    on(ComponentsAPIActions.loadComponentsSuccess, (state, { components }) => {
      return {
        ...state,
        components: adapter.setAll(components, state.components),
      };
    }),
    on(
      ComponentsAPIActions.loadComponentTypesSuccess,
      (state, { componentTypes }) => ({
        ...state,
        componentTypes,
      })
    ),
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

export const appPageViewModel = createSelector(
  inputsFeature.selectInputTypes,
  componentsFeature.selectAll,
  componentsFeature.selectComponentTypes,
  (inputTypes, all, componentTypes) => ({
    inputTypes,
    all,
    componentTypes,
  })
);

export const selectFilteredValues = pipe(
  select(componentsFeature.selectAll),
  filter((val) => val.length > 0)
);
