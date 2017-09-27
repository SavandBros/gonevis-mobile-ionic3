/**
 * Defines HTML editor actions.
 */
export class EditorAction {
  constructor(public title: string, public icon: string, public result: void | Function) {}
}
