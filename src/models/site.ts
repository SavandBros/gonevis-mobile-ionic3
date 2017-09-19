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
  title: string;
  url: string;
  absoluteUri: string;
  commenting: boolean;
  voting: boolean;
  description: string;
  metaDescription: string;
  media: SiteMedia;

  constructor (data: any) {
    this.title = data.title;
    this.url = data.url;
    this.absoluteUri = data.absolute_uri;
    this.commenting = data.commenting;
    this.voting = data.voting;
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

  }
}
