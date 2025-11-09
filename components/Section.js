// Renders a list of items using a renderer callback
export default class Section {
  constructor({ items, renderer, containerSelector }) {
    this._items = Array.isArray(items) ? items : [];
    this._renderer = renderer; // (item) => HTMLElement
    this._container = document.querySelector(containerSelector);
  }

  renderItems() {
    this._items.forEach((item) => this.addItem(item));
  }

  addItem(item, { prepend = false } = {}) {
    const element = this._renderer(item);
    if (prepend) {
      this._container.prepend(element);
    } else {
      this._container.append(element);
    }
  }
}
