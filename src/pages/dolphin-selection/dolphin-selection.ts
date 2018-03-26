import {Component} from '@angular/core';
import {
  ActionSheetController, Events, IonicPage, NavController, NavParams, Platform, Refresher,
  ViewController
} from 'ionic-angular';
import {DolphinFile} from "../../models/dolphin-file";
import {DolphinProvider} from "../../providers/dolphin/dolphin";
import {PaginationProvider} from "../../providers/pagination/pagination";
import {Camera, CameraOptions} from "@ionic-native/camera";

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
  cameraOptions: CameraOptions;

  constructor(public navCtrl: NavController, public dolphinService: DolphinProvider,
              public paginationService: PaginationProvider, public params: NavParams,
              public viewCtrl: ViewController, public events: Events,
              public actionSheetCtrl: ActionSheetController, public camera: Camera,
              public platform: Platform) {
    this.files = 'files';
    this.getDolphins();
    this.source = this.params.get("source");

    this.dolphinService.dolphinUploaded$.subscribe((data) => {
      this.select(data);
      this.dolphins.unshift(data);
    });
  }

  reloadPage(refresher): void {
    this.getDolphins(refresher);
    this.loading = false;
  }

  getDolphins(refresh?: Refresher): void {
    this.loading = true;

    this.dolphinService.dolphins().subscribe((resp) => {
      this.loading = false;
      this.dolphins = resp.results;
      this.next = resp.next;

      if (refresh) {
        refresh.complete();
      }
    }, (err) => {
      this.loading = false;
      console.log(err)
    });
  }

  loadMore(): void {
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
    let topic: string = "gonevisMobile.DolphinSelection:selected";
    if (this.params.get("id")) topic = topic + ` ${this.params.get("id")}`;

    this.events.publish(topic, dolphin, this.source);
    this.dismiss();
  }

  dismiss(): void {
    this.viewCtrl.dismiss();
  }

  uploadType(): void | false {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select',
      buttons: [
        {
          text: 'Camera',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            actionSheet.dismiss();

            // From Camera
            this.cameraOptions = {
              quality: 80,
              destinationType: this.camera.DestinationType.DATA_URL,
              sourceType: this.camera.PictureSourceType.CAMERA,
              allowEdit: true,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE
            };

            this.dolphinService.uploadFile(this.cameraOptions);
            return false;
          }
        },
        {
          text: 'Photo Library',
          icon: !this.platform.is('ios') ? 'images' : null,
          handler: () => {
            actionSheet.dismiss();

            // From Library
            this.cameraOptions = {
              quality: 80,
              destinationType: this.camera.DestinationType.DATA_URL,
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
              encodingType: this.camera.EncodingType.JPEG,
              saveToPhotoAlbum: false
            };

            this.dolphinService.uploadFile(this.cameraOptions);
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
}
