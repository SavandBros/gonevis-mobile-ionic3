import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule, Http, RequestOptions, XHRBackend} from '@angular/http';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {Storage, IonicStorageModule} from '@ionic/storage';

import {MyApp} from './app.component';

import {LoginPage} from '../pages/login/login';
import {SignupPage} from '../pages/signup/signup';
import {TutorialPage} from '../pages/tutorial/tutorial';
import {EntrancePage} from '../pages/entrance/entrance';
import {EntriesPage} from "../pages/entries/entries";

import {Api} from '../providers/api';
import {Items} from '../mocks/providers/items';
import {Settings} from '../providers/settings';
import {User} from '../providers/user';

import {Camera} from '@ionic-native/camera';
import {GoogleMaps} from '@ionic-native/google-maps';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AuthServiceProvider} from '../providers/auth-service/auth-service';
import {DolphinProvider} from '../providers/dolphin/dolphin';
import {EntryProvider} from '../providers/entry/entry';
import {JwtInterceptorProvider} from '../providers/jwt-interceptor/jwt-interceptor';

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings(storage, {
    option1: true,
    option2: 'Ionitron J. Framework',
    option3: '3',
    option4: 'Hello'
  });
}

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    TutorialPage,
    EntrancePage,
    EntriesPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    TutorialPage,
    EntrancePage,
    EntriesPage
  ],
  providers: [
    Api,
    {
      provide: JwtInterceptorProvider,
      useFactory: (backend: XHRBackend, options: RequestOptions) => {
        return new JwtInterceptorProvider(backend, options);
      },
      deps: [XHRBackend, RequestOptions]
    },
    Items,
    User,
    Camera,
    GoogleMaps,
    SplashScreen,
    StatusBar,
    {provide: Settings, useFactory: provideSettings, deps: [Storage]},
    // Keep this to enable Ionic's runtime error handling during development
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    DolphinProvider,
    EntryProvider
  ]
})
export class AppModule {
}
