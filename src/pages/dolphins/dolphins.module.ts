import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DolphinsPage } from './dolphins';

@NgModule({
  declarations: [
    DolphinsPage,
  ],
  imports: [
    IonicPageModule.forChild(DolphinsPage),
  ],
})
export class DolphinsPageModule {}
