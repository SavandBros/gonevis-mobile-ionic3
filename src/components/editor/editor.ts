import {Component} from '@angular/core';
import {EditorAction} from "./editor-action";
import {AlertController, Events} from "ionic-angular";
import {CodekitProvider} from "../../providers/codekit/codekit";


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

  constructor(public events: Events, public codekit: CodekitProvider,
              public alertCtrl: AlertController) {
    EditorComponent.event = this.events;

    setTimeout(() => {
      this.editable = document.getElementsByClassName("entry-content");
      EditorComponent.event.publish('entry:typing', this.editable.content.innerHTML);

      this.listener();
    }, 0);

    this.events.subscribe('image:selected', (dolphin) => {
      if (dolphin) EditorComponent.exec('insertImage', dolphin.file);
    });
  }

  listener() {
    this.editable.content.addEventListener('input', function (container) {
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
  ];

  insertLink(): void {
    let range: Range;
    let sel: Selection;

    if (window.getSelection().anchorNode && window.getSelection().getRangeAt(0)) {
      sel = window.getSelection();
      range = window.getSelection().getRangeAt(0);
    }

    let alert = this.alertCtrl.create({
      title: 'Link',
      enableBackdropDismiss: true,
      inputs: [
        {
          name: 'text',
          type: 'text',
          placeholder: 'Text'
        },
        {
          name: 'link',
          type: 'url',
          placeholder: 'https://example.com'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Add',
          handler: data => {
            let link: string;

            // Check if link starts with https://
            if(data.link.indexOf("https://") !== 0) {
              link = `https://${data.link}`;
            } else {
              link = data.link;
            }

            // Create element
            let linkElement: Element = document.createElement('a');
            linkElement.setAttribute('href', link);
            linkElement.innerHTML = data.text ? data.text : link;

            // Add created element to the current caret position
            let node = range.createContextualFragment(linkElement.outerHTML);
            range.insertNode(node);

            let newNode = document.querySelectorAll('[href="' + link + '"]');

            range.setStartAfter(newNode[0]);
            range.setEndAfter(newNode[0]);
            sel.removeAllRanges();
            sel.addRange(range);

            EditorComponent.emitContent(document.getElementsByClassName('entry-content')[0].innerHTML);
          }
        }
      ]
    });

    alert.present();
  }

  public insertImage() {
    this.codekit.selectImage("editorAddImage");
  };

  static exec(command: string, value?: any): void {
    document.execCommand(command, false, value);
  }
}
