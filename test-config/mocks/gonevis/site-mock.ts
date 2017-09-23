import {EventEmitter} from "@angular/core";


export class SiteProviderMock {
  public siteUpdated$: EventEmitter<Account> = new EventEmitter();
}
