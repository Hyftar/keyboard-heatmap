'use babel';

export default class KeyboardHeatmapView {

  constructor(serializedState) {
    this.keysPressedCount = {};

    // Create root element
    this.root = document.createElement('div');
    this.root.classList.add('keyboard-heatmap');

    // Create message element
    const message = document.createElement('div');
    this.root.appendChild(message);
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
