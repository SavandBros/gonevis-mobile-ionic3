import {Component} from '@angular/core';
import {ActionSheetController, Events, IonicPage, ModalController, NavController, Platform} from 'ionic-angular';
import {Site} from "../../models/site";
import {AuthProvider} from "../../providers/auth/auth-service";
import {SiteProvider} from "../../providers/site/site";
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";
import {DolphinSelectionPage} from "../dolphin-selection/dolphin-selection";
import {DolphinFile} from "../../models/dolphin-file";
import {AlertProvider} from "../../providers/alert/alert";

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  site: Site = new Site({});
  editing: string;
  coverImage: SafeStyle;
  updating: boolean;
  loading: boolean;
  updateImage: boolean = false;

  constructor(public navCtrl: NavController, public siteService: SiteProvider,
              public sanitizer: DomSanitizer, public authService: AuthProvider,
              public modalCtrl: ModalController, public events: Events,
              public platform: Platform, public alertService: AlertProvider,
              public actionSheetCtrl: ActionSheetController) {
    this.get();
    events.subscribe('image:selected', (dolphin, source) => this.onImageSelect(dolphin, source));
  }

  get(): void {
    this.loading = true;

    this.siteService.site().subscribe((resp) => {
      this.loading = false;
      this.site = resp;

      if (this.site.media.coverImage) {
        this.coverImage = this.sanitizer.bypassSecurityTrustStyle(`url(${this.site.media.coverImage.file})`);
      }
    }, (err) => {
      this.loading = false;
      console.log(err);
    });
  }

  updateSite(): void {
    this.updating = true;

    let payload: any = {
      title: this.site.title,
      description: this.site.description,
      commenting: this.site.commenting,
      voting: this.site.voting
    };


    if (this.updateImage) {
      payload.cover_image = this.site.media.coverImage ? this.site.media.coverImage.id : null;
      payload.logo = this.site.media.logo ? this.site.media.logo.id: null;

      this.updateImage = false;
    }

    this.siteService.updateSite(payload).subscribe((resp) => {
      this.updating = false;
      this.site = resp;

      if (this.site.media.coverImage) {
        this.coverImage = this.sanitizer.bypassSecurityTrustStyle(`url(${this.site.media.coverImage.file})`);
      }
    }, (err) => {
      this.updating = false;
      console.log(err);
    })
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

            this.alertService.createAlert(
              'Are you sure?',
              null,
              [
                {text: 'Cancel', role: 'cancel'},
                {text: 'Delete', handler: () => {
                  this.site.media[image] = null;
                  this.updateImage = true;
                  this.updateSite();
                }}
              ]);

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

  selectImage(image: string): void | false {
    let selectionModal = this.modalCtrl.create(DolphinSelectionPage, {source: image});
    selectionModal.present();
  }

  onImageSelect(dolphin: DolphinFile, source: string): void {
    this.site.media[source] = dolphin ? dolphin : null;
    this.updateImage = true;
    this.updateSite();
  }
}
