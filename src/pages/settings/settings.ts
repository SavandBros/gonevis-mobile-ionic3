import {Component} from '@angular/core';
import {ActionSheetController, Events, IonicPage, ModalController, NavController, Platform} from 'ionic-angular';
import {Site} from "../../models/site";
import {AuthProvider} from "../../providers/auth/auth-service";
import {SiteProvider} from "../../providers/site/site";
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";
import {DolphinSelectionPage} from "../dolphin-selection/dolphin-selection";
import {DolphinFile} from "../../models/dolphin-file";
import {AlertProvider} from "../../providers/alert/alert";
import {CodekitProvider} from "../../providers/codekit/codekit";

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
              public modalCtrl: ModalController, public events: Events,
              public platform: Platform, public alertService: AlertProvider,
              public actionSheetCtrl: ActionSheetController, public codekit: CodekitProvider) {
    this.get();

    events.subscribe('image:selected', (dolphin, source) =>  {
      this.site.media[source] = dolphin ? dolphin : null;
      this.updateSite(true);
    });

    this.codekit.onImageRemoved$.subscribe((image: string) => {
      this.site.media[image] = null;
      this.updateSite(true);
    });
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

  updateSite(updateImage?: boolean): void {
    this.updating = true;

    let payload: any = {
      title: this.site.title,
      description: this.site.description,
      commenting: this.site.commenting,
      voting: this.site.voting
    };


    if (updateImage) {
      payload.cover_image = this.site.media.coverImage ? this.site.media.coverImage.id : null;
      payload.logo = this.site.media.logo ? this.site.media.logo.id: null;
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
}
