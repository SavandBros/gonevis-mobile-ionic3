///<reference path="../../../node_modules/@types/jasmine/index.d.ts"/>

import {GoNevisAPIResponse} from "./gonevis-api-response";


describe('Testing GoNevis API Response', () => {
  it('should only create the object, nothing serious', () => {
    let names: Array<string> = ["Alireza", "Arsalan", "Amir"];
    let apiResponse = new GoNevisAPIResponse(10, "/api/v1/?page=3", "/api/v1/?page=2", names);

    expect(apiResponse).toBeTruthy();
    expect(apiResponse.count).toEqual(10);
    expect(apiResponse.next).toEqual("/api/v1/?page=3");
    expect(apiResponse.previous).toEqual("/api/v1/?page=2");
    expect(apiResponse.results).toEqual(names);
  });
});
