import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Http, HttpModule, RequestOptions, XHRBackend} from '@angular/http';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {IonicStorageModule, Storage} from '@ionic/storage';

import {MyApp} from './app.component';

import {LoginPage} from '../pages/login/login';
import {SignupPage} from '../pages/signup/signup';
import {TutorialPage} from '../pages/tutorial/tutorial';
import {EntrancePage} from '../pages/entrance/entrance';
import {EntriesPage} from "../pages/entries/entries";
import {EntryPage} from "../pages/entry/entry";
import {TagsPage} from "../pages/tags/tags";
import {TagPage} from "../pages/tag/tag";
import {DolphinsPage} from "../pages/dolphins/dolphins";
import {DolphinPage} from "../pages/dolphin/dolphin";
import {DolphinSelectionPage} from '../pages/dolphin-selection/dolphin-selection';
import {ProfilePage} from '../pages/profile/profile';

import {Api} from '../providers/api';
import {Settings} from '../providers/settings';

import {Camera} from '@ionic-native/camera';
import {GoogleMaps} from '@ionic-native/google-maps';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {PhotoViewer} from '@ionic-native/photo-viewer';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AuthProvider} from '../providers/auth/auth-service';
import {DolphinProvider} from '../providers/dolphin/dolphin';
import {EntryProvider} from '../providers/entry/entry';
import {JwtInterceptorProvider} from '../providers/jwt-interceptor/jwt-interceptor';
import {CommentProvider} from '../providers/comment/comment';
import {CommentModalPage} from "../pages/comment-modal/comment-modal";
import {TagProvider} from '../providers/tag/tag';
import {AlertProvider} from '../providers/alert/alert';
import {PaginationProvider} from '../providers/pagination/pagination';
import {SettingsPage} from "../pages/settings/settings";
import {SiteProvider} from '../providers/site/site';
import {BaseModelProvider} from '../providers/base-model/base-model';
import {EditorComponent} from "../components/editor/editor";
import {ReaderProvider} from '../providers/reader/reader';
import {ReaderPage} from "../pages/reader/reader";

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
    EntriesPage,
    CommentModalPage,
    EntryPage,
    TagsPage,
    TagPage,
    DolphinsPage,
    DolphinPage,
    SettingsPage,
    DolphinSelectionPage,
    EditorComponent,
    ReaderPage,
    ProfilePage
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
    EntriesPage,
    CommentModalPage,
    EntryPage,
    TagsPage,
    TagPage,
    DolphinsPage,
    DolphinPage,
    SettingsPage,
    DolphinSelectionPage,
    EditorComponent,
    ReaderPage,
    ProfilePage
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
    Camera,
    GoogleMaps,
    SplashScreen,
    StatusBar,
    PhotoViewer,
    {provide: Settings, useFactory: provideSettings, deps: [Storage]},
    // Keep this to enable Ionic's runtime error handling during development
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    DolphinProvider,
    CommentProvider,
    TagProvider,
    AlertProvider,
    PaginationProvider,
    SiteProvider,
    BaseModelProvider,
    EntryProvider,
    ReaderProvider,
  ]
})
export class AppModule {
}
