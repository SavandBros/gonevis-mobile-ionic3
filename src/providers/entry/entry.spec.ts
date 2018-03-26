import {AuthProvider} from "../auth/auth-service";
import {BaseRequestOptions} from "@angular/http";
import {inject, TestBed} from "@angular/core/testing";
import {MockBackend} from "@angular/http/testing";
import {JwtInterceptorProvider} from "../jwt-interceptor/jwt-interceptor";
import {EntryProvider} from "./entry";
import {Entry} from "../../models/entry";
import {AuthServiceProviderMock} from "../../../test-config/mocks/gonevis/auth-mock";
import {Api} from "../api";


describe("Testing EntryProvider", () => {
  let mockBackend: MockBackend;
  let entryService: EntryProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EntryProvider,
        MockBackend,
        BaseRequestOptions,
        Api,
        {
          provide: JwtInterceptorProvider,
          useFactory: (backend: MockBackend, options: BaseRequestOptions) => new JwtInterceptorProvider(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        },
        {provide: AuthProvider, useClass: AuthServiceProviderMock}
      ]
    });
  });

  beforeEach(inject([MockBackend, JwtInterceptorProvider, AuthProvider, Api],
    (mb: MockBackend, http: JwtInterceptorProvider, authService: AuthProvider, api: Api) => {
      mockBackend = mb;
      entryService = new EntryProvider(http, authService, api);
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
