///<reference path="../../../node_modules/@types/jasmine/index.d.ts"/>

import {EditorAction} from "./editor-action";


describe('Testing Editor Action', () => {

  it('should only create the object, nothing serious', () => {
    let editorAction: EditorAction = new EditorAction("Bold", "<b>B</b>", () => {});

    expect(editorAction).toBeTruthy();
    expect(editorAction.icon).toEqual("<b>B</b>");
    expect(editorAction.title).toEqual("Bold");
  });
});
