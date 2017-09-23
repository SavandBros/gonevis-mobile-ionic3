///<reference path="../../node_modules/@types/jasmine/index.d.ts"/>

import {async, TestBed} from '@angular/core/testing';
import {IonicModule, Platform} from 'ionic-angular';
import {Storage} from '@ionic/storage';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {MyApp} from './app.component';
import {
  AuthServiceProviderMock,
  PlatformMock,
  SiteProviderMock,
  SplashScreenMock,
  StatusBarMock,
  StorageMock,
  TranslateServiceMock
} from '../../test-config/mocks-ionic';
import {TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core";
import {AuthServiceProvider} from "../providers/auth-service/auth-service";
import {SiteProvider} from "../providers/site/site";
import {TutorialPage} from "../pages/tutorial/tutorial";
import {EntriesPage} from "../pages/entries/entries";
import {Http} from "@angular/http";
import {HttpLoaderFactory} from "./app.module";

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
        {provide: AuthServiceProvider, useClass: AuthServiceProviderMock},
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
