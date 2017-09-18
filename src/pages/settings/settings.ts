import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import {Site} from "../../models/site";
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import {SiteProvider} from "../../providers/site/site";

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  site: Site = new Site({});

  constructor(public navCtrl: NavController, public siteService: SiteProvider) {
    this.siteService.site().subscribe((resp) => {
      this.site = resp;
    }, (err) => {
      console.log(err);
    });
  }
}
