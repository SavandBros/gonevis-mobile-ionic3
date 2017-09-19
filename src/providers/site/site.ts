import {EventEmitter, Injectable} from '@angular/core';
import {Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {Site} from "../../models/site";
import {Api} from "../api";
import {AuthServiceProvider} from "../auth-service/auth-service";
import 'rxjs/add/operator/map';
import {Account} from "../../models/account";

/*
  Generated class for the SiteProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SiteProvider {

  siteId: string;
  currentSite: any;
  public siteUpdated$: EventEmitter<Account> = new EventEmitter();

  constructor(public authService: AuthServiceProvider, public api: Api) {
    this.siteId = this.authService.getCurrentSite().id;
    this.currentSite = this.authService.getCurrentSite();
  }

  site() {
    return this.api.get("website/site/" + this.siteId + "/settings/")
      .map((res: Response) => {
        let data = res.json();
        data = new Site(data);
        return data;
      });
  }

  updateSite(payload) {
    return this.api.put("website/site/" + this.siteId + "/update-settings/", payload)
      .map((res: Response) => {
        let data = res.json();
        data = new Site(data);

        this.siteUpdated$.emit(data);
        return data;
      });
  }
}
