'use babel';

const keysMap = require('./keyboard-keys.js');
const colorGradientHelper = require('./color-gradient-helper.js')

const getIcon = () => document.querySelector('#kh-status-bar-tile');

const createIcon = state => {
  const icon = document.createElement('span');
  icon.id = 'kh-status-bar-tile';
  icon.className = `icon icon-keyboard kh-${state ? 'on' : 'off'}`;
  return icon;
};

const createContainer = () => {
  const div = document.createElement('div');
  div.id = 'kh-status-bar-container';
  div.classList.add('inline-block');
  div.addEventListener('click', () => {
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'keyboard-heatmap:toggleKeyLogger');
  });

  return div;
}

export default class KeyboardHeatmapView {

  constructor(serializedState, state) {
    this.keysPressedCount = serializedState || {};

    this.state = state;

    this.statusBarElement = createContainer();
    this.statusBarElement.appendChild(createIcon(this.state));

    this.root = document.createElement('div');
    this.root.classList.add('keyboard-heatmap');

    const keyboard = document.createElement('div');
    keyboard.id = 'keyboard';
    this.root.appendChild(keyboard);

    for (const row of keysMap) {
      const rowElement = document.createElement('div');
      rowElement.classList.add('row');
      for (const key of row.keys) {
        const keyElement = document.createElement('div');
        if (key.name != 'padding') {
          keyElement.id = key.name;
        } else {
          keyElement.classList.add('padding');
        }
        keyElement.classList.add('key');
        keyElement.classList.add(key.width);
        keyElement.textContent = key.label;
        rowElement.appendChild(keyElement);
      }
      keyboard.appendChild(rowElement);
    }

    this.updateUI();
  }

  update(event) {
    if (atom.config.get('keyboard-heatmap.ignoredKeys').indexOf(event.code) >= 0)
      return
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
      let percentile = (value - min) / (max - min);
      // When there's only one key or all the keys have the same value
      if (isNaN(percentile)) { percentile = 0.5; }
      const keyElement = document.getElementById(key);

      let keyColor = colorGradientHelper.selectColor(
          percentile,
          ['#00ff00', '#A8CD14', '#DACD26', '#F29C08','#ff0000']
        );
      keyElement.style.backgroundColor = `rgb(${keyColor.r}, ${keyColor.g}, ${keyColor.b})`;
    }
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {
    return this.keysPressedCount;
  }

  updateStatusBar(newState) {
    const icon = getIcon();
    icon.classList.remove(newState ? 'kh-off' : 'kh-on');
    icon.classList.add(newState ? 'kh-on' : 'kh-off');
  }

  // Tear down any state and detach
  destroy() {
    this.root.remove();
  }

  getElement() {
    return this.root;
  }

}
