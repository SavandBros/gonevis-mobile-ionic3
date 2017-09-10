import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController} from 'ionic-angular';

import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';

@IonicPage()
@Component({
  selector: 'page-entrance',
  templateUrl: 'entrance.html',
})
export class EntrancePage {

  constructor(public navCtrl: NavController, public menu: MenuController) {
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

  toLogin() {
    this.navCtrl.push(LoginPage);
  }

  toSignup() {
    this.navCtrl.push(SignupPage);
  }
}
