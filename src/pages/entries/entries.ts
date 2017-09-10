import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {EntryProvider} from "../../providers/entry/entry";
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import {Entry} from "../../models/entry";

/**
 * Generated class for the EntriesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-entries',
  templateUrl: 'entries.html',
})
export class EntriesPage {

  entries: Array<Entry>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public authService: AuthServiceProvider, public entryService: EntryProvider,
              public loadingCtrl: LoadingController) {
    let loader = this.loadingCtrl.create({content: "Please wait..."});
    loader.present();
    this.entryService.entries().subscribe((resp) => {
      this.entries = resp.results;
      loader.dismiss();
    }, (err) => {
      loader.dismiss();
      console.log(err)
    });
  }
}

