import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {AuthProvider} from "../auth/auth-service";
import {JwtInterceptorProvider} from "../jwt-interceptor/jwt-interceptor";
import {BaseModelProvider} from "../base-model/base-model";
import {Reader} from "../../models/reader";

@Injectable()
export class ReaderProvider extends BaseModelProvider<Reader> {

  constructor(public http: JwtInterceptorProvider, public authService: AuthProvider){
    super(http, authService);
    this.apiEndPointList = "sushial/subscribed-entries/";
    this.modelClass = Reader
  }
}
