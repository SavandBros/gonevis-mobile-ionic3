import {DolphinFile} from "./dolphin-file";

class SiteMedia {
  coverImage: DolphinFile;
  logo: DolphinFile;

  constructor(coverImage: DolphinFile, logo: DolphinFile) {
    this.coverImage = coverImage;
    this.logo = logo;
  }
}

export class Site {
  id: string;
  user: string;
  title: string;
  url: string;
  absoluteUri: string;
  description: string;
  metaDescription: string;
  media: SiteMedia;
  updated: Date;
  created: Date;

  constructor (data: any) {
    this.id = data.id;
    this.user = data.user;
    this.title = data.title;
    this.url = data.url;
    this.absoluteUri = data.absolute_uri;
    this.description = data.description;
    this.metaDescription = data.meta_description;

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

    this.updated = new Date(data.updated);
    this.created = new Date(data.created);
  }
}
