import {Component} from '@angular/core';
import {
  ActionSheetController, IonicPage, ModalController, NavController, Platform, Refresher
} from 'ionic-angular';
import {DolphinProvider} from "../../providers/dolphin/dolphin";
import {DolphinFile} from "../../models/dolphin-file";
import {AlertProvider} from "../../providers/alert/alert";
import {PaginationProvider} from "../../providers/pagination/pagination";
import {DolphinPage} from "../dolphin/dolphin";
import {Camera, CameraOptions} from '@ionic-native/camera';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {AuthProvider} from "../../providers/auth/auth-service";
import {PhotoViewer} from "@ionic-native/photo-viewer";

@IonicPage()
@Component({
  selector: 'page-dolphins',
  templateUrl: 'dolphins.html',
})
export class DolphinsPage {

  dolphins: Array<DolphinFile> = [];
  paginating: boolean;
  loading: boolean;
  next: string;
  cameraOptions: CameraOptions;

  constructor(public navCtrl: NavController, public dolphinService: DolphinProvider,
              public actionSheetCtrl: ActionSheetController, public alertService: AlertProvider,
              public paginationService: PaginationProvider, public modalCtrl: ModalController,
              public platform: Platform, public camera: Camera, public http: Http,
              public authService: AuthProvider, private photoViewer: PhotoViewer) {
    this.get();
    this.dolphinService.dolphinUpdate$.subscribe((data) => this.onDolphinUpdate(data));
    this.dolphinService.dolphinUploaded$.subscribe((data) => this.dolphins.unshift(data));
  }

  viewDolphin(url) {
    this.photoViewer.show(url);
  }

  reloadPage(refresher): void {
    this.get(refresher);
    this.loading = false;
  }

  get(refresh?: Refresher): void {
    this.loading = true;

    this.dolphinService.dolphins(5).subscribe((resp) => {
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

  options(dolphin: DolphinFile): void {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Options',
      buttons: [
        {
          text: 'Edit',
          icon: !this.platform.is('ios') ? 'create' : null,
          cssClass: 'action-icon-primary',
          handler: () => this.editDolphin(dolphin)
        },
        {
          text: 'Delete',
          icon: !this.platform.is('ios') ? 'trash' : null,
          role: 'Destructive',
          cssClass: 'action-icon-danger',
          handler: () => {
            actionSheet.dismiss();

            this.alertService.createAlert(
              'Are you sure?',
              'Remove this file permanently',
              [
                {text: 'Cancel', role: 'cancel'},
                {text: 'Delete', handler: () => this.delete(dolphin)}
              ]);

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

  editDolphin(dolphin: DolphinFile): void {
    let dolphinModal = this.modalCtrl.create(DolphinPage, {dolphin: dolphin});

    // Present modal
    dolphinModal.present();
  }

  delete(dolphin: DolphinFile): void {
    this.dolphinService.delete(dolphin.id).subscribe(() => {
      dolphin.isDeleted = true;
    }, (err) => {
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

  uploadType(): void {
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

  onDolphinUpdate(data: DolphinFile): void {
    this.dolphins.forEach((dolphin, index) => {
      if (dolphin.id == data.id) {
        this.dolphins[index] = data;
      }
    });
  }
}
