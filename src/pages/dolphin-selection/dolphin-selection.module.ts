import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DolphinSelectionPage } from './dolphin-selection';

@NgModule({
  declarations: [
    DolphinSelectionPage,
  ],
  imports: [
    IonicPageModule.forChild(DolphinSelectionPage),
  ],
})
export class DolphinSelectionPageModule {}
