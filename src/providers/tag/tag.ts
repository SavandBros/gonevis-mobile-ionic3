import {EventEmitter, Injectable} from '@angular/core';
import {Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {AuthProvider} from "../auth/auth-service";
import {Api} from "../api";
import {Tag} from "../../models/tag";

/*
  Generated class for the TagProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class TagProvider {

  updated$: EventEmitter<Tag> = new EventEmitter();
  created$: EventEmitter<Tag> = new EventEmitter();

  constructor(public api: Api, public authService: AuthProvider) {}

  tags(): any {
    return this.api.get("tagool/tag/", {site: this.authService.getCurrentSite().id})
      .map((res: Response) => {
        let data = res.json();
        let tags: Array<Tag> = [];

        for (let tagData of data.results) {
          tags.push(new Tag(tagData));
        }

        data.results = tags;
        return data;
      });
  }

  update(tag: any): any {
    return this.api.put(`tagool/tag/${tag.slug}/`, tag, { site: tag.site })
      .map((res: Response) => {
        let data: Tag = new Tag(res.json());
        this.updated$.emit(data);

        return data;
      });
  }

  create(tag: any): any {
    return this.api.post("tagool/tag/", tag, {site: this.authService.getCurrentSite().id})
      .map((res: Response) => {
        let data: Tag = new Tag(res.json());
        this.created$.emit(data);

        return data;
      });
  }

  delete(tag: any): any {
    return this.api.delete(`tagool/tag/${tag.slug}/`, {site: tag.site}).map(() => {});
  }
}
