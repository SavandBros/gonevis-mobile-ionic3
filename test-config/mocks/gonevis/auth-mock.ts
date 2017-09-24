import {EventEmitter} from "@angular/core";

export class AuthServiceProviderMock {
  public authenticated$: EventEmitter<null> = new EventEmitter();
  public signOut$: EventEmitter<null> = new EventEmitter();
  public currentSite$: EventEmitter<null> = new EventEmitter();

  getAuthUser(useInstance): boolean | any {
    return {'name': 'Alireza'}
  }

  isAuth(): boolean {
    if (localStorage.getItem("user")) {
      return true
    }

    return false;
  }

  getCurrentSite(): any {
    return {'site': 'currentSite', 'id': 'site-id'}
  }

}
