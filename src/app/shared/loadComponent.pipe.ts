import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appLoadComponent',
  standalone: true,
})
export class LoadComponentPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return value;
  }

}
