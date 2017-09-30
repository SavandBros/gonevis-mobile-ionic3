import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Entry} from "../../models/entry";


@IonicPage()
@Component({
  selector: 'page-entry',
  templateUrl: 'entry.html',
})
export class EntryPage {
  entry: Entry;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.entry = this.navParams.get("entry");
  }
}
