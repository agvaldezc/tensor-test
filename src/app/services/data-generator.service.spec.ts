import { TestBed, inject } from '@angular/core/testing';

import { DataGeneratorService } from './data-generator.service';

describe('DataGeneratorServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataGeneratorService]
    });
  });

  it('should be created', inject([DataGeneratorService], (service: DataGeneratorService) => {
    expect(service).toBeTruthy();
  }));
});
