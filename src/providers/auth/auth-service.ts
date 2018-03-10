import {EventEmitter, Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';

import { Api } from '../api';
import {User} from '../../models/user';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthProvider {

  public authenticated$: EventEmitter<null> = new EventEmitter();
  public signOut$: EventEmitter<null> = new EventEmitter();
  public currentSite$: EventEmitter<object> = new EventEmitter();

  constructor(public http: Http, public api: Api) {}

  // If useInstance is true, user data should be an User model
  // Else return a normal user object
  getAuthUser(useInstance: boolean): User | any {
    if(!this.isAuth()) {
      return false;
    }

    useInstance = useInstance || false;
    let userData = JSON.parse(localStorage.getItem("user"));

    if(useInstance) {
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

  setCurrentSite(siteData: object): void {
    localStorage.setItem("site", JSON.stringify(siteData));
    this.currentSite$.emit(siteData);
  }

  getCurrentSite(): any {
    return JSON.parse(localStorage.getItem("site"));
  }

  signIn(username: string, password: string): any {
    return this.api.post("account/login/", {username: username, password: password})
      .map((res: Response) => {
        let data: any = res.json();

        if (res.status == 200) {
          this.setToken(data.token);
          this.setAuthUser(data.user);
          this.setCurrentSite(data.user.sites[0]);

          this.authenticated$.emit();
        }

        return data;
      }, err => {
        console.error('ERROR', err);
      });
  }

  signUp(payload: any): any {
    return this.api.post("account/register-account-only/", payload)
      .map((res: Response) => {
        return res.json();
      }, err => {
        console.error('ERROR', err);
      });
  }

  signOut(): void {
    this.unAuth();
    this.signOut$.emit();
  }
}
