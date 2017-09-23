import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";
import {EventEmitter} from "@angular/core";
import {LangChangeEvent} from "@ngx-translate/core";
import {DocumentDirection} from "ionic-angular/platform/platform";


export class PlatformMock {
  private _dir: DocumentDirection;
  private _lang: string;

  public ready(): Promise<string> {
    return new Promise((resolve) => {
      resolve('READY');
    });
  }

  setLang(lang: string, updateDocument: boolean): void {
    this._lang = lang;
  }

  lang(): string {
    return this._lang;
  }

  setDir(dir: DocumentDirection, updateDocument: boolean): void {
    this._dir = dir;
  }

  dir(): DocumentDirection {
    return this._dir;
  }

  public getQueryParam() {
    return true;
  }

  public registerBackButtonAction(fn: Function, priority?: number): Function {
    return (() => true);
  }

  public hasFocus(ele: HTMLElement): boolean {
    return true;
  }

  public doc(): HTMLDocument {
    return document;
  }

  public is(): boolean {
    return true;
  }

  public getElementComputedStyle(container: any): any {
    return {
      paddingLeft: '10',
      paddingTop: '10',
      paddingRight: '10',
      paddingBottom: '10',
    };
  }

  public onResize(callback: any) {
    return callback;
  }

  public registerListener(ele: any, eventName: string, callback: any): Function {
    return (() => true);
  }

  public win(): Window {
    return window;
  }

  public raf(callback: any): number {
    return 1;
  }

  public timeout(callback: any, timer: number): any {
    return setTimeout(callback, timer);
  }

  public cancelTimeout(id: any) {
    // do nothing
  }

  public getActiveElement(): any {
    return document['activeElement'];
  }
}

export class StatusBarMock extends StatusBar {
  styleDefault() {
    return;
  }
}

export class SplashScreenMock extends SplashScreen {
  hide() {
    return;
  }
}

export class NavMock {

  public pop(): any {
    return new Promise(function (resolve: Function): void {
      resolve();
    });
  }

  public push(): any {
    return new Promise(function (resolve: Function): void {
      resolve();
    });
  }

  public getActive(): any {
    return {
      'instance': {
        'model': 'something',
      },
    };
  }

  public setRoot(): any {
    return true;
  }

  public registerChildNav(nav: any): void {
    return;
  }

}

export class DeepLinkerMock {

}

export class TranslateServiceMock {
  defaultLang: string;
  private _onLangChange: EventEmitter<LangChangeEvent> = new EventEmitter<LangChangeEvent>();


  setDefaultLang(lang: string): void {
    this.defaultLang = lang;
  }

  get onLangChange(): EventEmitter<LangChangeEvent> {
    return this._onLangChange
  }

  getBrowserLang(): string {
    return 'EN'
  }

  use(lang: string): Observable<any> {
    return Observable.create((observer: Observer<any>) => {});
  }

  get(key: string | Array<string>, interpolateParams?: Object): Observable<string | any> {
    return Observable.of({});
  }
}

export class StorageMock {}

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
    return {'site': 'currentSite'}
  }

}

export class SiteProviderMock {
  public siteUpdated$: EventEmitter<Account> = new EventEmitter();
}
