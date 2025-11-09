export default class TodoCounter {
  // selector = counter text element; todosSelector = list for delegation
  constructor({ selector, todosSelector }) {
    this._selector = selector;
    this._todosSelector = todosSelector;
    this._element = document.querySelector(this._selector);

    this._completed = 0;
    this._total = 0;
  }

  bindList(listRoot) {
    // Call once after initial render; listRoot is the UL/OL element
    // Recompute totals from DOM state to be safe
    const checkboxes = listRoot.querySelectorAll('input[type="checkbox"]');
    this._total = checkboxes.length;
    this._completed = [...checkboxes].filter((c) => c.checked).length;
    this.updateText();

    listRoot.addEventListener("change", (evt) => {
      if (evt.target.matches('input[type="checkbox"]')) {
        this.updateTotal({ increment: evt.target.checked ? +1 : -1 });
      }
    });
  }

  onAddTodo({ completed }) {
    this._total += 1;
    if (completed) this._completed += 1;
    this.updateText();
  }

  onDeleteTodo({ completed }) {
    this._total -= 1;
    if (completed) this._completed -= 1;
    this.updateText();
  }

  updateTotal({ increment }) {
    if (increment === 1) this._completed += 1;
    else if (increment === -1) this._completed -= 1;
    this.updateText();
  }

  updateText() {
    this._element.textContent = `Showing ${this._completed} out of ${this._total} completed`;
  }
}
