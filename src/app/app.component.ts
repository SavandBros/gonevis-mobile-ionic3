import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Config } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { EntrancePage } from '../pages/entrance/entrance';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { TranslateService } from '@ngx-translate/core'
import { TutorialPage } from "../pages/tutorial/tutorial";
import { EntriesPage } from "../pages/entries/entries";
import { Account } from "../models/account";
import {TagsPage} from "../pages/tags/tags";
import {DolphinsPage} from "../pages/dolphins/dolphins";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  public rootPage: object;
  authService: AuthServiceProvider;
  account: Account;
  storage;

  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    { title: 'Entries', component: EntriesPage, icon: 'list-box' },
    { title: 'Tags', component: TagsPage, icon: 'pricetags' },
    { title: 'Dolphins', component: DolphinsPage, icon: 'images' },
  ];

  constructor(private translate: TranslateService, storage: Storage, private platform: Platform, authService: AuthServiceProvider, private config: Config, private statusBar: StatusBar, private splashScreen: SplashScreen) {
    this.initTranslate();
    this.storage = storage;
    this.platform.ready().then(() => {
      if(authService.isAuth()) {
        this.rootPage = EntriesPage;
      } else {
        this.rootPage = TutorialPage;
      }
    });
    this.authService = authService;
    // Events
    this.authService.authenticated$.subscribe(() => this.onAuthenticate());
    this.authService.signOut$.subscribe(() => this.onSignOut());
    this.authService.currentSite$.subscribe(() => this.onCurrentSite());
    this.account = this.authService.getAuthUser(true);
  }

  onAuthenticate() {
    this.account = this.authService.getAuthUser(true);
  }

  onSignOut() {
    this.authService.unAuth();
    this.nav.setRoot(EntrancePage);
  }

  onCurrentSite() {
    this.nav.setRoot(EntriesPage);
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');

    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
