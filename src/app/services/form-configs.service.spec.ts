import { TestBed } from '@angular/core/testing';

import { FormConfigsService } from './form-configs.service';

describe('FormConfigsService', () => {
  let service: FormConfigsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormConfigsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
