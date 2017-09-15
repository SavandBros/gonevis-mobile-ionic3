import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DolphinPage } from './dolphin';

@NgModule({
  declarations: [
    DolphinPage,
  ],
  imports: [
    IonicPageModule.forChild(DolphinPage),
  ],
})
export class DolphinPageModule {}
