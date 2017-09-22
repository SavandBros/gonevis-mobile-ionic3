import {Response, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Observable";
import {JwtInterceptorProvider} from "../jwt-interceptor/jwt-interceptor";
import {AuthServiceProvider} from "../auth-service/auth-service";
import {Injectable} from "@angular/core";
import {GoNevisAPIResponse} from "./gonevis-api-response";


@Injectable()
export class BaseModelProvider<T> {
  public static readonly API_URL: string = 'http://draft.gonevis.com/api/v1/';
  public apiEndPoint: string;
  public apiEndPointList: string;
  public modelClass;

  constructor(public http: JwtInterceptorProvider, public authService: AuthServiceProvider) {}

  /**
   * Make a query to return all the objects from the model API endpoint.
   */
  all(): Observable<GoNevisAPIResponse<T>> {
    let params = new URLSearchParams();
    params.set('site', this.authService.getCurrentSite().id);
    return this.http.get(BaseModelProvider.getAbsoluteURL(this.apiEndPointList), params)
      .map((res: Response) => {
        let data: any = res.json();
        let results: Array<T> = [];

        for (let modelData of data.results) {
          results.push(new this.modelClass(modelData));
        }

        return new GoNevisAPIResponse(data.count, data.next, data.previous, results);
      });
  }

  static getAbsoluteURL(endpoint: string): string {
    return BaseModelProvider.API_URL + endpoint
  }

  /**
   * Get
   *
   * Return only 1 model from the backend. Filtered via the "primaryKey".
   *
   * @param primaryKey The key to filter based on that backend API would recognize as the primary key.
   */
  // get(primaryKey: string): Observable<BaseModelProvider> {
  //   return this.http.get(this.API_ENDPOINT, {site: this.authService.getCurrentSite().id})
  //     .map((res: Response) => {
  //       let data: any = res.json();
  //
  //       return new BaseModelProvider(this.http, this.authService, data);
  //     });
  // }

  /**
   * Update
   *
   * This should return a Observable after sending update data to the API endpoint.
   * The data from backend should construct or update the data on the model and return
   * new modified model.
   *
   * If updayedFields is being provided, the data should sent in PATCH request and only
   * the updated fields data should be sent to API endpoint.
   *
   * @param updateFields Provide a partial update on these fields only. (Using PATCH http request.)
   */
  // update(updateFields?: Array<string>): Observable<BaseModelProvider> {
  //   return this.http.put(this.API_ENDPOINT, {site: this.authService.getCurrentSite().id})
  //     .map((res: Response) => {
  //       let data: any = res.json();
  //
  //       return new BaseModelProvider(this.http, this.authService, data)
  //     });
  // }

  /**
   * Sample Usage:
   * ```
   * let instance = BaseModelProvider({name: "Alireza Savand", "age": "Old!"});
   * instance.create()  // The data has been send to the backend and has been saved.
   * ```
   */
  // create(): Observable<T> {
  //   // return this.http.post(this.API_ENDPOINT, {site: this.authService.getCurrentSite().id})
  //   // .map((res: Response) => {
  //   //   let data: Promise<any>  = res.json();
  //   // });
  // }

}
