'use babel';

const keysMap = require('./keyboard-keys.js');
const colorGradientHelper = require('./color-gradient-helper.js')

export default class KeyboardHeatmapView {

  constructor(serializedState) {
    this.keysPressedCount = serializedState || {};

    this.root = document.createElement('div');
    this.root.classList.add('keyboard-heatmap');

    const keyboard = document.createElement('div');
    this.root.appendChild(keyboard);

    for (const row of keysMap) {
      const rowElement = document.createElement('div');
      rowElement.classList.add('row');
      for (const key of row.keys) {
        const keyElement = document.createElement('div');
        keyElement.classList.add('key');
        keyElement.classList.add(key.width);
        keyElement.id = key.name;
        keyElement.textContent = key.label;
        rowElement.appendChild(keyElement);
      }
      keyboard.appendChild(rowElement);
    }
  }

  update(event) {
    this.keysPressedCount[event.code] = this.keysPressedCount[event.code] + 1 || 1;
  }

  updateUI() {
    let min = Infinity;
    let max = -Infinity;

    for (const key in this.keysPressedCount) {
      let value = this.keysPressedCount[key];
      if (value > max) { max = value; }
      if (value < min) { min = value; }
    }

    for (const key in this.keysPressedCount) {
      let value = this.keysPressedCount[key];
      const percentile = (value - min) / (max - min);
      const keyElement = document.getElementById(key);

      let keyColor = colorGradientHelper.selectColor(
          percentile,
          ['#1C21A2', '#0BD8E6', '#41BA75','#00ff00', '#A8CD14', '#DACD26', '#F29C08','#ff0000']
        );
      keyElement.style.backgroundColor = `rgb(${keyColor.r},${keyColor.g},${keyColor.b})`;
    }
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
