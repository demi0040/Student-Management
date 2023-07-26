import { TestBed } from '@angular/core/testing';

import { ApolloService } from './login.service';

describe('ApolloService', () => {
  let service: ApolloService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApolloService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
