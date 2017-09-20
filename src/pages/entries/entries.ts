import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, ModalController} from 'ionic-angular';
import {EntryProvider} from "../../providers/entry/entry";
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import {Entry} from "../../models/entry";
import {CommentModalPage} from "../comment-modal/comment-modal";
import {EntryPage} from "../entry/entry";

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

  constructor(public navCtrl: NavController, public authService: AuthServiceProvider,
              public entryService: EntryProvider, public loadingCtrl: LoadingController,
              public modalCtrl: ModalController) {
    let loader = this.loadingCtrl.create({content: "Please wait..."});
    loader.present();

    this.entryService.all().subscribe((resp) => {
      console.log(resp);
      this.entries = resp.results;
      loader.dismiss();
    }, (err) => {
      loader.dismiss();
      console.log(err)
    });
  }

  presentCommentModal(entry: Entry) {
    let commentModal = this.modalCtrl.create(CommentModalPage, { entry: entry });
    commentModal.present();
  }

  editEntry(entry: Entry) {
    this.navCtrl.push(EntryPage, { entry: entry });
  }
}

