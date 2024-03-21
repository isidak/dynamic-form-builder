import { inject, Injectable } from '@angular/core';
import { StorageMap } from "@ngx-pwa/local-storage";
import { switchMap, take } from "rxjs";
import { Store } from "@ngrx/store";
import { selectSortedComponents } from "../store/app.state";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private storage = inject(StorageMap);
  private store = inject(Store);
  private storageKey = 'form';

  saveToLocalStorage() {
    this.store.select(selectSortedComponents).pipe(
      take(1),
      switchMap((components) =>
        this.storage.set(this.storageKey, components))
    ).subscribe();
  }

  set( value: any) {
    return this.storage.set(this.storageKey, value);
  }

  get() {
    return this.storage.get(this.storageKey);
  }

  delete() {
    return this.storage.delete(this.storageKey).pipe(take(1)).subscribe();
  }

}
