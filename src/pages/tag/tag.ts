import {Component} from '@angular/core';
import {
  IonicPage, ModalController, NavController, NavParams, ToastController, Events, ActionSheetController, Platform,
  AlertController
} from 'ionic-angular';
import {Tag} from "../../models/tag";
import {AuthProvider} from "../../providers/auth/auth-service";
import {TagProvider} from "../../providers/tag/tag";
import {DolphinSelectionPage} from "../dolphin-selection/dolphin-selection";
import {CodekitProvider} from "../../providers/codekit/codekit";

@IonicPage()
@Component({
  selector: 'page-tag',
  templateUrl: 'tag.html',
})
export class TagPage {
  tag: any;
  updating: boolean;
  editing: boolean;
  siteId: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthProvider,
              public tagService: TagProvider, public toastCtrl: ToastController, public modalCtrl: ModalController,
              public events: Events, public actionSheetCtrl: ActionSheetController, public platform: Platform,
              public alertCtrl: AlertController, public codekit: CodekitProvider) {
    this.siteId = this.authService.getCurrentSite().id;

    this.tag = new Tag({});
    this.editing = false;

    if (this.navParams.get("tag")) {
      this.tag = <Tag> JSON.parse(JSON.stringify(this.navParams.get("tag")));
      this.editing = true;
    }

    events.subscribe('image:selected', (dolphin, source) => {
      this.tag.media[source] = dolphin ? dolphin.id : null;
      this.update(true);
    });

    this.codekit.onImageRemoved$.subscribe((image: string) => {
      this.tag.media[image] = null;
      this.update(true);
    });
  }

  save(): void {
    if (this.editing) {
      this.update();
    } else {
      this.create();
    }
  }

  update(updateImage?: boolean): void {
    this.updating = true;

    let payload: any = {
      name: this.tag.name,
      description: this.tag.description,
      slug: this.tag.slug,
      site: this.siteId
    };

    if (updateImage) {
      payload.cover_image = this.tag.media.coverImage ? this.tag.media.coverImage : null;
    }

    this.tagService.update(payload).subscribe((resp) => {
      this.updating = false;
      this.tag = resp;

    }, (err) => {
      this.updating = false;
      console.log(err);
    });
  }

  create(): void {
    this.updating = true;

    let payload: any = {
      name: this.tag.name,
      description: this.tag.description,
      slug: '',
      site: this.siteId,
      cover_image: this.tag.media.coverImage ? this.tag.media.coverImage : null
    };

    this.tagService.create(payload).subscribe((resp) => {
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
