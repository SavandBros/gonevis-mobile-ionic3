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
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AuthServiceProvider} from "../providers/auth-service/auth-service";
import {SiteProvider} from "../providers/site/site";

describe('MyApp Component', () => {
  let fixture;
  let component: MyApp;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyApp],
      imports: [
        TranslateModule.forRoot(),
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

  it('should change the platform direction when setting to FA or AR language', () => {
    component.translate.onLangChange.emit({lang: 'fa', translations: 'fa'});
    expect(component.platform.dir()).toEqual('rtl');

    component.translate.onLangChange.emit({lang: 'en', translations: 'en'});
    expect(component.platform.dir()).toEqual('ltr');

    component.translate.onLangChange.emit({lang: 'ar', translations: 'ar'});
    expect(component.platform.dir()).toEqual('rtl');
  })

});
