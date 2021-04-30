import { TestBed } from '@angular/core/testing';

import { MyEasyJobSvcService } from './my-easy-job-svc.service';

describe('MyEasyJobSvcService', () => {
  let service: MyEasyJobSvcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyEasyJobSvcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
