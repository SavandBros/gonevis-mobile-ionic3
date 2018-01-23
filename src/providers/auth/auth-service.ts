import {EventEmitter, Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {Api} from '../api';
import {User} from '../../models/user';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthProvider {

  public authenticated$: EventEmitter<null> = new EventEmitter();
  public signOut$: EventEmitter<null> = new EventEmitter();
  public currentSite$: EventEmitter<null> = new EventEmitter();

  constructor(public http: Http, public api: Api) {
  }

  // If useInstance is true, user data should be an User model
  // Else return a normal user object
  getAuthUser(useInstance: boolean): User | any {
    if (!this.isAuth()) {
      return false;
    }

    useInstance = useInstance || false;
    let userData = JSON.parse(localStorage.getItem("user"));

    if (useInstance) {
      return new User(userData);
    }

    return userData;
  }

  unAuth(): void {
    localStorage.removeItem("JWT");
    localStorage.removeItem("user");
  }

  setToken(token: string): void {
    localStorage.setItem("JWT", token);
  }


  getToken(): string {
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

  setAuthUser(userData: any, separateSites?: boolean): User {
    // Separated sites
    if (separateSites) {
      userData.sites = this.getAuthUser(true).sites;
    }

    localStorage.setItem("user", JSON.stringify(userData));

    return this.getAuthUser(true);
  }

  setCurrentSite(siteData): void {
    localStorage.setItem("site", JSON.stringify(siteData));
    this.currentSite$.emit();
  }

  getCurrentSite(): any {
    return JSON.parse(localStorage.getItem("site"));
  }

  login(payload: any) {
    let seq = this.api.post("account/login/", payload).share();

    seq
      .map(res => res.json())
      .subscribe(res => {
        if (res.status = "success") {
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

  signOut(): void {
    this.unAuth();
    this.signOut$.emit();
  }
}
