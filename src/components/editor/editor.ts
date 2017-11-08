import {Component} from '@angular/core';
import {EditorAction} from "./editor-action";
import {AlertController, Events} from "ionic-angular";


@Component({
  selector: 'editor',
  templateUrl: 'editor.html',
  inputs: ['content']
})
export class EditorComponent {
  public content: string;
  static event: Events;
  public editable: any;
  public classes: any = {
    'actionbar': 'gonevis-editor-actionbar',
    'button': 'gonevis-editor-button',
    'content': 'gonevis-editor-content',
  };

  constructor(public events: Events, public alertCtrl: AlertController) {
    EditorComponent.event = this.events;
    setTimeout(() => {
      this.editable = document.getElementsByClassName("entry-content");
      EditorComponent.event.publish('entry:typing', this.editable.content.innerHTML);

      this.listener();
    }, 0)
  }

  listener() {
    this.editable.content.addEventListener('input', function(container) {
      EditorComponent.emitContent(container.target.innerHTML);
    });
  }

  static emitContent(content: string) {
    EditorComponent.event.publish('entry:typing', content);
  }

  actions = [
    new EditorAction("Bold", "<b>B</b>", () => EditorComponent.exec("bold")),
    new EditorAction("Italic", "<i>I</i>", () => EditorComponent.exec("italic")),
    new EditorAction("Heading 1", "<b>H<sub>1</sub></b>", () => EditorComponent.exec("formatBlock", "<H1>")),
    new EditorAction("Heading 2", "<b>H<sub>2</sub></b>", () => EditorComponent.exec("formatBlock", "<H2>")),
    new EditorAction("Unordered List", "&#8226", () => EditorComponent.exec("insertUnorderedList")),
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
