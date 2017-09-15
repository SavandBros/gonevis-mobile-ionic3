import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {DolphinFile} from "../../models/dolphin-file";
import {DolphinProvider} from "../../providers/dolphin/dolphin";

/**
 * Generated class for the DolphinPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dolphin',
  templateUrl: 'dolphin.html',
})
export class DolphinPage {

  dolphin: DolphinFile;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController, public loadingCtrl: LoadingController,
              public dolphinService: DolphinProvider, public toastCtrl: ToastController) {
    this.dolphin = this.navParams.get("dolphin");
  }

  update() {
    let payload = {
      meta_data: {
        name: this.dolphin.metaData.name,
        description: this.dolphin.metaData.description
      }
    };

    let loader = this.loadingCtrl.create({content: "Updating..."});
    loader.present();

    this.dolphinService.update(this.dolphin.id, payload).subscribe((resp) => {
      this.dolphin = resp;
      loader.dismiss();

      let toast = this.toastCtrl.create({
        message: 'File successfully updated',
        duration: 3000,
        position: 'bottom'
      });

      toast.present();
    }, (err) => {
      loader.dismiss();
      console.log(err);
    });
  }

  dismiss(dolphin) {
    this.viewCtrl.dismiss(dolphin);
  }
}
