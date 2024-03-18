import {
  EntityAdapter,
  EntityState,
  createEntityAdapter
} from '@ngrx/entity';
import {
  createFeature,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';
import { ComponentsMap } from '../features/models/components-map';
import { DynamicComponentConfig } from '../features/models/dynamic-component-config';
import {
  ComponentsAPIActions,
  ComponentsActions,
  InputTypesAPIActions,
} from './app.actions';

interface InputTypesState {
  inputTypes: string[];
}

interface ComponentsState {
  components: EntityState<DynamicComponentConfig>;
  loading: boolean;
  componentTypes: ComponentsMap[] | null;
  selectedComponentId: string | null;
  sortKeys: number[];
}

const inputTypesInitialState: InputTypesState = {
  inputTypes: [],
};


// const sortComparer: Comparer<DynamicComponentConfig> = (c1, c2) =>
//   c1.index?.localeCompare(c2.index || '') || 999;


const adapter: EntityAdapter<DynamicComponentConfig> =
  createEntityAdapter<DynamicComponentConfig>();

const componentsInitialState: ComponentsState = {
  components: adapter.getInitialState({}),
  loading: false,
  componentTypes: [],
  selectedComponentId: null,
  sortKeys: [],
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
    // on(ComponentsActions.sortComponents, (state, { prevIndex, currIndex }) => {
    //   return {
    //     ...state,
    //     sortKeys: move(state.sortKeys, prevIndex, currIndex),
    //   };
    // }),
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
      selectedComponentId: null,
    }))
  ),
  extraSelectors: ({
    selectComponents,
    selectSelectedComponentId,
    selectSortKeys,
  }) => ({
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

export const selectFilteredValues = createSelector(
  componentsFeature.selectAll,
  (components) => (components.length > 0 ? components : false)
);

export const selectSortedComponents = createSelector(
  componentsFeature.selectSortKeys,
  selectFilteredValues,
  (sortKeys, components) => {
    if (!components) return [];
    return components;

    // if (sortKeys.length === 0) return components;
    // return sortKeys.map((key) => components[key]);
  }
);

// function move(arr: any[], previous: number, currentIndex: number): any[] {
//   arr = [...arr];
//   while (previous < 0) {
//     previous += arr.length;
//   }
//   while (currentIndex < 0) {
//     currentIndex += arr.length;
//   }
//   if (currentIndex >= arr.length) {
//     let k = currentIndex - arr.length;
//     while (k-- + 1) {
//       arr.push(k);
//     }
//   }
//   arr.splice(currentIndex, 0, arr.splice(previous, 1)[0]);
//   return arr;
// }
