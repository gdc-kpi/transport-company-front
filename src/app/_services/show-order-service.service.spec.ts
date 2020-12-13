import { TestBed } from '@angular/core/testing';

import { ShowOrderServiceService } from './show-order-service.service';

describe('ShowOrderServiceService', () => {
  let service: ShowOrderServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowOrderServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
