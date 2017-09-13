import {Component, EventEmitter} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {Tag} from "../../models/tag";
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
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
  editing: boolean;
  submitText: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              public authService: AuthServiceProvider, public tagService: TagProvider, public loadingCtrl: LoadingController,
              public toastCtrl: ToastController) {
    this.tag = new TagForm(this.authService.getCurrentSite().id);
    this.editing = false;
    this.submitText = "create";

    if (this.navParams.get("tag")) {
      this.editing = true;
      this.tag = this.navParams.get("tag");
      this.submitText = "update";
    }
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  save() {
    if (this.editing) {
      this.update();
    } else {
      this.create();
    }
  }

  update() {
    let loader = this.loadingCtrl.create({content: "Updating..."});
    loader.present();

    this.tagService.update(this.tag).subscribe((resp) => {
      this.tag = resp;
      loader.dismiss();

      let toast = this.toastCtrl.create({
        message: 'Tag successfully updated',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }, (err) => {
      loader.dismiss();
      console.log(err);
    });
  }

  create() {
    let loader = this.loadingCtrl.create({content: "Creating..."});
    loader.present();

    this.tagService.create(this.tag).subscribe((resp) => {
      loader.dismiss();
      this.navCtrl.push(TagsPage);

      let toast = this.toastCtrl.create({
        message: 'Tag ' + resp.name + ' created',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }, (err) => {
      loader.dismiss();
      console.log(err);
    });
  }
}
