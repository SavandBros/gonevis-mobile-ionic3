import {EventEmitter} from "@angular/core";
import {Observer} from "rxjs/Observer";
import {LangChangeEvent} from "@ngx-translate/core";
import {Observable} from "rxjs/Observable";

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
    return localStorage.getItem("BROWSER_LANG") || "en";
  }

  use(lang: string): Observable<any> {
    this.onLangChange.emit({lang: lang, translations: lang});
    this.defaultLang = lang;
    return Observable.create((observer: Observer<any>) => {});
  }

  get(key: string | Array<string>, interpolateParams?: Object): Observable<string | any> {
    return Observable.of({});
  }
}
