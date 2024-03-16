import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  map,
  withLatestFrom
} from 'rxjs';
import { ControlsActions } from './controls.actions';
import { controlsFeature } from './controls.state';

@Injectable()
export class ControlsEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);

  clearSelectedControl$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ControlsActions.removeControl),
      withLatestFrom(this.store.select(controlsFeature.selectSelectedControl)),
      map(([action, selectedControl]) =>
        selectedControl?.id === action.id
          ? ControlsActions.clearSelectedControl()
          : ControlsActions.noAction()
      )
    )
  );
}
