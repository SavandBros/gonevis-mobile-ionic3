import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {AlertController} from "ionic-angular";

/*
 Generated class for the AlertProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class AlertProvider {

  constructor(public alertCtrl: AlertController) {
  }

  createAlert(title: string, message: string, buttons: Array<object>) {
    let alert = this.alertCtrl.create({title: title, message: message, buttons: buttons});
    return alert.present();
  }
}
