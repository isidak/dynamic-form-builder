import { Injectable } from '@angular/core';
import { ControlConfig } from '../features/dynamic-control/control-config';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormConfigsService {
  private _formConfigs = new BehaviorSubject<ControlConfig[]>([]);
  formConfigs$ = this._formConfigs.asObservable();

  addForm(value: any) {
    this._formConfigs.next([...this._formConfigs.getValue(), value]);
  }

  submitForm(value: any) {
    console.log(value);
  }
}
