import { TestBed } from '@angular/core/testing';

import { CarbonMarketplaceService } from './carbon-marketplace.service';

describe('CarbonMarketplaceService', () => {
  let service: CarbonMarketplaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarbonMarketplaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
