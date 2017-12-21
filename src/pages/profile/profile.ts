import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {User} from "../../models/user";
import {AuthProvider} from "../../providers/auth/auth-service";
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";
import {UserProvider} from "../../providers/user/user";

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  user: User;
  updating: boolean;
  coverImage: SafeStyle;

  constructor(public authService: AuthProvider, public userService: UserProvider, public sanitizer: DomSanitizer) {
    this.user = this.authService.getAuthUser(true);

    this.get();
  }

  get() {
    this.userService.get().subscribe((resp) => {
      this.user = this.authService.setAuthUser(resp ,true);

      if (this.user.hasMedia()) {
        this.coverImage = this.sanitizer.bypassSecurityTrustStyle(`url(${this.user.media.full})`);
      }

    }, (err) => {
      console.log(err);
    });
  }

  update() {
    this.updating = true;

    let payload = {
      id: this.user.id,
      name: this.user.name,
      about: this.user.about,
      location: this.user.location,
      receive_email_notification: this.user.receiveEmailNotification
    };

    this.userService.update(payload).subscribe((resp) => {
      this.user = this.authService.setAuthUser(resp ,true);
      this.updating = false;

      if (this.user.hasMedia()) {
        this.coverImage = this.sanitizer.bypassSecurityTrustStyle(`url(${this.user.media.full})`);
      }

    }, (err) => {
      console.log(err);
      this.updating = false;
    });
  }
}
