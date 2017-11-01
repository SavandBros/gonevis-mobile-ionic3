import 'rxjs/add/operator/map';
import {Entry} from "../../models/entry";
import {BaseModelProvider} from "../base-model/base-model";
import {JwtInterceptorProvider} from "../jwt-interceptor/jwt-interceptor";
import {AuthProvider} from "../auth/auth-service";
import {EventEmitter, Injectable} from "@angular/core";
import {Response} from '@angular/http';


@Injectable()
export class EntryProvider extends BaseModelProvider<Entry> {
  public entryCreated$: EventEmitter<Entry> = new EventEmitter();
  public entryUpdated$: EventEmitter<Entry> = new EventEmitter();

  constructor(public http: JwtInterceptorProvider, public authService: AuthProvider) {
    super(http, authService);
    this.apiEndPoint = "website/entry/{{site}}/";
    this.apiEndPointList = "website/entry/";
    this.modelClass = Entry
  }

  vote(id: string): any {
    return this.http.post(`http://draft.gonevis.com/api/zero/website/entry/${id}/vote/`, null)
      .map((res: Response) => {
        return res.json();
      })
  }

  update(entry: Entry) {
    return this.http.put(`http://draft.gonevis.com/api/v1/website/entry/${entry.id}/`, entry)
      .map((res: Response) => {
        let data = new Entry(res.json());
        this.entryUpdated$.emit(data);

        return res.json();
      })
  }

  create(entry: Entry) {
    return this.http.post("http://draft.gonevis.com/api/v1/website/entry/", entry)
      .map((res: Response) => {
        let data = new Entry(res.json());
        this.entryCreated$.emit(data);

        return data;
      })
  }
}
