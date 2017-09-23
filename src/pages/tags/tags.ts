import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, Refresher} from 'ionic-angular';
import {TagProvider} from "../../providers/tag/tag";
import {Tag} from "../../models/tag";
import {TagPage} from "../tag/tag";

/**
 * Generated class for the TagsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tags',
  templateUrl: 'tags.html',
})
export class TagsPage {

  tags: Array<Tag>;
  loading: boolean;

  constructor(public navCtrl: NavController, public tagService: TagProvider, public modalCtrl: ModalController) {
    this.get();

    this.tagService.updated$.subscribe((tag) => this.onUpdate(tag));
    this.tagService.created$.subscribe((tag) => this.onCreate(tag));
  }

  reloadPage(refresher): void {
    this.get(refresher);
  }

  get(refresh?: Refresher): void {
    this.loading = true;

    this.tagService.tags().subscribe((resp) => {
      this.loading = false;
      this.tags = resp.results;

      if (refresh) {
        refresh.complete();
      }
    }, (err) => {
      this.loading = false;
      console.log(err);
    });
  }

  editTag(tag: Tag): void {
    let tagModal = this.modalCtrl.create(TagPage, { tag: tag });
    tagModal.present();
  }

  createTag(): void {
    let tagModal = this.modalCtrl.create(TagPage);
    tagModal.present();
  }

  onUpdate(data: Tag): void {
    this.tags.forEach((tag, index) => {
      if (tag.id == data.id) {
        this.tags[index] = data;
      }
    });
  }

  onCreate(tag: Tag): void {
    this.tags.unshift(tag);
  }
}
