import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {DolphinProvider} from "../../providers/dolphin/dolphin";
import {DolphinFile} from "../../models/dolphin-file";
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";

/**
 * Generated class for the DolphinsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dolphins',
  templateUrl: 'dolphins.html',
})
export class DolphinsPage {

  dolphins: Array<DolphinFile>;
  image: SafeStyle;
  dolphin: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public loadingCtrl: LoadingController, public dolphinService: DolphinProvider, public sanitization: DomSanitizer) {

    let loader = this.loadingCtrl.create({content: "Please wait..."});
    loader.present();

    this.dolphinService.dolphins().subscribe((resp) => {
      this.dolphins = resp.results
      loader.dismiss();
    }, (err) => {
      loader.dismiss();
      console.log(err)
    });
  }

}
