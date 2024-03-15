import { ComponentImporterService } from './../services/component-importer.service';
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ComponentsAPIActions, InputTypesAPIActions } from './app.actions';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { DynamicComponentsService } from '../services/dynamic-components.service';

@Injectable()
export class AppEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private componentImporterService = inject(ComponentImporterService);
  private dynamicComponentsService = inject(DynamicComponentsService);

  loadComponentTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ComponentsAPIActions.loadComponentTypes),
      exhaustMap(() =>
        this.componentImporterService.getComponentTypes().pipe(
          map((componentTypes) =>
            ComponentsAPIActions.loadComponentTypesSuccess({ componentTypes })
          ),
          catchError((error) =>
            of(ComponentsAPIActions.loadComponentTypesFailure({ error }))
          )
        )
      )
    )
  );

  loadComponents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ComponentsAPIActions.loadComponents),
      exhaustMap(() =>
        this.dynamicComponentsService.getComponents().pipe(
          map((components) =>
            ComponentsAPIActions.loadComponentsSuccess({ components })
          ),
          catchError((error) =>
            of(ComponentsAPIActions.loadComponentsFailure({ error }))
          )
        )
      )
    )
  );

  loadInputTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InputTypesAPIActions.loadInputTypes),
      exhaustMap(() =>
        this.dynamicComponentsService.getInputTypes().pipe(
          map((inputTypes) =>
            InputTypesAPIActions.loadInputTypesSuccess({ inputTypes })
          ),
          catchError((error) =>
            of(InputTypesAPIActions.loadInputTypesFailure({ error }))
          )
        )
      )
    )
  );

  displayErrorAlert$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ComponentsAPIActions.loadComponentTypesFailure),
        tap(({ error }) => alert({ message: error }))
      ),
    { dispatch: false }
  );
}
