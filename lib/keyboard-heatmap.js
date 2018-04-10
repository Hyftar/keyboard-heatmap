'use babel';

import KeyboardHeatmapView from './keyboard-heatmap-view';
import { CompositeDisposable, Disposable } from 'atom';

export default {

  keyboardHeatmapView: null,
  modalPanel: null,
  subscriptions: null,
  keyboardSubscriptions: null,
  keyLoggerActive: false,

  activate(state) {
    this.subscriptions = new CompositeDisposable();
    this.keyboardHeatmapView = new KeyboardHeatmapView(state.keyboardHeatmapViewState);

    this.modalPanel = atom.workspace.addBottomPanel({
      item: this.keyboardHeatmapView.getElement(),
      visible: false,
      priority: 100
    });

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'keyboard-heatmap:toggleView': () => this.toggleView()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'keyboard-heatmap:toggleKeyLogger': () => this.toggleKeyLogger()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.keyboardSubscriptions.dispose();
    this.keyboardHeatmapView.destroy();
  },

  serialize() {
    return {
      keyboardHeatmapViewState: this.keyboardHeatmapView.serialize()
    };
  },

  toggleKeyLogger() {
    this.keyLoggerActive = !this.keyLoggerActive;

    let addEventListener = (element, eventName, handler) => {
      element.addEventListener(eventName, handler)
      return new Disposable(() => {
        element.removeEventListener(eventName, handler);
      });
    };

    let addEditorListener = (editor) => {
      if (editor) {
        let editorView = atom.views.getView(editor);
        this.keyboardSubscriptions.add(
          addEventListener(
            editorView,
            'keydown',
            (event) => {
              this.keyboardHeatmapView.update(event);
            }
          )
        );
      }
    };

    if (this.keyLoggerActive) {
      this.keyboardSubscriptions = new CompositeDisposable();
      addEditorListener(atom.workspace.getActiveTextEditor());
      this.keyboardSubscriptions.add(
        atom.workspace.onDidChangeActiveTextEditor(edtior => addEditorListener(edtior))
      );
    }
    else {
      this.keyboardSubscriptions.dispose();
    }
  },

  toggleView() {
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
