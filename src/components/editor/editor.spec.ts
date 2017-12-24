///<reference path="../../../node_modules/@types/jasmine/index.d.ts"/>

import {TestBed} from '@angular/core/testing';
import {EditorComponent} from "./editor";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpLoaderFactory} from "../../app/app.module";
import {Http} from "@angular/http";
import {EditorAction} from "./editor-action";


describe('Testing Editor Component', () => {
  let fixture;
  let editorComponent: EditorComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditorComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }
        }),
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorComponent);
    editorComponent = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(editorComponent instanceof EditorComponent).toBe(true);
  });

  it('#actions should have 14 registered EditorActions', () => {
    expect(editorComponent.actions.length).toEqual(7);

    for (let editorAction of editorComponent.actions) {
      expect(editorAction instanceof EditorAction).toBe(true);
    }
  });
});
