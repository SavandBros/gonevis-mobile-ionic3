import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, ToastController} from 'ionic-angular';
import {Site} from "../../models/site";
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import {SiteProvider} from "../../providers/site/site";
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  site: Site = new Site({});
  coverImage: SafeStyle;
  updating: boolean;

  constructor(public navCtrl: NavController, public siteService: SiteProvider, public sanitizer: DomSanitizer,
              public loadingCtrl: LoadingController, public authService: AuthServiceProvider, public toastCtrl: ToastController) {

    let loader = this.loadingCtrl.create({content: "Please wait..."});
    loader.present();

    this.siteService.site().subscribe((resp) => {
      loader.dismiss();

      this.site = resp;
      if (this.site.media.coverImage) {
        this.coverImage = this.sanitizer.bypassSecurityTrustStyle(`url(${this.site.media.coverImage.file})`);
      }
    }, (err) => {
      loader.dismiss();
      console.log(err);
    });
  }

  updateSite() {
    this.updating = true;

    let payload = {
      title: this.site.title,
      description: this.site.description,
      meta_description: this.site.metaDescription,
      commenting: this.site.commenting,
      voting: this.site.voting
    };

    this.siteService.updateSite(payload).subscribe((resp) => {
      this.updating = false;
      this.site = resp;
      let toast = this.toastCtrl.create({
        message: 'Site updated',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }, (err) => {
      this.updating = false;
      console.log(err);
    })
  }
}
