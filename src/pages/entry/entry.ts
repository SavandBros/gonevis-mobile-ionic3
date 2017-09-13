import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Entry} from "../../models/entry";

/**
 * Generated class for the EntryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-entry',
  templateUrl: 'entry.html',
})
export class EntryPage {

  entry: Entry;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log(this.navParams.get("entry"));
    this.entry = this.navParams.get("entry");
  }

}
