import {Component} from '@angular/core';
import {AlertController, Events, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
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
  content: string;
  updating: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public entryService: EntryProvider, public authService: AuthProvider,
              public alertCtrl: AlertController, public events: Events, public toastCtrl: ToastController) {

    if (this.navParams.get("entry")) {
      this.entry = <Entry> JSON.parse(JSON.stringify(this.navParams.get("entry")));
      this.editing = true;
      this.content = this.entry.content;
    } else {
      this.editing = false;
      this.entry = new Entry({});
      this.entry.site = this.authService.getCurrentSite().id;
    }

    this.events.subscribe('entry:typing', (content) => {
      this.content = content;
    });
  }

  save(): void {
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

  update(): void {
    this.entry.content = this.content;
    this.updating = true;

    this.entryService.update(this.entry).subscribe(() => {
      this.updating = false;
    }, (err) => {
      this.updating = false;
      console.log(err);
    });
  }


  create(isDraft?: boolean): void {
    this.entry.content = this.content;

    if (isDraft) {
      this.entry.status = 0;
    }

    this.entryService.create(this.entry).subscribe((resp) => {
      let toast = this.toastCtrl.create({
        message: isDraft ? `Post ${resp.title} saved as Draft`: `Post ${resp.title} created`,
        duration: 4000,
        position: 'bottom'
      });
      toast.present();

      this.navCtrl.pop();
    }, (err) => {
      console.log(err);
    });
  }

  dismiss(): void {
    if (!this.editing) {
      if (this.entry.title) {
        this.create(true);
      } else {
        this.navCtrl.pop();
      }
    } else {
      this.navCtrl.pop();
    }
  }
}
