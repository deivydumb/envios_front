import { TestBed } from '@angular/core/testing';

import { ConveyorService } from '../conveyor/conveyor.service';

describe('ConveyorService', () => {
  let service: ConveyorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConveyorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
