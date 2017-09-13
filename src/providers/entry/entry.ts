import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {Api} from "../api";
import {AuthServiceProvider} from "../auth-service/auth-service";
import {Entry} from "../../models/entry";

/*
 Generated class for the EntryProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class EntryProvider {

  constructor(public api: Api, public authService: AuthServiceProvider) {}

  entries() {
    return this.api.get("website/entry/", {site: this.authService.getCurrentSite().id})
      .map((res: Response) => {
        let data = res.json();
        let entries: Array<Entry> = [];
        for (let entryData of data.results) {
          entries.push(new Entry(entryData));
        }

        data.results = entries;
        return data;
      });
  }
}
