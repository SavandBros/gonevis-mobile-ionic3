import {AuthServiceProvider} from "../auth-service/auth-service";
import {BaseRequestOptions} from "@angular/http";
import {inject, TestBed} from "@angular/core/testing";
import {MockBackend} from "@angular/http/testing";
import {AuthServiceProviderMock} from "../../../test-config/mocks-ionic";
import {JwtInterceptorProvider} from "../jwt-interceptor/jwt-interceptor";
import {EntryProvider} from "./entry";
import {Entry} from "../../models/entry";


describe("Testing EntryProvider", () => {
  let mockBackend: MockBackend;
  let entryService: EntryProvider;

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

  beforeEach(inject([MockBackend, JwtInterceptorProvider, AuthServiceProvider],
    (mb: MockBackend, http: JwtInterceptorProvider, authService: AuthServiceProvider) => {
      mockBackend = mb;
      entryService = new EntryProvider(http, authService);
    }));

  it('should ...', inject([EntryProvider], (service: EntryProvider) => {
    expect(service).toBeTruthy();
  }));

  it("should have correct default class attributes", () => {
    expect(entryService.modelClass).toBe(Entry);
    expect(entryService.apiEndPoint).toEqual("website/entry/{{site}}/");
    expect(entryService.apiEndPointList).toEqual("website/entry/");
  });

});
