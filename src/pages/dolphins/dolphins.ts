import {Component} from '@angular/core';
import {
  ActionSheetController, IonicPage, Loading, LoadingController, ModalController, NavController, Platform, Refresher
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
  base64Image: string;

  constructor(public navCtrl: NavController, public dolphinService: DolphinProvider,
              public actionSheetCtrl: ActionSheetController, public alertService: AlertProvider,
              public paginationService: PaginationProvider, public modalCtrl: ModalController,
              public platform: Platform, public camera: Camera, public http: Http,
              public authService: AuthProvider, public loadingCtrl: LoadingController) {
    this.get();
    this.dolphinService.dolphinUpdate$.subscribe((data) => this.onDolphinUpdate(data));
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

  onDolphinUpdate(data: DolphinFile): void {
    this.dolphins.forEach((dolphin, index) => {
      if (dolphin.id == data.id) {
        this.dolphins[index] = data;
      }
    });
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

            this.uploadFile(this.cameraOptions);
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

            this.uploadFile(this.cameraOptions);
            return false
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

  public uploadFile(options: CameraOptions) {
    this.camera.getPicture(options).then(imageData => {
      // Loading
      let loader = this.loadingCtrl.create({content: "Uploading file..."});
      loader.present();

      // Base64 image
      this.base64Image = "data:image/jpeg;base64," + imageData;

      // File data
      fetch(this.base64Image).then((res) => {
        res.blob().then(file => {

          // File info required by backEnd
          let fileInfo = {
            file_name: new Date().getTime().toString() + ".jpeg",
            file_size: file.size,
            mime_type: file.type
          };

          // Upload to upload-url endpoint
          this.upload(fileInfo, file, loader);

        });
      });

    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }

  private upload(fileInfo: { file_name: string; file_size; mime_type }, file, loader: Loading) {
    this.dolphinService.uploadUrl(fileInfo).subscribe((resp) => {
      // Set file to fields
      resp.post_data.fields.file = file;

      let fields = resp.post_data.fields;
      // Create new FormData
      let formData = new FormData();

      // Append fields with values
      formData.append("acl", fields.acl);
      formData.append("Content-Type", fields["Content-Type"]);
      formData.append("key", fields.key);
      formData.append("AWSAccessKeyId", fields.AWSAccessKeyId);
      formData.append("policy", fields.policy);
      formData.append("signature", fields.signature);
      formData.append("file", fields.file, fileInfo.file_name);

      // Post to url given by backEnd
      this.uploadToStorage(resp, formData, fileInfo, fields, loader);

    }, (err) => {
      console.log(err)
    });
  }

  private uploadToStorage(resp, formData: FormData, fileInfo: { file_name: string; file_size; mime_type }, fields: any, loader: Loading) {
    this.http.post(resp.post_data.url, formData).subscribe(() => {
      console.log(`File uploaded ${fileInfo.file_name}`);

      // Payload required by backEnd
      let payload = {
        file_key: fields.key,
        site: this.authService.getCurrentSite().id
      };
      // Post to file endpoint
      this.uploadDolphin(payload, loader);

    }, (err) => {
      console.log(err);
      console.error(`Upload failed ${fileInfo.file_name}`);
    })
  }

  private uploadDolphin(payload: { file_key; site }, loader: Loading) {
    this.dolphinService.uploadDolphin(payload).subscribe((resp) => {
      this.dolphins.unshift(resp);
      loader.dismiss()
    }, (err) => {
      console.log(err);
      loader.dismiss()
    })
  }
}
