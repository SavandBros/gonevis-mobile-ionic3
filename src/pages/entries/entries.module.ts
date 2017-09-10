import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EntriesPage } from './entries';

@NgModule({
  declarations: [
    EntriesPage,
  ],
  imports: [
    IonicPageModule.forChild(EntriesPage),
  ],
})
export class EntriesPageModule {}
