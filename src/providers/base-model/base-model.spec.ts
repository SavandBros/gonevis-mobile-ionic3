///<reference path="../../../node_modules/@types/jasmine/index.d.ts"/>
import {inject, TestBed} from '@angular/core/testing';
import {BaseModelProvider} from "./base-model";
import {BaseRequestOptions, Headers, RequestMethod, Response, ResponseOptions} from "@angular/http";
import {MockBackend, MockConnection} from "@angular/http/testing";
import {JwtInterceptorProvider} from "../jwt-interceptor/jwt-interceptor";
import {AuthServiceProvider} from "../auth-service/auth-service";
import {AuthServiceProviderMock} from "../../../test-config/mocks-ionic";
import {GoNevisAPIResponse} from "./gonevis-api-response";

class SmartPerson {
  title: string;

  constructor(data: any) {
    this.title = data.title
  }
}

describe('Testing Base model', () => {
  let mockBackend: MockBackend;
  let baseModelService: BaseModelProvider<SmartPerson>;
  let localStorageMock: any = {
    'JWT': 'WeirdToken'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BaseModelProvider,
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
      baseModelService = new BaseModelProvider<SmartPerson>(http, authService);
      baseModelService.modelClass = SmartPerson;
      baseModelService.apiEndPointList = 'smart'
    }));

  it('should ...', inject([BaseModelProvider], (service: BaseModelProvider<SmartPerson>) => {
    expect(service).toBeTruthy();
  }));

  it('API should have real GoNevis API endpoint URL', () => {
    expect(BaseModelProvider.API_URL).toEqual('http://draft.gonevis.com/api/v1/');
  });

  it('#all should return a GoNevis API List response', () => {
    let peopleData: Array<any> = [
      {'title': 'hello'},
      {'title': 'world'},
    ];
    let people: Array<SmartPerson> = [];

    for (let person of peopleData) {
      people.push(new SmartPerson(person))
    }

    let mockBody: { count: Number, next: string, previous: string, results: Array<any> } = {
      count: 0,
      next: 'next_url',
      previous: 'previous_url',
      results: peopleData
    };
    let expectedResponse = new GoNevisAPIResponse(mockBody.count, mockBody.next, mockBody.previous, people);
    let expectedHeaders: Headers = new Headers();
    expectedHeaders.set('Authorization', `JWT ${localStorageMock.JWT}`);

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return localStorageMock[key];
    });

    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toEqual(RequestMethod.Get);
      expect(connection.request.url).toEqual(BaseModelProvider.getAbsoluteURL('smart'));
      expect(connection.request.headers).toEqual(expectedHeaders);
      connection.mockRespond(new Response(new ResponseOptions({body: mockBody})));
    });

    baseModelService.all().subscribe(result => {
      expect(result).toEqual(expectedResponse);
    });
  });

  it('#getAbsoluteURL should return complete endpoint to call', () => {
    let endpoint: string = 'alireza';
    expect(BaseModelProvider.getAbsoluteURL(endpoint)).toEqual(`${BaseModelProvider.API_URL}${endpoint}`)
  });
});
