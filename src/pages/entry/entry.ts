import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Entry} from "../../models/entry";
import {EntryProvider} from "../../providers/entry/entry";
import {AuthProvider} from "../../providers/auth/auth-service";

@IonicPage()
@Component({
  selector: 'page-entry',
  templateUrl: 'entry.html',
})
export class EntryPage {
  entry: Entry;
  editing: boolean;
  submitText: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public entryService: EntryProvider, public authService: AuthProvider) {

    if (this.navParams.get("entry")) {
      this.entry = <Entry> JSON.parse(JSON.stringify(this.navParams.get("entry")));
      this.editing = true;
      this.submitText = "Update";
    } else {
      this.editing = false;
      this.submitText = "Publish";
      this.entry = new Entry({});
      this.entry.site = this.authService.getCurrentSite().id;
    }
  }

  save() {
    if (this.editing) {
      this.update();
    } else {
      this.create();
    }
  }

  update() {
    this.entryService.update(this.entry).subscribe((resp) => {
      console.log(resp);
    }, (err) => {
      console.log(err);
    });
  }


  create() {

    this.entryService.create(this.entry).subscribe((resp) => {
      this.navCtrl.pop();

    }, (err) => {
      console.log(err);
    });
  }
}
