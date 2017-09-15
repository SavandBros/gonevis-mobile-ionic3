import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import 'rxjs/add/operator/map';
import {Api} from "../api";
import {DolphinFile} from "../../models/dolphin-file";

/*
  Generated class for the PaginationProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class PaginationProvider {

  constructor(public api: Api) {
    console.log('Hello PaginationProvider Provider');
  }

  paginate(next, modelName) {
    return this.api.next(next)
      .map((res: Response) => {
        let data = res.json();

        let container: Array<{modelName}> = [];

        for (let result of data.results) {
          container.push(new modelName(result));
        }

        data.results = container;
        return data;
      });
  }
}
