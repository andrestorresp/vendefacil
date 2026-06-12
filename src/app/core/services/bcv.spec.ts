import { TestBed } from '@angular/core/testing';

import { Bcv } from './bcv';

describe('Bcv', () => {
  let service: Bcv;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Bcv);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
