import { Injectable, inject } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';

@Injectable()
export class ControlsEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
}
