import {EventEmitter, Injectable} from '@angular/core';
import {ActionSheetController, AlertController, ModalController, Platform} from "ionic-angular";
import {DolphinSelectionPage} from "../../pages/dolphin-selection/dolphin-selection";
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';

@Injectable()
export class CodekitProvider {
  public onImageRemoved$: EventEmitter<string> = new EventEmitter();

  constructor(public actionSheetCtrl: ActionSheetController, public platform: Platform,
              public alertCtrl: AlertController, public modalCtrl: ModalController, public sanitizer: DomSanitizer) {
  }

  bypassSecurityTrustStyle(coverImage: any): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(`url(${coverImage})`);
  }

  options(image: string, id?: string): void {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Options',
      buttons: [
        {
          text: 'Change',
          icon: !this.platform.is('ios') ? 'refresh' : null,
          cssClass: 'action-icon-primary',
          handler: () => this.selectImage(image, id)
        },
        {
          text: 'Remove',
          icon: !this.platform.is('ios') ? 'remove' : null,
          role: 'Destructive',
          cssClass: 'action-icon-danger',
          handler: () => {
            actionSheet.dismiss();

            let alert = this.alertCtrl.create({
              title: 'Are you sure?',
              message: null,
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel'
                },
                {
                  text: 'Delete', handler: () => this.onImageRemoved$.emit(image)
                }
              ]
            });
            alert.present();

            return false;
          }
        },
        {
          text: 'Cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          role: 'cancel'
        },
      ]
    });

    actionSheet.present();
  }

  selectImage(image: string, id: string): void | false {
    this.modalCtrl.create(DolphinSelectionPage, {source: image, id: id}).present();
  }
}
