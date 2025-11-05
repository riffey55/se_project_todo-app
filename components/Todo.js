// components/Todo.js

export default class Todo {
  constructor({ data, selector }) {
    this._data = data;
    this._selector = selector;
  }

  getView() {
    const template = document
      .querySelector(this._selector)
      .content.querySelector(".todo")
      .cloneNode(true);

    const checkbox = template.querySelector(".todo__completed");
    const nameEl = template.querySelector(".todo__name");
    const dateEl = template.querySelector(".todo__date");
    const deleteBtn = template.querySelector(".todo__delete-btn");

    nameEl.textContent = this._data.name;

    if (this._data.date) {
      dateEl.textContent = new Date(this._data.date).toLocaleDateString();
    } else {
      dateEl.textContent = "";
    }

    checkbox.checked = Boolean(this._data.completed);

    deleteBtn.addEventListener("click", () => {
      template.remove();
    });

    checkbox.addEventListener("change", () => {
      this._data.completed = !this._data.completed;
    });

    return template;
  }
}

/**
 * Helper used for both initial render and new adds.
 * Keeps all todo DOM building in one place.
 */
export function renderTodo(item, listElement) {
  const todo = new Todo({ data: item, selector: "#todo-template" });
  listElement.append(todo.getView());
}
