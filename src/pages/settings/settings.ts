import {Component} from '@angular/core';
import {Events, IonicPage, ModalController, NavController} from 'ionic-angular';
import {Site} from "../../models/site";
import {AuthProvider} from "../../providers/auth/auth-service";
import {SiteProvider} from "../../providers/site/site";
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";
import {DolphinSelectionPage} from "../dolphin-selection/dolphin-selection";

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

    let payload = {
      title: this.site.title,
      description: this.site.description,
      meta_description: this.site.metaDescription,
      commenting: this.site.commenting,
      voting: this.site.voting,
      cover_image: this.site.media.coverImage.id,
      logo: this.site.media.logo.id
    };

    this.siteService.updateSite(payload).subscribe((resp) => {
      this.updating = false;
      this.site = resp;
      this.coverImage = this.sanitizer.bypassSecurityTrustStyle(`url(${this.site.media.coverImage.file})`);
    }, (err) => {
      this.updating = false;
      console.log(err);
    })
  }

  selectImage(image): void{
    let selectionModal = this.modalCtrl.create(DolphinSelectionPage, {source: image});
    selectionModal.present();
  }

  onImageSelect(dolphin, source) {
    this.site.media[source] = dolphin;
  }
}
