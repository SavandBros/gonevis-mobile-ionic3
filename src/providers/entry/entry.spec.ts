import {AuthServiceProvider} from "../auth-service/auth-service";
import {BaseRequestOptions} from "@angular/http";
import {inject, TestBed} from "@angular/core/testing";
import {MockBackend} from "@angular/http/testing";
import {AuthServiceProviderMock} from "../../../test-config/mocks-ionic";
import {JwtInterceptorProvider} from "../jwt-interceptor/jwt-interceptor";
import {EntryProvider} from "./entry";


describe("Testing EntryProvider", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EntryProvider,
        MockBackend,
        BaseRequestOptions,
        {
          provide: JwtInterceptorProvider,
          useFactory: (backend: MockBackend, options: BaseRequestOptions) => new JwtInterceptorProvider(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        },
        {provide: AuthServiceProvider, useClass: AuthServiceProviderMock}
      ]
    });
  });

  it('should ...', inject([EntryProvider], (service: EntryProvider) => {
    expect(service).toBeTruthy();
  }));

});
