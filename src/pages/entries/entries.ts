import {Component} from '@angular/core';
import {IonicPage, NavController, ModalController, Refresher} from 'ionic-angular';
import {EntryProvider} from "../../providers/entry/entry";
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import {Entry} from "../../models/entry";
import {CommentModalPage} from "../comment-modal/comment-modal";
import {EntryPage} from "../entry/entry";
import {PaginationProvider} from "../../providers/pagination/pagination";
import {DolphinFile} from "../../models/dolphin-file";

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
  paginating: boolean;
  next: string;

  constructor(public navCtrl: NavController, public authService: AuthServiceProvider,
              public entryService: EntryProvider, public modalCtrl: ModalController, public paginationService: PaginationProvider) {
    this.get();
  }

  reloadPage(refresher): void {
    this.get(refresher);
  }

  get(refresh?: Refresher) {
    this.loading = true;

    this.entryService.entries().subscribe((resp) => {
      this.entries = resp.results;
      this.loading = false;

      if (refresh) {
        refresh.complete();
      }
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

  loadMore() {
    this.paginating = true;

    this.paginationService.paginate(this.next, DolphinFile).subscribe((resp) => {
      this.entries = this.entries.concat(resp.results);
      this.next = resp.next;
      this.paginating = false;
    }, (err) => {
      console.log(err)
    });
  }
}
