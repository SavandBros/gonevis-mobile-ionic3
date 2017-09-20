import 'rxjs/add/operator/map';
import {Entry} from "../../models/entry";
import {BaseModelProvider} from "../base-model/base-model";


export class EntryProvider extends BaseModelProvider<Entry> {
  public apiEndPoint: string = "website/entry/{{site}}/";
  public apiEndPointList: string = "website/entry/";
  public modelClass = Entry;
}
