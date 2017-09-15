import { Component } from '@angular/core';
import {
  ActionSheetController, Alert, AlertController, IonicPage, LoadingController, ModalController, NavController,
  NavParams
} from 'ionic-angular';
import {DolphinProvider} from "../../providers/dolphin/dolphin";
import {DolphinFile} from "../../models/dolphin-file";
import {AlertProvider} from "../../providers/alert/alert";
import {PaginationProvider} from "../../providers/pagination/pagination";
import {DolphinPage} from "../dolphin/dolphin";

/**
 * Generated class for the DolphinsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dolphins',
  templateUrl: 'dolphins.html',
})
export class DolphinsPage {

  dolphins: Array<DolphinFile> = [];
  paginating: boolean;
  next: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public loadingCtrl: LoadingController, public dolphinService: DolphinProvider,
              public actionSheetCtrl: ActionSheetController, public alertService: AlertProvider,
              public paginationService: PaginationProvider, public modalCtrl: ModalController) {

    this.paginating = false;
    let loader = this.loadingCtrl.create({content: "Please wait..."});
    loader.present();

    this.dolphinService.dolphins().subscribe((resp) => {
      this.dolphins = resp.results;
      this.next = resp.next;
      loader.dismiss();
    }, (err) => {
      loader.dismiss();
      console.log(err)
    });
  }

  options(dolphin) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Options',
      buttons: [
        {
          text: 'Edit',
          icon: 'create',
          cssClass: 'action-icon-primary',
          handler: () => this.editDolphin(dolphin)
        },
        {
          text: 'Delete',
          icon: 'trash',
          cssClass: 'action-icon-danger',
          handler: () => {
            actionSheet.dismiss();

            this.alertService.createAlert(
              'Are you sure?',
              'Do you wish to delete this file?',
              [
                {text: 'Cancel', role: 'cancel'},
                {text: 'Yes', handler: () => this.delete(dolphin)}
              ]);

            return false;
          }
        }
      ]
    });

    actionSheet.present();
  }

  editDolphin(dolphin: DolphinFile) {
    let dolphinModal = this.modalCtrl.create(DolphinPage, { dolphin: dolphin });

    // Set new data on modal dismiss.
    dolphinModal.onDidDismiss(data => {
      for (let dolphin of this.dolphins) {
        if (data.id == dolphin.id) {
          dolphin = data;
        }
      }
    });

    // Present modal
    dolphinModal.present();
  }

  delete(dolphin) {
    this.dolphinService.delete(dolphin.id).subscribe(() => {
      dolphin.isDeleted = true;
    }, (err) => {
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

}
