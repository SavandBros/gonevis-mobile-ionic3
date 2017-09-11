import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommentModalPage } from './comment-modal';

@NgModule({
  declarations: [
    CommentModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CommentModalPage),
  ],
})
export class CommentModalPageModule {}
