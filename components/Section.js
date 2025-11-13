export default class Section {
  constructor({ items, renderer }, containerSelector) {
    this._items = items;
    this._renderer = renderer;
    this._container = document.querySelector(containerSelector);
  }

  renderItems() {
    this._items.forEach((item) => this._renderer(item));
  }

  addItem(element, data) {
    this._container.prepend(element);
    this._items.unshift(data); // store new todo at start
  }
}
