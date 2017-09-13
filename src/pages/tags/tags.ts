import { Component } from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
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

  tags: Array<Tag> = [];

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
              public tagService: TagProvider, public modalCtrl: ModalController) {
    let loader = this.loadingCtrl.create({content: "Please wait..."});
    loader.present();

    this.tagService.tags().subscribe((resp) => {
      this.tags = resp.results;
      loader.dismiss();
    }, (err) => {
      console.log(err);
      loader.dismiss();
    });
    this.tagService.updated$.subscribe((tag) => this.onUpdate(tag));
    this.tagService.created$.subscribe((tag) => this.onCreate(tag));
  }

  editTag(tag: Tag) {
    let tagModal = this.modalCtrl.create(TagPage, { tag: tag });
    tagModal.present();
  }

  createTag() {
    let tagModal = this.modalCtrl.create(TagPage);
    tagModal.present();
  }

  onUpdate(tag: Tag) {
    for (let mainTag of this.tags) {
      if (mainTag.id == tag.id) {
        mainTag = tag;
        console.log(mainTag);
      }
    }
  }

  onCreate(tag: Tag) {
    this.tags.unshift(tag);
  }
}
