import {EventEmitter, Injectable} from '@angular/core';
import {Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {Site} from "../../models/site";
import {Api} from "../api";
import {AuthProvider} from "../auth/auth-service";

@Injectable()
export class SiteProvider {

  public siteUpdated$: EventEmitter<Site> = new EventEmitter();

  constructor(public authService: AuthProvider, public api: Api) {
  }

  site() {
    return this.api.get("website/site/" + this.authService.getCurrentSite().id + "/settings/")
      .map((res: Response) => {
        let data = res.json();
        data = new Site(data);
        return data;
      });
  }

  updateSite(payload) {
    return this.api.put("website/site/" + this.authService.getCurrentSite().id + "/update-settings/", payload)
      .map((res: Response) => {
        let data = res.json();
        data = new Site(data);

        this.siteUpdated$.emit(data);
        return data;
      });
  }

  create(payload: object): any {
    return this.api.post("website/site/", payload)
      .map((res: Response) => {
        return res.json();
      });
  }
}
