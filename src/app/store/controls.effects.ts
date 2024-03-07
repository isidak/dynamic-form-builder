import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  exhaustMap,
  map,
  catchError,
  EMPTY,
  withLatestFrom,
  from,
  tap,
  of,
} from 'rxjs';
import { controlsFeature } from './controls.state';
import { ControlsActions } from './controls.actions';
import { Store } from '@ngrx/store';

@Injectable()
export class ControlsEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);

clearSelectedControl$ = createEffect(() =>
    this.actions$.pipe(
        ofType(ControlsActions.removeControl),
        withLatestFrom(this.store.select(controlsFeature.selectSelectedControl)),
        map(([action, selectedControl]) =>
            selectedControl?.id === action.controlId
                ? ControlsActions.clearSelectedControl()
                : ControlsActions.noAction())
        )
    )
}
