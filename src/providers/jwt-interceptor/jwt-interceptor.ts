import {Injectable} from '@angular/core';
import {ConnectionBackend, Headers, Http, Request, RequestOptions, RequestOptionsArgs, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class JwtInterceptorProvider extends Http {

  constructor(_backend: ConnectionBackend, _defaultOptions: RequestOptions) {
    super(_backend, _defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    let token: string = localStorage.getItem("JWT");
    if (typeof url === 'string') {
      if (!options) {
        options = {headers: new Headers()};
      }
      options.headers.set('Authorization', `JWT ${token}`);
    } else {
      url.headers.set('Authorization', `JWT ${token}`);
    }
    return super.request(url, options).catch(this.catchAuthError(this));
  };

  private catchAuthError(self: JwtInterceptorProvider) {
    return (res: Response) => {
      console.log(res);
      if (res.status === 401 || res.status === 403) {
        console.log(res);
      }
      return Observable.throw(res);
    };
  }
}
