import { TestBed } from '@angular/core/testing';

import { FunctionsApiService } from './functions-api.service';

describe('FunctionsApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FunctionsApiService = TestBed.get(FunctionsApiService);
    expect(service).toBeTruthy();
  });
});
