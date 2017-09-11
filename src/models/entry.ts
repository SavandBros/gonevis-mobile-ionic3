import {DolphinFile} from "./dolphin-file";
import {Tag} from "./tag";

class EntryMedia {
  cover_image: DolphinFile;

  constructor(cover_image: DolphinFile) {
    this.cover_image = cover_image;
  }

}

export class Entry {
  id: string;
  title: string;
  content: string;
  user: string;
  absolute_uri: string;
  site: string;
  vote_count: number;
  slug: string;
  lead: string;
  excerpt: string;
  meta_description: string;
  status: number;
  format: number;
  comment_enabled: boolean;
  featured: boolean;
  password: string;
  view_count: number;
  published: string;
  start_publication: string;
  comment_count: number;
  active_comment_count: number;
  hidden_comment_count: number;
  pending_comment_count: number;
  created: Date;

  media: EntryMedia;
  tags: Array<Tag> = [];

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.user = data.user;
    this.absolute_uri = data.absolute_uri;
    this.site = data.site;
    this.vote_count = data.vote_count;
    this.slug = data.slug;
    this.lead = data.lead;
    this.excerpt = data.excerpt;
    this.meta_description = data.meta_description;
    this.status = data.status;
    this.format = data.format;
    this.comment_enabled = data.comment_enabled;
    this.featured = data.featured;
    this.password = data.password;
    this.view_count = data.view_count;
    this.published = data.published;
    this.start_publication = data.start_publication;
    this.comment_count = data.comment_count;
    this.active_comment_count = data.active_comment_count;
    this.hidden_comment_count = data.hidden_comment_count;
    this.pending_comment_count = data.pending_comment_count;
    this.created = new Date(data.created);

    let entryMedia = null;
    if (data.media.cover_image) {
      entryMedia = new DolphinFile(data.media.cover_image);
    }
    this.media = new EntryMedia(entryMedia);

    for (let tag of data.tags) {
      let tagMedia = null;
      if (tag.media.cover_image) {
        tagMedia = new DolphinFile(tag.media.cover_image);
      }
      this.tags.push(new Tag(tag.id, tag.name, tag.slug, tag.description, tag.meta_description, tag.site, tag.tagged_items_count, tag.absolute_uri, tagMedia));
    }
  }
}
