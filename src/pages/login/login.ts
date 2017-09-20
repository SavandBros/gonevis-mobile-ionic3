import {Component} from '@angular/core';
import {NavController, ToastController, LoadingController, MenuController} from 'ionic-angular';

import {MainPage} from '../../pages/pages';

import {AuthServiceProvider} from '../../providers/auth-service/auth-service';

import {TranslateService} from '@ngx-translate/core';

class LoginCredential {
  username: string = '';
  password: string = '';
}

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  account: LoginCredential = new LoginCredential();

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
              public authService: AuthServiceProvider,
              public toastCtrl: ToastController,
              public menu: MenuController,
              public translateService: TranslateService,
              public loadingCtrl: LoadingController) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

  // Attempt to login in through our User service
  login() {
    let loader = this.loadingCtrl.create({content: "Loging in, please wait..."});
    loader.present();
    this.authService.login(this.account).subscribe((resp) => {
      this.navCtrl.setRoot(MainPage);
      loader.dismiss();

      let toast = this.toastCtrl.create({
        message: 'Welcome back ' + this.account.username + '',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }, (err) => {
      loader.dismiss();
      let toast = this.toastCtrl.create({
        message: this.loginErrorString,
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    });
  }
}
