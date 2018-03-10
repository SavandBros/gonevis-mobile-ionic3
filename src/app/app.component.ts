import {Component, ViewChild} from '@angular/core';
import {Config, Events, Nav, Platform} from 'ionic-angular';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {AuthProvider} from '../providers/auth/auth-service';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core'
import {TutorialPage} from "../pages/tutorial/tutorial";
import {EntriesPage} from "../pages/entries/entries";
import {User} from "../models/user";
import {TagsPage} from "../pages/tags/tags";
import {DolphinsPage} from "../pages/dolphins/dolphins";
import {SettingsPage} from "../pages/settings/settings";
import {SiteProvider} from "../providers/site/site";
import {ReaderPage} from "../pages/reader/reader";
import {ProfilePage} from "../pages/profile/profile";
import {SigninPage} from "../pages/signin/signin";
import {SiteNewPage} from "../pages/site-new/site-new";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  public rootPage: any;
  user: User;
  menuSide: string = "left";

  @ViewChild(Nav) nav: Nav;

  pages: any[];

  constructor(public translate: TranslateService, public platform: Platform,
              public authService: AuthProvider, private config: Config, private statusBar: StatusBar,
              private splashScreen: SplashScreen, public siteService: SiteProvider,
              public events: Events) {
    this.user = this.authService.getAuthUser(true);
    this.initTranslate();
    this.setCurrentView("EntriesPage");

    if (this.authService.isAuth()) {
      console.log(this.user.getSites());
      if (this.user.getSites().length > 0) {
        this.rootPage = EntriesPage;
      } else {
        this.rootPage = SiteNewPage;
      }
    } else {
      this.rootPage = TutorialPage;
    }

    this.translate.get(['POSTS', 'TAGS', 'FILES', "READER", 'SETTINGS']).subscribe(values => {
      this.pages = [
        {title: values.POSTS, component: EntriesPage, icon: 'paper', current: null},
        {title: values.TAGS, component: TagsPage, icon: 'pricetags', current: null},
        {title: values.FILES, component: DolphinsPage, icon: 'images', current: null},
        {title: values.READER, component: ReaderPage, icon: 'book', current: null},
        {title: values.SETTINGS, component: SettingsPage, icon: 'settings', current: null}
      ];

      this.getCurrentView();
    });

    this.platform.ready().then((readySource: string) => {
      console.debug(readySource);
    });

    // Events
    this.authService.authenticated$.subscribe(() => this.onAuthenticate());
    this.authService.signOut$.subscribe(() => this.onSignOut());
    this.authService.currentSite$.subscribe((siteData) => this.onCurrentSite(siteData));
    this.siteService.siteUpdated$.subscribe((data) => this.siteUpdated(data));

    events.subscribe('site:created', () => {
      this.user = this.authService.getAuthUser(true)
    });

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

  setCurrentView(view: string): void {
    localStorage.setItem("currentView", view);
  }

  getCurrentView(): string {
    return localStorage.getItem("currentView");
  }

  onAuthenticate(): void {
    this.user = this.authService.getAuthUser(true);
  }

  onSignOut(): void {
    this.authService.unAuth();
    this.nav.setRoot(SigninPage);
  }

  onCurrentSite(siteData: object): void {
    // If there was a site
    if (siteData) {
      // Loop into pages
      for (let page of this.pages) {
        if (page.component.name === this.getCurrentView()) {
          this.nav.setRoot(page.component);
        }
      }
    } else {
      this.nav.push(SiteNewPage);
    }
  }

  siteUpdated(data) {
    for (let site of this.user.sites) {
      if (site.id == this.authService.getCurrentSite().id) {
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

  openPage(component?: any): void {
    let navigation = component ? component : ProfilePage;

    this.nav.setRoot(navigation);
    this.setCurrentView(navigation.name);
  }
}
