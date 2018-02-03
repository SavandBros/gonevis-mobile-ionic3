import {Component} from '@angular/core';
import {IonicPage, LoadingController, MenuController, NavController, ToastController} from 'ionic-angular';
import {TranslateService} from "@ngx-translate/core";
import {AuthProvider} from "../../providers/auth/auth-service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions';
import {SignupPage} from "../signup/signup";


@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  private account: FormGroup;

  constructor(public navCtrl: NavController, public authService: AuthProvider,
              public toastCtrl: ToastController, public menu: MenuController,
              public translateService: TranslateService, public loadingCtrl: LoadingController,
              private formBuilder: FormBuilder, private nativePageTransitions: NativePageTransitions) {
    this.account = this.formBuilder.group({
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

  signIn() {
    let loader = this.loadingCtrl.create({content: "Loging in, please wait..."});
    loader.present();

    this.authService.signIn(this.account.value.username, this.account.value.password).subscribe((resp) => {
      loader.dismiss();

      let toast = this.toastCtrl.create({
        message: 'Welcome back ' + resp.user.username + '',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }, (err) => {
      loader.dismiss();
      console.log(err);
    });
  }


  toSignUp() {
    let options: NativeTransitionOptions = {
      direction: 'left',
      duration: 300,
    };

    this.nativePageTransitions.slide(options);
    this.navCtrl.push(SignupPage);
  }

}
