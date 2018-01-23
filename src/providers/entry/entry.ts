import 'rxjs/add/operator/map';
import {Entry} from "../../models/entry";
import {BaseModelProvider} from "../base-model/base-model";
import {JwtInterceptorProvider} from "../jwt-interceptor/jwt-interceptor";
import {AuthProvider} from "../auth/auth-service";
import {EventEmitter, Injectable} from "@angular/core";
import {Response} from '@angular/http';
import {Api} from "../api";


@Injectable()
export class EntryProvider extends BaseModelProvider<Entry> {
  public entryCreated$: EventEmitter<Entry> = new EventEmitter();
  public entryUpdated$: EventEmitter<Entry> = new EventEmitter();

  constructor(public http: JwtInterceptorProvider,
              public authService: AuthProvider, public api: Api) {
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

  get(entryId: string) {
    return this.api.get(`website/entry/${entryId}/`)
      .map((res: Response) => {
        return new Entry(res.json());
      })
  }

  update(payload: any) {
    return this.api.put(`website/entry/${payload.id}/`, payload)
      .map((res: Response) => {
        let data = new Entry(res.json());
        this.entryUpdated$.emit(data);

        return data;
      })
  }

  create(payload: any) {
    return this.api.post("website/entry/", payload)
      .map((res: Response) => {
        let data = new Entry(res.json());
        this.entryCreated$.emit(data);

        return data;
      })
  }

  remove(id: string) {
    return this.api.delete(`website/entry/${id}/`).map(() => {})
  }
}
