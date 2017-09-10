import {DateTime} from "ionic-angular";
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
  absolute_url: string;
  description: string;
  meta_description: string;
  media: SiteMedia;
  updated: DateTime;
  created: DateTime;
}
