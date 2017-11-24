import {Component} from '@angular/core';
import {
  IonicPage, ModalController, NavController, NavParams, ToastController, Events, ActionSheetController, Platform,
  AlertController
} from 'ionic-angular';
import {Tag} from "../../models/tag";
import {AuthProvider} from "../../providers/auth/auth-service";
import {TagProvider} from "../../providers/tag/tag";
import {DolphinSelectionPage} from "../dolphin-selection/dolphin-selection";

@IonicPage()
@Component({
  selector: 'page-tag',
  templateUrl: 'tag.html',
})
export class TagPage {
  tag: any;
  updating: boolean;
  editing: boolean;
  updateImage: boolean;
  siteId: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthProvider,
              public tagService: TagProvider, public toastCtrl: ToastController, public modalCtrl: ModalController,
              public events: Events, public actionSheetCtrl: ActionSheetController, public platform: Platform,
              public alertCtrl: AlertController) {
    events.subscribe('image:selected', (dolphin, source) => this.onImageSelect(dolphin, source));

    this.siteId = this.authService.getCurrentSite().id;

    this.tag = new Tag({});
    this.editing = false;

    if (this.navParams.get("tag")) {
      this.tag = <Tag> JSON.parse(JSON.stringify(this.navParams.get("tag")));
      this.editing = true;
    }
  }

  save(): void {
    if (this.editing) {
      this.update();
    } else {
      this.create();
    }
  }

  update(): void {
    this.updating = true;

    let payload: any = {
      name: this.tag.name,
      description: this.tag.description,
      slug: this.tag.slug,
      site: this.siteId
    };

    if (this.updateImage) {
      payload.cover_image = this.tag.media.coverImage ? this.tag.media.coverImage : null;
    }

    this.tagService.update(payload).subscribe((resp) => {
      this.updating = false;
      this.tag = resp;
      this.navCtrl.pop();

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

  options(image): void {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Options',
      buttons: [
        {
          text: 'Change',
          icon: !this.platform.is('ios') ? 'refresh' : null,
          cssClass: 'action-icon-primary',
          handler: () => this.selectImage(image)
        },
        {
          text: 'Remove',
          icon: !this.platform.is('ios') ? 'remove' : null,
          role: 'Destructive',
          cssClass: 'action-icon-danger',
          handler: () => {
            actionSheet.dismiss();

            let alert = this.alertCtrl.create({
              title: 'Are you sure?',
              message: null,
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel'
                },
                {
                  text: 'Delete', handler: () => {
                  this.tag.media[image] = null;
                  this.updateImage = true;
                  this.update();
                }
                }
              ]
            });
            alert.present();

            return false;
          }
        },
        {
          text: 'Cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          role: 'cancel'
        },
      ]
    });

    actionSheet.present();
  }

  selectImage(image: string): void {
    let selectionModal = this.modalCtrl.create(DolphinSelectionPage, {source: image});
    selectionModal.present();
  }

  onImageSelect(dolphin, source): void {
    this.tag.media[source] = dolphin ? dolphin.id : null;
    this.updateImage = true;
  }
}
