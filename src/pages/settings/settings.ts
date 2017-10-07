import {Component} from '@angular/core';
import {Events, IonicPage, ModalController, NavController} from 'ionic-angular';
import {Site} from "../../models/site";
import {AuthProvider} from "../../providers/auth/auth-service";
import {SiteProvider} from "../../providers/site/site";
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";
import {DolphinSelectionPage} from "../dolphin-selection/dolphin-selection";
import {DolphinFile} from "../../models/dolphin-file";

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
  imageSelected: boolean = false;

  constructor(public navCtrl: NavController, public siteService: SiteProvider,
              public sanitizer: DomSanitizer, public authService: AuthProvider,
              public modalCtrl: ModalController, public events: Events) {
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

    if (this.imageSelected) {
      payload.cover_image = this.site.media.coverImage ? this.site.media.coverImage.id : null;
      payload.logo = this.site.media.logo ? this.site.media.logo.id: null;

      this.imageSelected = false;
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

  selectImage(image: string): void{
    let selectionModal = this.modalCtrl.create(DolphinSelectionPage, {source: image});
    selectionModal.present();
  }

  onImageSelect(dolphin: DolphinFile, source: string): void {
    this.site.media[source] = dolphin ? dolphin : null;
    this.imageSelected = true;
  }
}
