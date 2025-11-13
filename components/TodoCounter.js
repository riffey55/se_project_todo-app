export default class TodoCounter {
  constructor(todos, selector) {
    this._element = document.querySelector(selector);
    this.recalculate(todos);
  }

  recalculate(todos) {
    // Full recalculation every time
    this._total = todos.length;
    this._completed = todos.filter((t) => t.completed).length;
    this._updateText();
  }

  _updateText() {
    this._element.textContent = `Showing ${this._completed} out of ${this._total} to-dos`;
  }
}
