import {Component} from '@angular/core';
import {Events, IonicPage, MenuController, NavController, NavParams, ToastController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SiteProvider} from "../../providers/site/site";
import {AuthProvider} from "../../providers/auth/auth-service";
import {User} from "../../models/user";
import {UserSite} from "../../models/user-site";

@IonicPage()
@Component({
  selector: 'page-site-new',
  templateUrl: 'site-new.html',
})
export class SiteNewPage {

  private site: FormGroup;
  private user: User;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public menu: MenuController, private formBuilder: FormBuilder,
              public siteService: SiteProvider, public toastCtrl: ToastController,
              public authService: AuthProvider, public events: Events) {
    this.user = this.authService.getAuthUser(false);

    this.site = this.formBuilder.group({
      url: ['', Validators.required],
      title: ['', Validators.required]
    });
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

  createSite() {
    this.siteService.create(this.site.value).subscribe((resp: any) => {
      let createdSite = new UserSite(resp.id, null, resp.title, resp.url);
      this.user.sites.unshift(createdSite);
      this.authService.setAuthUser(this.user);

      this.events.publish('site:created');
      this.authService.setCurrentSite(createdSite);

      this.toastCtrl.create({
        message: `Created ${resp.title}`,
        duration: 3000,
        position: 'bottom'
      }).present();
    }, (err: Error) => {
      console.log(err);
    })
  }

}
