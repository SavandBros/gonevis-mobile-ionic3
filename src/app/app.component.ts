import {Component, ViewChild} from '@angular/core';
import {Config, Nav, Platform} from 'ionic-angular';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {EntrancePage} from '../pages/entrance/entrance';
import {AuthProvider} from '../providers/auth/auth-service';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core'
import {TutorialPage} from "../pages/tutorial/tutorial";
import {EntriesPage} from "../pages/entries/entries";
import {Account} from "../models/account";
import {TagsPage} from "../pages/tags/tags";
import {DolphinsPage} from "../pages/dolphins/dolphins";
import {SettingsPage} from "../pages/settings/settings";
import {SiteProvider} from "../providers/site/site";
import {ReaderPage} from "../pages/reader/reader";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  public rootPage: object;
  account: Account;
  currentSite: any;
  menuSide: string = "left";

  @ViewChild(Nav) nav: Nav;

  pages: any[];

  constructor(public translate: TranslateService, public platform: Platform,
              public authService: AuthProvider, private config: Config, private statusBar: StatusBar,
              private splashScreen: SplashScreen, public siteService: SiteProvider) {
    this.initTranslate();

    this.translate.get(['POSTS', 'TAGS', 'FILES', "READER", 'SETTINGS']).subscribe(values => {
      this.pages = [
        {title: values.POSTS, component: EntriesPage, icon: 'paper'},
        {title: values.TAGS, component: TagsPage, icon: 'pricetags'},
        {title: values.FILES, component: DolphinsPage, icon: 'images'},
        {title: values.READER, component: ReaderPage, icon: 'book'},
        {title: values.SETTINGS, component: SettingsPage, icon: 'settings'}
      ];
    });

    if (this.authService.isAuth()) {
      this.rootPage = EntriesPage;
    } else {
      this.rootPage = TutorialPage;
    }

    this.platform.ready().then((readySource: string) => {
      console.debug(readySource);
    });

    this.authService = authService;
    this.account = this.authService.getAuthUser(true);
    this.currentSite = this.authService.getCurrentSite();

    // Events
    this.authService.authenticated$.subscribe(() => this.onAuthenticate());
    this.authService.signOut$.subscribe(() => this.onSignOut());
    this.authService.currentSite$.subscribe(() => this.onCurrentSite());
    this.siteService.siteUpdated$.subscribe((data) => this.siteUpdated(data));

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      console.info(`Language change to ${event.lang}`);
      let element: HTMLElement = document.getElementById("lovelyMenu");

      if (event.lang == 'ar' || event.lang == 'fa') {
        this.platform.setDir('rtl', true);
        this.menuSide = 'right';
      } else {
        this.platform.setDir('ltr', true);
        this.menuSide = 'left';
      }

      element.setAttribute("side", this.menuSide);
      this.platform.setLang(event.lang, true);
    });
  }

  onAuthenticate(): void {
    this.account = this.authService.getAuthUser(true);
  }

  onSignOut(): void {
    this.authService.unAuth();
    this.nav.setRoot(EntrancePage);
  }


  onCurrentSite(): void {
    this.nav.setRoot(EntriesPage);
  }

  siteUpdated(data) {
    for (let site of this.account.user.sites) {
      if (site.id == this.currentSite.id) {
        site.title = data.title;
      }
    }
  }

  // TODO: We're not using this. should we remove ?
  ionViewDidLoad(): void {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  initTranslate(): void {
    this.translate.setDefaultLang('en');

    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use('en');
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  openPage(page): void {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
