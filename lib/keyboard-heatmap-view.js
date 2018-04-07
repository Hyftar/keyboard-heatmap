'use babel';

let fs = require('fs');

export default class KeyboardHeatmapView {

  constructor(serializedState) {
    this.keysPressedCount = {};

    let keysMap = JSON.parse(fs.readFileSync('res/keys.json'));

    this.root = document.createElement('div');
    this.root.classList.add('keyboard-heatmap');

    const keyboard = document.createElement('div');
    this.root.appendChild(keyboard);

    for (let row of keysMap) {
      let rowElement = document.createElement('div');
      rowElement.classList.add('row');
      for (let key of row.keys) {
        let keyElement = document.createElement('div');
        keyElement.classList.add('key');
        keyElement.textContent = key.label;
        rowElement.appendChild(keyElement);
      }
      keyboard.appendChild(rowElement);
    }
  }

  update(event) {
    this.keysPressedCount[event.code] = this.keysPressedCount[event.code] + 1 || 1;
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {
    return this.keysPressedCount;
  }

  // Tear down any state and detach
  destroy() {
    this.root.remove();
  }

  getElement() {
    return this.root;
  }

}
