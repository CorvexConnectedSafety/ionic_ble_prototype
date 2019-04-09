import { TestBed } from '@angular/core/testing';

import { WorktempService } from './worktemp.service';

describe('WorktempService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorktempService = TestBed.get(WorktempService);
    expect(service).toBeTruthy();
  });
});
