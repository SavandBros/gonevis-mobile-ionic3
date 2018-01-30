import {Component} from '@angular/core';
import {
  AlertController, Events, IonicPage, LoadingController, NavController, NavParams, PopoverController,
  ToastController, ViewController
} from 'ionic-angular';
import {Entry} from "../../models/entry";
import {EntryProvider} from "../../providers/entry/entry";
import {AuthProvider} from "../../providers/auth/auth-service";
import {InAppBrowser} from '@ionic-native/in-app-browser';
import {CodekitProvider} from "../../providers/codekit/codekit";

@IonicPage()
@Component({
  selector: 'page-entry',
  templateUrl: 'entry.html',
})
export class EntryPage {
  entry: Entry;
  minDate: number;
  editing: boolean;
  content: string;
  updating: boolean;
  loading: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public entryService: EntryProvider, public authService: AuthProvider,
              public alertCtrl: AlertController, public events: Events,
              public toastCtrl: ToastController, public loadingCtrl: LoadingController,
              public popoverCtrl: PopoverController, public codekit: CodekitProvider) {
    this.minDate = new Date().getFullYear();

    if (this.navParams.get("entryId")) {
      this.get();
      this.editing = true;

    } else {
      this.editing = false;
      this.entry = new Entry({});
    }

    this.events.subscribe('entry:typing', (content) => {
      this.content = content;
    });

    events.subscribe('image:selected', (dolphin, source) =>  {
      this.entry.media[source] = dolphin ? dolphin : null;
      this.update(true);
    });

    this.codekit.onImageRemoved$.subscribe((image: string) => {
      this.entry.media[image] = null;
      this.update(true);
    });
  }

  get() {
    this.loading = true;
    this.entry = new Entry({});

    this.entryService.get(this.navParams.get("entryId")).subscribe((resp) => {
      this.entry = resp;
      this.content = this.entry.content;
      this.loading = false;
      document.getElementById("content").focus();

    }, (err) => {
      console.log(err);
      this.loading = false;
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
            text: 'Draft',
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

  update(updateImage?: boolean): void {
    this.updating = true;

    let payload: any = {
      id: this.entry.id,
      title: this.entry.title,
      content: this.entry.content = this.content,
      comment_enabled: this.entry.commentEnabled,
      featured: this.entry.featured,
      start_publication: this.entry.startPublication,
      status: this.entry.status,
      site: this.entry.site
    };

    if (updateImage) {
      payload.cover_image = this.entry.media.coverImage ? this.entry.media.coverImage.id : null;
    }

    this.entryService.update(payload).subscribe((resp) => {
      this.updating = false;
      this.entry.constStatus = resp.constStatus;
    }, (err) => {
      this.updating = false;
      console.log(err);
    });
  }


  create(isDraft?: boolean): void {
    this.entry.content = this.content;

    let payload: any = {
      content: this.entry.content = this.content,
      title: this.entry.title,
      status: this.entry.status,
      site: this.authService.getCurrentSite().id
    };

    if (isDraft) {
      payload.status = this.entry.status = 0;
    }

    this.entryService.create(payload).subscribe((resp) => {
      let toast = this.toastCtrl.create({
        message: isDraft ? `Post ${resp.title} saved as Draft` : `Post ${resp.title} created`,
        duration: 4000,
        position: 'bottom'
      });
      toast.present();

      this.navCtrl.pop();
    }, (err) => {
      console.log(err);
    });
  }

  remove() {
    let loader = this.loadingCtrl.create({content: "Please wait..."});
    loader.present();

    this.entryService.remove(this.entry.id).subscribe(() => {
      this.events.publish('entry:removed', this.entry.id);
      loader.dismiss();

      let toast = this.toastCtrl.create({
        message: `Post ${this.entry.title} Deleted.`,
        duration: 4000,
        position: 'bottom'
      });
      toast.present();

      this.navCtrl.pop();
    }, (err) => {
      console.log(err);
      loader.dismiss();
    });
  }

  popover(myEvent) {
    let params = {
      id: this.entry.id,
      absoluteURI: this.entry.getAbsoluteURI()
    };

    let popover = this.popoverCtrl.create(Options, {data: params});
    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(data => {
      if (data == "remove") {
        let alert = this.alertCtrl.create({
          title: "Are you sure?",
          message: "This action can not be undo.",
          buttons: [
            {text: 'Cancel', role: 'cancel'},
            {text: 'Delete', handler: () => this.remove()}
          ]
        });

        return alert.present();
      }
    })
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


@Component({
  template: `
    <ion-list no-margin no-lines>
      <button ion-item (click)="viewOnSite()">
        <ion-icon name="eye" item-start color="primary" small></ion-icon>
        View on site
      </button>
      <button ion-item (click)="close('remove')">
        <ion-icon name="trash" item-start color="danger" small></ion-icon>
        Delete
      </button>
    </ion-list>
  `
})
export class Options {
  private data: any;

  constructor(public navParams: NavParams, public viewCtrl: ViewController,
              public navCtrl: NavController, public iab: InAppBrowser) {
    this.data = navParams.get("data");
  }

  close(data?: string) {
    this.viewCtrl.dismiss(data);
  }

  viewOnSite() {
    this.close();
    this.iab.create(this.data.absoluteURI, '_system');
  }
}
