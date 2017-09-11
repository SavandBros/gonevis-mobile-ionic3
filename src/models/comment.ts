import {Media} from "./media";

class UserComment {
  getAbsoluteUri: string;
  id: string;
  name: string;
  username: string;
  media: Media;

  constructor(data: any) {
    this.getAbsoluteUri = data.get_absolute_uri;
    this.id = data.id;
    this.name = data.name;
    this.username = data.username;
    this.media = new Media(data.media.picture, data.media.thumbnail_256x256, data.media.thumbnail_128x128, data.media.thumbnail_48x48);
  }
}

export class Comment {
  comment: string;
  id: string;
  created: Date;
  isActive: boolean;
  isHidden: boolean;
  needsApproval: boolean;
  objectPk: string;
  objectType: number;
  site: string;
  status: number;
  updated: Date;

  user: Account;

  constructor(data: any) {
    this.comment = data.comment;
    this.id = data.id;
    this.created = new Date(data.created);
    this.isActive = data.is_active;
    this.isHidden = data.is_hidden;
    this.needsApproval = data.needs_approval;
    this.objectPk = data.object_pk;
    this.objectType = data.objectType;
    this.site = data.site;
    this.status = data.status;
    this.updated = new Date(data.updated);
    this.user = new UserComment(data.user);
  }
}
