import {Component} from '@angular/core';
import {Events, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {DolphinFile} from "../../models/dolphin-file";
import {DolphinProvider} from "../../providers/dolphin/dolphin";
import {PaginationProvider} from "../../providers/pagination/pagination";

/**
 * Generated class for the DolphinSelectionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dolphin-selection',
  templateUrl: 'dolphin-selection.html',
})
export class DolphinSelectionPage {

  files: string;
  source: string;
  dolphins: Array<DolphinFile> = [];
  paginating: boolean;
  loading: boolean;
  next: string;

  constructor(public navCtrl: NavController, public dolphinService: DolphinProvider,
              public paginationService: PaginationProvider, public params: NavParams,
              public viewCtrl: ViewController, public events: Events) {
    this.files = 'files';
    this.getDolphins();
    this.source = this.params.get("source");
  }

  getDolphins() {
    this.loading = true;

    this.dolphinService.dolphins().subscribe((resp) => {
      this.loading = false;
      this.dolphins = resp.results;
      this.next = resp.next;

    }, (err) => {
      this.loading = false;
      console.log(err)
    });
  }

  loadMore() {
    this.paginating = true;

    this.paginationService.paginate(this.next, DolphinFile).subscribe((resp) => {
      this.dolphins = this.dolphins.concat(resp.results);
      this.next = resp.next;
      this.paginating = false;
    }, (err) => {
      console.log(err)
    });
  }

  select(dolphin: DolphinFile | null): void {
    this.events.publish('image:selected', dolphin, this.source);
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
