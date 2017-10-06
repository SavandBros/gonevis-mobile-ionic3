import {Injectable, EventEmitter} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {DolphinFile} from "../../models/dolphin-file";
import {Api} from "../api";
import {AuthProvider} from "../auth/auth-service";
import 'rxjs/add/operator/map';
import {Loading, LoadingController} from "ionic-angular";
import {Camera, CameraOptions} from "@ionic-native/camera";

/*
 Generated class for the DolphinProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class DolphinProvider {

  public dolphinUpdate$: EventEmitter<DolphinFile> = new EventEmitter();
  public dolphinUploaded$: EventEmitter<DolphinFile> = new EventEmitter();

  base64Image: string;

  constructor(public api: Api, public authService: AuthProvider,
              public http: Http, public camera: Camera, public loadingCtrl: LoadingController) {
  }

  dolphins(limit?: number) {
    return this.api.get("dolphin/file/", {site: this.authService.getCurrentSite().id, limit: limit})
      .map((res: Response) => {
        let data = res.json();
        let dolphins: Array<DolphinFile> = [];

        for (let file of data.results) {
          dolphins.push(new DolphinFile(file));
        }

        data.results = dolphins;
        return data;
      });
  }

  update(id: string, dolphin: any) {
    return this.api.put(`dolphin/file/${id}/`, dolphin, {siteId: this.authService.getCurrentSite().id})
      .map((res: Response) => {
        let data = res.json();

        data = new DolphinFile(data);
        this.dolphinUpdate$.emit(data);
        return data;
      });
  }

  delete(id: string) {
    return this.api.delete(`dolphin/file/${id}/`, {siteId: this.authService.getCurrentSite().id}).map(() => {
    });
  }

  uploadUrl(payload: any) {
    return this.api.post("website/site/" + this.authService.getCurrentSite().id + "/upload-url/", payload)
      .map((res: Response) => {
        let data = res.json();
        console.log(data);
        return data;
      });
  }

  upload(payload: any) {
    return this.api.post("dolphin/file/", payload)
      .map((res: Response) => {
        let data = res.json();
        data = new DolphinFile(data);

        return data;
      });
  }

  uploadFile(options: CameraOptions) {
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
          this.uploadToUrl(fileInfo, file, loader);

        });
      });

    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }

  private uploadToUrl(fileInfo: { file_name: string; file_size; mime_type }, file, loader: Loading) {
    this.uploadUrl(fileInfo).subscribe((resp) => {
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
    this.upload(payload).subscribe((resp) => {
      this.dolphinUploaded$.emit(resp);
      loader.dismiss();
    }, (err) => {
      console.log(err);
      loader.dismiss()
    })
  }
}
