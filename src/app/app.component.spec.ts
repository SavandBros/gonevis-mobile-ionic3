///<reference path="../../node_modules/@types/jasmine/index.d.ts"/>

import {async, TestBed} from '@angular/core/testing';
import {IonicModule, Platform} from 'ionic-angular';
import {Storage} from '@ionic/storage';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {MyApp} from './app.component';
import {TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core";
import {AuthProvider} from "../providers/auth/auth-service";
import {SiteProvider} from "../providers/site/site";
import {TutorialPage} from "../pages/tutorial/tutorial";
import {EntriesPage} from "../pages/entries/entries";
import {Http} from "@angular/http";
import {HttpLoaderFactory} from "./app.module";
import {StatusBarMock} from "../../test-config/mocks/ionic/status-bar-mock";
import {PlatformMock} from "../../test-config/mocks/ionic/platform-mock";
import {SplashScreenMock} from "../../test-config/mocks/ionic/splash-screen-mock";
import {StorageMock} from "../../test-config/mocks/storage-mock";
import {TranslateServiceMock} from "../../test-config/mocks/gonevis/translate-mock";
import {AuthServiceProviderMock} from "../../test-config/mocks/gonevis/auth-mock";
import {SiteProviderMock} from "../../test-config/mocks/gonevis/site-mock";


describe('MyApp Component', () => {
  let fixture;
  let component: MyApp;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyApp],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }
        }),
        IonicModule.forRoot(MyApp),
      ],
      providers: [
        {provide: StatusBar, useClass: StatusBarMock},
        {provide: SplashScreen, useClass: SplashScreenMock},
        {provide: Platform, useClass: PlatformMock},
        {provide: TranslateService, useClass: TranslateServiceMock},
        {provide: Storage, useClass: StorageMock},
        {provide: AuthProvider, useClass: AuthServiceProviderMock},
        {provide: SiteProvider, useClass: SiteProviderMock}
      ]
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyApp);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component instanceof MyApp).toBe(true);
  });

  it('should have 4 pages', () => {
    expect(component.pages.length).toBe(4);
  });

  it('should set the default language to EN', () => {
    expect(component.translate.defaultLang).toBe('en');
  });

  it("should set the language to BroLang when browser lang is undefined", () => {
    let defaultLang: string = "BroLang";

    spyOn(localStorage, "getItem").and.returnValue(defaultLang);

    fixture = TestBed.createComponent(MyApp);
    component = fixture.componentInstance;

    expect(component.translate.getBrowserLang()).toEqual(defaultLang);
    expect(component.translate.defaultLang).toEqual(defaultLang);
  });

  it('should change rootPage to Tutorial when not authenticated', () => {
    expect(component.authService.isAuth()).toBeFalsy();
    expect(component.rootPage).toBe(TutorialPage);
  });

  it('should change rootPage to Entries when authenticated', () => {
    spyOn(localStorage, "getItem").and.callFake((key: string) => {
      return true;
    });

    fixture = TestBed.createComponent(MyApp);
    component = fixture.componentInstance;

    expect(component.authService.isAuth()).toBeTruthy();
    expect(component.rootPage).toBe(EntriesPage);
  });

  it('should change the platform direction when setting to FA or AR language', () => {
    let lang: string = 'fa';

    component.translate.onLangChange.emit({lang: lang, translations: lang});
    expect(component.platform.dir()).toEqual('rtl');
    expect(component.platform.lang()).toEqual(lang);
    expect(component.menuSide).toEqual('right');

    lang = 'en';

    component.translate.onLangChange.emit({lang: lang, translations: lang});
    expect(component.platform.dir()).toEqual('ltr');
    expect(component.platform.lang()).toEqual(lang);
    expect(component.menuSide).toEqual('left');

    lang = 'ar';

    component.translate.onLangChange.emit({lang: lang, translations: lang});
    expect(component.platform.dir()).toEqual('rtl');
    expect(component.platform.lang()).toEqual(lang);
    expect(component.menuSide).toEqual('right');
  })

});
