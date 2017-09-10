import {EventEmitter, Injectable} from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

import { Api } from '../api';
import { Account } from '../../models/account';
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {

  public authenticated$: EventEmitter<null> = new EventEmitter();
  public signOut$: EventEmitter<null> = new EventEmitter();
  public currentSite$: EventEmitter<null> = new EventEmitter();
  storage: Storage;

  constructor(public http: Http, public api: Api, storage: Storage) {
    this.storage = storage;
    console.log('Hello AuthServiceProvider Provider');
  }

  getAuthUser(useInstance) {
    if(!this.isAuth()) {
      return false;
    }

    useInstance = useInstance || false;
    let userData = JSON.parse(localStorage.getItem("user"));

    if(useInstance) {
      return new Account(userData);
    }

    return userData;
  }

  unAuth() {
    localStorage.removeItem("JWT");
    localStorage.removeItem("user");
  }

  setToken(token: string) {
    localStorage.setItem("JWT", token);
  }


  getToken() {
    return localStorage.getItem("JWT");
  }

  isAuth(): boolean {
    if (!localStorage.getItem("user")) {
      this.unAuth();
      return false;
    }

    if (this.getToken() != "") {
      return true;
    }
  }

  setAuthUser(userData) {
    localStorage.setItem("user", JSON.stringify(userData));
    return this.getAuthUser(true);
  }

  setCurrentSite(siteData) {
    localStorage.setItem("site", JSON.stringify(siteData));
    this.currentSite$.emit();
  }

  getCurrentSite() {
    return JSON.parse(localStorage.getItem("site"));
  }

  login(payload: any) {
    let seq = this.api.post("account/login/", payload).share();

    seq
      .map(res => res.json())
      .subscribe(res => {
        if(res.status = "success") {
          this.setToken(res.token);
          this.setAuthUser(res.user);
          this.setCurrentSite(res.user.sites[0]);
          this.authenticated$.emit();
        }
      }, err => {
        console.error('ERROR', err);
      });

    return seq;
  }

  signOut() {
    this.unAuth();
    this.signOut$.emit();
  }
}