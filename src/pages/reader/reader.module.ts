import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReaderPage } from './reader';

@NgModule({
  declarations: [
    ReaderPage,
  ],
  imports: [
    IonicPageModule.forChild(ReaderPage),
  ],
})
export class ReaderPageModule {}
