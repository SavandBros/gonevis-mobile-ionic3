import {Component, EventEmitter} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {Tag} from "../../models/tag";
import {AuthProvider} from "../../providers/auth/auth-service";
import {TagProvider} from "../../providers/tag/tag";
import {TagsPage} from "../tags/tags";

class TagForm {
  name = '';
  description = '';
  site: string;
  slug: string = '';

  constructor(site) {
    this.site = site;
  }
}

@IonicPage()
@Component({
  selector: 'page-tag',
  templateUrl: 'tag.html',
})
export class TagPage {

  tag: any;
  updating: boolean;
  editing: boolean;
  submitText: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthProvider,
              public tagService: TagProvider, public toastCtrl: ToastController) {
    this.tag = new TagForm(this.authService.getCurrentSite().id);
    this.editing = false;
    this.submitText = "create";

    if (this.navParams.get("tag")) {
      this.tag = <Tag> JSON.parse(JSON.stringify(this.navParams.get("tag")));
      this.editing = true;
      this.submitText = "update";
    }
  }

  save() {
    if (this.editing) {
      this.update();
    } else {
      this.create();
    }
  }

  update() {
    this.updating = true;

    this.tagService.update(this.tag).subscribe((resp) => {
      this.updating = false;
      this.tag = resp;
      this.navCtrl.pop();

    }, (err) => {
      this.updating = false;
      console.log(err);
    });
  }

  create() {
    this.updating = true;

    this.tagService.create(this.tag).subscribe((resp) => {
      this.updating = false;
      this.navCtrl.pop();

      let toast = this.toastCtrl.create({
        message: 'Tag ' + resp.name + ' created',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }, (err) => {
      this.updating = false;
      console.log(err);
    });
  }
}
