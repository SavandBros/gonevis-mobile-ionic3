import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {Site} from "../../models/site";
import {Api} from "../api";
import {AuthServiceProvider} from "../auth-service/auth-service";
import 'rxjs/add/operator/map';

/*
  Generated class for the SiteProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SiteProvider {

  constructor(public authService: AuthServiceProvider, public api: Api) {
  }

  site() {
    return this.api.get("website/site/" + this.authService.getCurrentSite().id + "/")
      .map((res: Response) => {
        let data = res.json();
        data = new Site(data);
        return data;
      });
  }
}
