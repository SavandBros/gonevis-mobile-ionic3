import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {DolphinFile} from "../../models/dolphin-file";
import {Api} from "../api";
import {AuthServiceProvider} from "../auth-service/auth-service";
import 'rxjs/add/operator/map';
/*
 Generated class for the DolphinProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class DolphinProvider {

  constructor(public api: Api, public authService: AuthServiceProvider) {
  }

  dolphins() {
    return this.api.get("dolphin/file/", {site: this.authService.getCurrentSite().id})
      .map((res: Response) => {
        let data = res.json();
        let dolphins: Array<DolphinFile> = [];

        for (let file of data.results) {
          dolphins.push(new DolphinFile(file));
        }

        data.results = dolphins;
        return data;
      });
  }

  delete(id) {
    return this.api.delete(`dolphin/file/${id}/`, {siteId: this.authService.getCurrentSite().id}).map(() => {});
  }
}
