import {Component} from '@angular/core';
import {IonicPage, NavController, Refresher} from 'ionic-angular';
import {ReaderProvider} from "../../providers/reader/reader";
import {Reader} from "../../models/reader";
import {PaginationProvider} from "../../providers/pagination/pagination";
import {DolphinFile} from "../../models/dolphin-file";
import {EntryProvider} from "../../providers/entry/entry";

@IonicPage()
@Component({
  selector: 'page-reader',
  templateUrl: 'reader.html',
})
export class ReaderPage {

  readers: Array<Reader> = [];
  loading: boolean;
  paginating: boolean;
  next: string;

  constructor(public navCtrl: NavController, public readerService: ReaderProvider,
              public paginationService: PaginationProvider, public entryService: EntryProvider) {
    this.get();
  }

  reloadPage(refresher): void {
    this.get(refresher);
    this.loading = false;
  }

  get(refresh?: Refresher): void {
    this.loading = true;

    this.readerService.all().subscribe((resp) => {
      this.readers = resp.results;
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

  vote(reader: Reader): void {
    this.entryService.vote(reader.id).subscribe((resp) => {
      if (resp.created) {
        reader.voteCount++;
      } else {
        reader.voteCount--;
      }

    }, (err) => {
      console.log(err);
    });
  }

  loadMore(): void {
    this.paginating = true;

    this.paginationService.paginate(this.next, DolphinFile).subscribe((resp) => {
      this.readers = this.readers.concat(resp.results);
      this.next = resp.next;
      this.paginating = false;
    }, (err) => {
      console.log(err)
    });
  }
}
