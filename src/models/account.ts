import {UserSite} from "./user-site";
import {Media} from "./media";


export class User {
  name: string;
  username: string;
  email: string;
  id: string;
  media: Media;
  sites: Array<UserSite> = [];

  constructor(name: string, username:string, email: string, id: string, media: Media, sites: Array<UserSite>) {
    this.name = name;
    this.username = username;
    this.email = email;
    this.id = id;
    this.media = media;
    this.sites = sites;
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

export class Account {
  user: User;

  constructor(data: any) {
    let media = new Media(
      data.media.picture,
      data.media.thumbnail_256x256,
      data.media.thumbnail_128x128,
      data.media.thumbnail_48x48
    );
    let sites: Array<UserSite> = [];
    for (let siteData of data.sites) {
      sites.push(new UserSite(siteData['id'], siteData['role'], siteData['title'], siteData['url']));
    }
    this.user = new User(data.name, data.username, data.email, data.id, media, sites);
  }
}
