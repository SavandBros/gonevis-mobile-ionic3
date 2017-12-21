import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {Api} from "../api";
import {AuthProvider} from "../auth/auth-service";

@Injectable()
export class UserProvider {

  constructor(public http: Http, public api: Api, public authService: AuthProvider) {}

  get() {
    return this.api.get(`account/users/${this.authService.getAuthUser(true).id}/`)
      .map((res: Response) => {
        return res.json();
      });
  }

  update(payload: object) {
    return this.api.put("account/update-profile/", payload)
      .map((res: Response) => {
        console.log(res.json());

        return res.json();
      });
  }

}
