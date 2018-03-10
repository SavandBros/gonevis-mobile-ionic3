import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SiteNewPage } from './site-new';

@NgModule({
  declarations: [
    SiteNewPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteNewPage),
  ],
})
export class SiteNewPageModule {}
