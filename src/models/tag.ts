import {DolphinFile} from "./dolphin-file";
export class Tag {
  id: string;
  name: string;
  slug: string;
  description: string;
  meta_description: string;
  site: string;
  tagged_items_count: number;
  absolute_uri: string;
  media: DolphinFile;

  constructor(id: string, name: string, slug: string, description: string,
              meta_description: string, site: string, tagged_items_count: number,
              absolute_uri: string, media: DolphinFile) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.description = description;
    this.meta_description = meta_description;
    this.absolute_uri = absolute_uri;
    this.site = site;
    this.tagged_items_count = tagged_items_count;
    this.media = media;
  }
}
