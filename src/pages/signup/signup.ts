import {Component} from '@angular/core';
import {
  AlertController,
  IonicPage, LoadingController, MenuController, NavController,
  ToastController
} from 'ionic-angular';
import {NativePageTransitions, NativeTransitionOptions} from "@ionic-native/native-page-transitions";
import {TranslateService} from "@ngx-translate/core";
import {AuthProvider} from "../../providers/auth/auth-service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SigninPage} from "../signin/signin";
import {Api} from "../../providers/api";

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  private account: FormGroup;

  constructor(public navCtrl: NavController, public authService: AuthProvider,
              public toastCtrl: ToastController, public menu: MenuController,
              public translateService: TranslateService, public loadingCtrl: LoadingController,
              private formBuilder: FormBuilder, private nativePageTransitions: NativePageTransitions,
              public api: Api, public alertCtrl: AlertController) {
    this.account = this.formBuilder.group({
      email: ['', Validators.compose([Validators.email, Validators.required])],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

  signUp() {
    let loader = this.loadingCtrl.create({content: "Registering, please wait..."});
    loader.present();

    this.authService.signUp(this.account.value).subscribe(() => {
      this.authService.signIn(this.account.value.username, this.account.value.password).subscribe((resp) => {
        loader.dismiss();

        this.alertCtrl.create({
          title: `Welcome to Gonevis ${resp.user.username}`,
          message: "Thanks for registering at GoNevis, a link has been sent to your email for account verification.",
          buttons: [
            {text: 'Ok', role: 'cancel'}
          ]
        }).present();
      });
    }, (err: Error) => {
      console.log(err);
    })
  }

  toSignIn() {
    let options: NativeTransitionOptions = {
      direction: 'right',
      duration: 300,
    };

    this.nativePageTransitions.slide(options);
    this.navCtrl.push(SigninPage);
  }

}
