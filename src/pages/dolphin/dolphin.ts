import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
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

  dolphin = <DolphinFile> JSON.parse(JSON.stringify(this.navParams.get("dolphin")));
  updating: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController, public dolphinService: DolphinProvider) {
  }

  update() {
    this.updating = true;
    let payload = {
      meta_data: {
        name: this.dolphin.metaData.name,
        description: this.dolphin.metaData.description
      }
    };

    this.dolphinService.update(this.dolphin.id, payload).subscribe((resp) => {
      this.updating = false;

      this.dolphin = resp;
      this.dismiss();
    }, (err) => {
      this.updating = false;
      console.log(err);
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
