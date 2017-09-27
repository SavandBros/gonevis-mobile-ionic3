import {Component} from '@angular/core';
import {EditorAction} from "./editor-action";


@Component({
  selector: 'editor',
  templateUrl: 'editor.html',
  inputs: ['content']
})
export class EditorComponent {
  public content: string;
  public classes: any = {
    'actionbar': 'gonevis-editor-actionbar',
    'button': 'gonevis-editor-button',
    'content': 'gonevis-editor-content',
  };
  actions = [
    new EditorAction("Bold", "<b>B</b>", () => EditorComponent.exec("bold")),
    new EditorAction("Italic", "<i>I</i>", () => EditorComponent.exec("italic")),
    new EditorAction("Underline", "<u>U</u>", () => EditorComponent.exec("underline")),
    new EditorAction("Strike-through", "<strike>S</strike>", () => EditorComponent.exec("strikeThrough")),
    new EditorAction("Heading 1", "<b>H<sub>1</sub></b>", () => EditorComponent.exec("formatBlock", "<H1>")),
    new EditorAction("Heading 2", "<b>H<sub>2</sub></b>", () => EditorComponent.exec("formatBlock", "<H1>")),
    new EditorAction("Paragraph", "&#182;", () => EditorComponent.exec("formatBlock", "<P>")),
    new EditorAction("Quote", "&#8220; &#8221;", () => EditorComponent.exec("formatBlock", "<BLOCKQUOTE>")),
    new EditorAction("Ordered List", "&#35;", () => EditorComponent.exec("formatBlock", "<P>")),
    new EditorAction("Unordered List", "&#8226;", () => EditorComponent.exec("insertUnorderedList")),
    new EditorAction("Code", "&lt;/&gt;", () => EditorComponent.exec("formatBlock", "<PRE>")),
    new EditorAction("Horizontal Line", "&#8213;", () => EditorComponent.exec("insertHorizontalRule")),
    new EditorAction("Link", "&#128279;", () => {
      const url: string = window.prompt('Enter the link URL');
      if (url) EditorComponent.exec('createLink', url)
    }),
    new EditorAction("Image", "&#128247;", () => {
      const url: string = window.prompt('Enter the image URL');
      if (url) EditorComponent.exec('insertImage', url)
    }),
  ];

  static exec(command: string, value?: any): void {
    document.execCommand(command, false, value);
  }
}
