import {DolphinFile} from "./dolphin-file";
import {Tag} from "./tag";

class EntryMedia {
  coverImage: DolphinFile;

  constructor(coverImage: DolphinFile) {
    this.coverImage = coverImage;
  }

}

export class Entry {
  id: string;
  title: string;
  content: string;
  user: string;
  absoluteURI: string;
  site: string;
  slug: string;
  lead: string;
  excerpt: string;
  metaDescription: string;
  status: number;
  format: number;
  commentEnabled: boolean;
  featured: boolean;
  password: string;
  published: string;
  startPublication: string;
  commentCount: number;
  viewCount: number;
  voteCount: number;
  activeCommentCount: number;
  hiddenCommentCount: number;
  pendingCommentCount: number;
  created: Date;

  media: EntryMedia;
  tags: Array<Tag> = [];

  constStatus: number;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.user = data.user;
    this.site = data.site;
    this.slug = data.slug;
    this.lead = data.lead;
    this.excerpt = data.excerpt;
    this.status = data.status;
    this.format = data.format;
    this.featured = data.featured;
    this.password = data.password;
    this.published = data.published;
    this.viewCount = data.view_count;
    this.voteCount = data.vote_count;
    this.absoluteURI = data.absolute_uri;
    this.commentEnabled = data.comment_enabled;
    this.startPublication = data.start_publication;
    this.metaDescription = data.meta_description;
    this.commentCount = data.comment_count;
    this.activeCommentCount = data.active_comment_count;
    this.hiddenCommentCount = data.hidden_comment_count;
    this.pendingCommentCount = data.pending_comment_count;
    this.created = new Date(data.created);

    let entryMedia = null;
    if (data.hasOwnProperty("media") && data.media.cover_image) {
      entryMedia = new DolphinFile(data.media.cover_image);
    }
    this.media = new EntryMedia(entryMedia);

    if (data.hasOwnProperty("tags")) {
      for (let tag of data.tags) {
        this.tags.push(new Tag(tag));
      }
    }

    this.constStatus = data.status;
  }

  getAbsoluteURI(): string {
    if (this.constStatus == 0) {
      return this.absoluteURI + "?view=preview";
    }

    return this.absoluteURI;
  }
}
