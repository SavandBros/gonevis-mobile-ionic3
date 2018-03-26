import {EventEmitter, Injectable} from '@angular/core';
import {Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {Site} from "../../models/site";
import {Api} from "../api";
import {AuthProvider} from "../auth/auth-service";
import {Observable} from "rxjs/Observable";

@Injectable()
export class SiteProvider {

  public siteUpdated$: EventEmitter<Site> = new EventEmitter();

  constructor(public authService: AuthProvider, public api: Api) {
  }

  site(): Observable<Site> {
    return this.api.get("website/site/" + this.authService.getCurrentSite().id + "/settings/")
      .map((res: Response) => {
        return new Site(res.json());
      });
  }

  updateSite(payload): Observable<Site> {
    return this.api.put("website/site/" + this.authService.getCurrentSite().id + "/update-settings/", payload)
      .map((res: Response) => {
        let data = new Site(res.json());
        this.siteUpdated$.emit(data);

        return data;
      });
  }
}
