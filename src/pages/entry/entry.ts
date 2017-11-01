import {Component} from '@angular/core';
import {AlertController, Events, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {Entry} from "../../models/entry";
import {EntryProvider} from "../../providers/entry/entry";
import {AuthProvider} from "../../providers/auth/auth-service";
import {noUndefined} from "@angular/compiler/src/util";
import {AlertProvider} from "../../providers/alert/alert";

@IonicPage()
@Component({
  selector: 'page-entry',
  templateUrl: 'entry.html',
})
export class EntryPage {
  entry: Entry;
  editing: boolean;
  submitText: string;
  content: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public entryService: EntryProvider, public authService: AuthProvider,
              public alertCtrl: AlertController, public events: Events, public toastCtrl: ToastController) {

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

    this.events.subscribe('entry:typing', (content) => {
      this.content = content;
    });
  }

  save() {
    if (this.editing) {
      this.update();
    } else {
      const alert = this.alertCtrl.create({
        title: 'Publish this post?',
        message: 'Are you ready to publish this post?',
        buttons: [
          {
            text: 'Not Yet',
            handler: () => {
              this.entry.status = 0;
              this.create();
            }
          },
          {
            text: 'Publish',
            handler: () => {
              this.entry.status = 1;
              this.create();
            }
          }
        ]
      });
      alert.present();
    }
  }

  update() {
    this.entry.content = this.content;

    this.entryService.update(this.entry).subscribe((resp) => {
      console.log(resp);
    }, (err) => {
      console.log(err);
    });
  }


  create() {
    this.entry.content = this.content;

    this.entryService.create(this.entry).subscribe((resp) => {
      let toast = this.toastCtrl.create({
        message: `Post ${resp.title} created`,
        duration: 4000,
        position: 'bottom'
      });
      toast.present();

      this.navCtrl.pop();
    }, (err) => {
      console.log(err);
    });
  }
}
