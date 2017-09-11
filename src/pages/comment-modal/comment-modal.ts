import {Component} from '@angular/core';
import {IonicPage, ViewController, NavParams, LoadingController} from 'ionic-angular';
import {CommentProvider} from "../../providers/comment/comment";
import {Comment} from "../../models/comment";

@IonicPage()
@Component({
  selector: 'page-comment-modal',
  templateUrl: 'comment-modal.html',
})
export class CommentModalPage {

  comments: Array<Comment>;
  isReply: boolean;

  constructor(public navParams: NavParams, public viewCtrl: ViewController, public commentService: CommentProvider,
              public loadingCtrl: LoadingController) {
    this.isReply = false;
    let loader = this.loadingCtrl.create({content: "Loading comments..."});
    loader.present();

    this.commentService.getEntryComments(navParams.get("entry")).subscribe((resp) => {
      this.comments = resp.results;
      loader.dismiss();
      console.log(this.comments);
    }, (err) => {
      console.log(err);
      loader.dismiss();
    });
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  reply() {
    this.isReply = true;
  }
}
