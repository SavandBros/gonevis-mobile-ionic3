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

  tags() {
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

  update(tag) {
    return this.api.put(`tagool/tag/${tag.slug}/`, tag, { slug: tag.slug, site: tag.site })
      .map((res: Response) => {
        let data = res.json();
        let tag: Tag = new Tag(data);

        data = tag;
        this.updated$.emit(data);

        return data;
      });
  }

  create(tag) {
    return this.api.post("tagool/tag/", tag, {site: this.authService.getCurrentSite().id})
      .map((res: Response) => {
        let data = res.json();
        let tag: Tag = new Tag(data);

        data = tag;
        this.created$.emit(data);

        return data;
      });
  }
}
