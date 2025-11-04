// components/Todo.js

export default class Todo {
  constructor({ data, selector }) {
    this._name = data.name;
    this._date = data.date;
    this._completed = data.completed || false;
    this._id = data.id || ""; // Will be set later using uuidv4()
    this._selector = selector;
  }

  // 🪄 private helper: clone the template and prep DOM
  _getTemplate() {
    const todoTemplate = document
      .querySelector(this._selector)
      .content.querySelector(".todo")
      .cloneNode(true);
    return todoTemplate;
  }

  // 🌿 private helper: add event listeners (delete + checkbox)
  _setEventListeners() {
    this._deleteButton.addEventListener("click", () => this._element.remove());
    this._checkbox.addEventListener("change", () => {
      this._completed = this._checkbox.checked;
    });
  }

  // 🌸 public method: returns the finished todo element
  getView() {
    // get fresh copy of template
    this._element = this._getTemplate();

    // find DOM elements
    this._nameEl = this._element.querySelector(".todo__name");
    this._checkbox = this._element.querySelector(".todo__completed");
    this._labelEl = this._element.querySelector(".todo__label");
    this._dateEl = this._element.querySelector(".todo__date");
    this._deleteButton = this._element.querySelector(".todo__delete-btn");

    // fill in content
    this._nameEl.textContent = this._name;
    this._checkbox.checked = this._completed;

    const id = this._id ? `todo-${this._id}` : "";
    this._checkbox.id = id;
    this._labelEl.setAttribute("for", id);

    // format and display date if available
    const dueDate = new Date(this._date);
    if (!Number.isNaN(+dueDate)) {
      this._dateEl.textContent = `Due: ${dueDate.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}`;
    }

    // attach listeners
    this._setEventListeners();

    return this._element;
  }
}
