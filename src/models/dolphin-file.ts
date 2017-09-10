export class DolphinFile {
  id: string;
  file: string;
  thumbnail_256x256: string;
  thumbnail_128x128: string;
  thumbnail_48x48: string;
  ext: string;
  meta_data: object;
  user: string;
  file_name: string;
  size_human: string;
  is_image: boolean;
  created: Date;
  updated: Date;

  constructor(data: any) {
    this.id = data.id;
    this.file = data.file;
    this.thumbnail_256x256 = data.thumbnail_256x256;
    this.thumbnail_128x128 = data.thumbnail_128x128;
    this.thumbnail_48x48 = data.thumbnail_48x48;
    this.ext = data.ext;
    this.meta_data = data.user;
    this.file_name = data.file_name;
    this.size_human = data.size_human;
    this.is_image = data.is_image;
    this.created = new Date(data.created);
    this.updated = new Date(data.updated);
  }
}
