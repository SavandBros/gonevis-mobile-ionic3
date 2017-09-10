export class UserSite {
  id: string;
  role: number;
  title: string;
  url: string;

  constructor(id: string, role: number, title: string, url: string) {
    this.id = id;
    this.role = role;
    this.title = title;
    this.url = url;
  }

}
