import {Component} from '@angular/core';
import {ActionSheetController, IonicPage, NavController, Platform, Refresher} from 'ionic-angular';
import {TagProvider} from "../../providers/tag/tag";
import {Tag} from "../../models/tag";
import {TagPage} from "../tag/tag";
import {AlertProvider} from "../../providers/alert/alert";

@IonicPage()
@Component({
  selector: 'page-tags',
  templateUrl: 'tags.html',
})
export class TagsPage {

  tags: Array<Tag>;
  loading: boolean;

  constructor(public navCtrl: NavController, public tagService: TagProvider,
              public platform: Platform, public actionSheetCtrl: ActionSheetController,
              public alertService: AlertProvider) {
    this.get();

    this.tagService.updated$.subscribe((tag) => this.onUpdate(tag));
    this.tagService.created$.subscribe((tag) => this.onCreate(tag));
  }

  reloadPage(refresher): void {
    this.get(refresher);
    this.loading = false;
  }

  get(refresh?: Refresher): void {
    this.loading = true;

    this.tagService.tags().subscribe((resp) => {
      this.loading = false;
      this.tags = resp.results;

      if (refresh) {
        refresh.complete();
      }
    }, (err) => {
      this.loading = false;
      console.log(err);
    });
  }

  options(tag: Tag): void {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Options',
      buttons: [
        {
          text: 'Edit',
          icon: !this.platform.is('ios') ? 'create' : null,
          cssClass: 'action-icon-primary',
          handler: () => this.tagPage(tag)
        },
        {
          text: 'Delete',
          icon: !this.platform.is('ios') ? 'trash' : null,
          role: 'Destructive',
          cssClass: 'action-icon-danger',
          handler: () => {
            actionSheet.dismiss();

            this.alertService.createAlert(
              'Are you sure?',
              'Remove this tag permanently',
              [
                {text: 'Cancel', role: 'cancel'},
                {text: 'Delete', handler: () => this.delete(tag)}
              ]);

            return false;
          }
        },
        {
          text: 'Cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          role: 'cancel'
        },
      ]
    });

    actionSheet.present();
  }

  tagPage(tag?: Tag): void {
    this.navCtrl.push(TagPage, {tag: tag});
  }

  delete(tag: Tag): void {
    this.tagService.delete(tag).subscribe(() => {
      tag.isDeleted = true;
    }, (err) => {
      console.log(err)
    });
  }

  onUpdate(data: Tag): void {
    this.get();
    this.tags.forEach((tag, index) => {
      if (tag.id == data.id) {
        this.tags[index] = data;
      }
    });
  }

  onCreate(tag: Tag): void {
    this.tags.unshift(tag);
  }
}
