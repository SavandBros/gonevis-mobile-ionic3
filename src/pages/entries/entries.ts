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
  loading: boolean;

  constructor(public navCtrl: NavController, public authService: AuthServiceProvider,
              public entryService: EntryProvider, public loadingCtrl: LoadingController,
              public modalCtrl: ModalController) {
    this.get();
  }

  get() {
    this.loading = true;

    this.entryService.entries().subscribe((resp) => {
      this.entries = resp.results;
      this.loading = false;
    }, (err) => {
      this.loading = false;
      console.log(err)
    });
  }

  presentCommentModal(entry: Entry): void{
    let commentModal = this.modalCtrl.create(CommentModalPage, { entry: entry });
    commentModal.present();
  }

  editEntry(entry: Entry): void {
    this.navCtrl.push(EntryPage, { entry: entry });
  }
}

