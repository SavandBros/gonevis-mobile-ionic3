import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {Entry} from "../../models/entry";
import {Api} from "../api";
import {AuthProvider} from "../auth/auth-service";
import {Comment} from "../../models/comment";

/*
 Generated class for the CommentProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class CommentProvider {

  constructor(public api: Api, public authService: AuthProvider) {
    console.log('Hello CommentProvider Provider');
  }

  getEntryComments(entry: Entry) {
    return this.api.get("sushial/comment/", {site: this.authService.getCurrentSite().id, object_pk: entry.id, object_type: 1 })
      .map((res: Response) => {
        let data = res.json();
        let comments = [];

        for (let comment of data.results) {
          comments.push(new Comment(comment));
        }

        data.results = comments;
        return data;
      });
  }
}
