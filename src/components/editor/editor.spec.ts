///<reference path="../../../node_modules/@types/jasmine/index.d.ts"/>

import {TestBed} from '@angular/core/testing';
import {EditorComponent} from "./editor";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpLoaderFactory} from "../../app/app.module";
import {Http} from "@angular/http";
import {EditorAction} from "./editor-action";
import {AlertController, Events, IonicModule} from "ionic-angular";
import {EventsMock} from "../../../test-config/mocks/ionic/events-mock";
import {AlertControllerMock} from "../../../test-config/mocks/ionic/alert-controller-mock";
import {CodekitProvider} from "../../providers/codekit/codekit";
import {CodekitMock} from "../../../test-config/mocks/gonevis/codekit-mock";


describe('Testing Editor Component', () => {
  let fixture;
  let editorComponent: EditorComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditorComponent],
      imports: [
        IonicModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }
        }),
      ],
      providers: [
        {provide: Events, useClass: EventsMock},
        {provide: AlertController, useClass: AlertControllerMock},
        {provide: CodekitProvider, useClass: CodekitMock},
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorComponent);
    editorComponent = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(editorComponent instanceof EditorComponent).toBe(true);
  });

  it('#actions should have 5 registered EditorActions', () => {
    expect(editorComponent.actions.length).toEqual(5);

    for (let editorAction of editorComponent.actions) {
      expect(editorAction instanceof EditorAction).toBe(true);
    }
  });
});
