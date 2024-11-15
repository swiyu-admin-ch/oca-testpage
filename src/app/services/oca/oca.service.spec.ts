import { TestBed } from '@angular/core/testing';

import { OCAService } from './oca.service';

describe('OcaService', () => {
  let service: OCAService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OCAService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
