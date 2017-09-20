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

  tags: Array<Tag>;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
              public tagService: TagProvider, public modalCtrl: ModalController) {
    this.get();

    this.tagService.updated$.subscribe((tag) => this.onUpdate(tag));
    this.tagService.created$.subscribe((tag) => this.onCreate(tag));
  }

  get() {
    let loader = this.loadingCtrl.create({content: "Please wait..."});
    loader.present();

    this.tagService.tags().subscribe((resp) => {
      this.tags = resp.results;
      loader.dismiss();
    }, (err) => {
      console.log(err);
      loader.dismiss();
    });
  }

  editTag(tag: Tag) {
    let tagModal = this.modalCtrl.create(TagPage, { tag: tag });
    tagModal.present();
  }

  createTag() {
    let tagModal = this.modalCtrl.create(TagPage);
    tagModal.present();
  }

  onUpdate(data: Tag) {
    this.tags.forEach((tag, index) => {
      if (tag.id == data.id) {
        this.tags[index] = data;
      }
    });
  }

  onCreate(tag: Tag) {
    this.tags.unshift(tag);
  }
}
