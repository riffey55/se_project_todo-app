// components/Todo.js

export default class Todo {
  constructor({ data, selector }) {
    this._selector = selector;

    // Normalize and ensure a date exists
    this._data = {
      name: data?.name ?? "",
      completed: Boolean(data?.completed),
      // If no date provided, default to now so requirements are met
      date: data?.date ? new Date(data.date) : new Date(),
    };
  }

  static _formatDate(date) {
    // Example: Nov 12, 2025
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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

    // Name
    nameEl.textContent = this._data.name;

    // Date (always present now)
    dateEl.textContent = Todo._formatDate(this._data.date);

    // Completed state
    checkbox.checked = this._data.completed;

    // Handlers
    deleteBtn.addEventListener("click", () => {
      template.remove();
    });

    checkbox.addEventListener("change", () => {
      this._data.completed = checkbox.checked;
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
