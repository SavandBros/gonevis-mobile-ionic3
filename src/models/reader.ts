import {DolphinFile} from "./dolphin-file";
import {Tag} from "./tag";
import {SiteMedia} from "./site";
import {User} from "./user";

class ReaderUser extends User {
  absoluteUri: string

  constructor(data: any) {
    super(data);

    this.absoluteUri = data.get_absolute_uri;
  }
}

class ReaderSites {
  id: string;
  title: string;
  description: string;
  media: ReaderMedia;
  absoluteUri: string;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.absoluteUri = data.absolute_uri;

    let siteCover = null;
    let siteLogo = null;

    if (data.media) {
      if (data.media.cover_image) {
        siteCover = new DolphinFile(data.media.cover_image);
      }
      if (data.media.logo) {
        siteLogo = new DolphinFile(data.media.logo);
      }
    }

    this.media = new SiteMedia(siteCover, siteLogo);
  }

}

class ReaderMedia {
  coverImage: DolphinFile;

  constructor(cover_image: DolphinFile) {
    this.coverImage = cover_image;
  }

}

class ReaderTags extends Tag {
  constructor(data: any) {
    super(data);

    this.id = null;
    this.meta_description = null;
    this.tagged_items_count = null;
  }
}

export class Reader {
  id: string;
  title: string;
  slug: string;
  content: string;
  user: ReaderUser;
  absoluteUri: string;
  site: ReaderSites;
  voteCount: number;
  viewCount: number;
  activeCommentCount: number;
  commentEnabled: boolean;
  isVoted: boolean;
  format: number;
  published: Date;

  media: ReaderMedia;
  tags: Array<Tag> = [];

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.slug = data.slug;
    this.content = data.content;
    this.user = new ReaderUser(data.user);
    this.absoluteUri = data.absolute_uri;
    this.site = new ReaderSites(data.site);
    this.voteCount = data.vote_count;
    this.viewCount = data.view_count;
    this.activeCommentCount = data.active_comment_count;
    this.commentEnabled = data.comment_enabled;
    this.isVoted = data.is_voted;
    this.published = new Date(data.published);

    let readerMedia = null;
    if (data.media.cover_image) {
      readerMedia = new DolphinFile(data.media.cover_image);
    }

    this.media = new ReaderMedia(readerMedia);

    for (let tag of data.tags) {
      this.tags.push(new ReaderTags(new Tag(tag)));
    }
  }
}

