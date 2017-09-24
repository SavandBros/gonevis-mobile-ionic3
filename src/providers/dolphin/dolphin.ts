import {Injectable, EventEmitter} from '@angular/core';
import {Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {DolphinFile} from "../../models/dolphin-file";
import {Api} from "../api";
import {AuthProvider} from "../auth/auth-service";
import 'rxjs/add/operator/map';
/*
 Generated class for the DolphinProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class DolphinProvider {

  public dolphinUpdate$: EventEmitter<DolphinFile> = new EventEmitter();

  constructor(public api: Api, public authService: AuthProvider) {
  }

  dolphins(limit?: number) {
    return this.api.get("dolphin/file/", {site: this.authService.getCurrentSite().id, limit: limit})
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

  update(id, dolphin) {
    return this.api.put(`dolphin/file/${id}/`, dolphin, { siteId: this.authService.getCurrentSite().id })
      .map((res: Response) => {
        let data = res.json();

        data = new DolphinFile(data);
        this.dolphinUpdate$.emit(data);
        return data;
      });
  }

  delete(id) {
    return this.api.delete(`dolphin/file/${id}/`, {siteId: this.authService.getCurrentSite().id}).map(() => {});
  }
}
