import {Component} from '@angular/core';
import {Events, IonicPage, ModalController, NavController, Refresher} from 'ionic-angular';
import {EntryProvider} from "../../providers/entry/entry";
import {AuthProvider} from "../../providers/auth/auth-service";
import {Entry} from "../../models/entry";
import {CommentModalPage} from "../comment-modal/comment-modal";
import {EntryPage} from "../entry/entry";
import {PaginationProvider} from "../../providers/pagination/pagination";
import {DolphinFile} from "../../models/dolphin-file";


@IonicPage()
@Component({
  selector: 'page-entries',
  templateUrl: 'entries.html',
})
export class EntriesPage {
  entries: Array<Entry> = [];
  loading: boolean;
  paginating: boolean;
  next: string;
  searchQuery: string = '';
  searchResult: boolean = true;

  constructor(public navCtrl: NavController, public authService: AuthProvider,
              public entryService: EntryProvider, public modalCtrl: ModalController,
              public paginationService: PaginationProvider, public events: Events) {
    this.get();

    this.entryService.entryCreated$.subscribe((entry: Entry) => this.entries.unshift(entry));
    this.entryService.entryUpdated$.subscribe((updatedEntry: Entry) => {
      this.entries.forEach((entry: Entry, index: number) => {
        if (entry.id == updatedEntry.id) {
          this.entries[index] = updatedEntry;
        }
      });
    });
    this.events.subscribe("entry:removed", (id: string) => {
      this.entries.forEach((entry: Entry, index: number) => {
        if (entry.id == id) {
          this.entries.splice(index, 1);
        }
      });
    });
  }

  reloadPage(refresher): void {
    this.get(refresher);
    this.loading = false;
    this.searchResult = true;
    this.searchQuery = '';
  }

  get(refresh?: Refresher): void {
    this.loading = true;

    this.entryService.all().subscribe((resp) => {
      this.entries = resp.results;
      this.loading = false;
      this.next = resp.next;

      if (refresh) {
        refresh.complete();
      }
    }, (err) => {
      this.loading = false;
      console.log(err)
    });
  }

  presentCommentModal(entry: Entry): void {
    let commentModal = this.modalCtrl.create(CommentModalPage, {entry: entry});
    commentModal.present();
  }

  entryPage(id?: string): void {
    this.navCtrl.push(EntryPage, {entryId: id});
  }

  loadMore(): void {
    this.paginating = true;

    this.paginationService.paginate(this.next, DolphinFile).subscribe((resp) => {
      this.entries = this.entries.concat(resp.results);
      this.next = resp.next;
      this.paginating = false;
    }, (err) => {
      console.log(err)
    });
  }

  search(event) {
    let params: Map<string, string> = new Map();
    params.set("search", event.target.value);

    this.entryService.all(params).subscribe((resp) => {
      this.entries = resp.results;
      this.searchResult = !!resp.count;

    }, (err) => {
      this.loading = false;
      console.log(err)
    });
  }
}
