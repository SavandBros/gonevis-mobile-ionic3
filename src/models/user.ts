import {UserSite} from "./user-site";
import {Media} from "./media";

export class User {
  id: string;
  name: string;
  username: string;
  about: string;
  email: string;
  location: string;
  FullName: string;
  ShortName: string;
  getAbsoluteURI: string;
  dateJoined: Date;
  updated: Date;
  isActive: boolean;
  receiveEmailNotification: boolean;
  hasVerifiedEmail: boolean;
  media: Media;
  sites: Array<UserSite> = [];

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.username = data.username;
    this.about = data.about;
    this.email = data.email;
    this.location = data.location;
    this.FullName = data.get_full_name;
    this.ShortName = data.get_short_name;
    this.getAbsoluteURI = data.get_absolute_uri;
    this.dateJoined = new Date(data.date_joined);
    this.updated = new Date(data.updated);
    this.isActive = data.is_active;
    this.receiveEmailNotification = data.receive_email_notification;
    this.hasVerifiedEmail = data.has_verified_email;

    let userMedia = null;

    if (data.media) {
      userMedia = new Media(
        data.media.picture,
        data.media.thumbnail_256x256,
        data.media.thumbnail_128x128,
        data.media.thumbnail_48x48
      );
    }

    this.media = userMedia;

    if (data.sites) {
      for (let siteData of data.sites) {
        this.sites.push(new UserSite(siteData['id'], siteData['role'], siteData['title'], siteData['url']));
      }
    }
  }

  getAvatar(size: string): string {
    if (this.media[size]) {
      return this.media[size];
    }
    return "../assets/img/avatar.png";
  }

  hasMedia(): string {
    return this.media.medium;
  }

  getFirstName(): string {
    if (this.name) {
      let firstName = this.name.split(" ")[0];
      if (firstName) {
        return firstName;
      }
    }
    return null;
  }

  getFullName(): string {
    if (this.name) {
      return this.name;
    }
    return this.username;
  }

  getDisplayName(): string {
    let firstName: string = this.getFirstName();

    if (firstName) {
      return firstName;
    }

    return this.getFullName();
  }
}
