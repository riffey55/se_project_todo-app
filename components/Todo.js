// components/Todo.js

export default class Todo {
  constructor({ data, selector }) {
    this._selector = selector;

    this._data = {
      name: data?.name ?? "",
      completed: Boolean(data?.completed),
      date: this._normalizeDate(data?.date),
    };
  }

  // Make sure we treat "YYYY-MM-DD" as a local date (no timezone shift)
  _normalizeDate(rawDate) {
    if (!rawDate) {
      return new Date();
    }

    // If it's already a Date object, just use it
    if (rawDate instanceof Date) {
      return rawDate;
    }

    // If it's a string like "2025-11-13"
    if (typeof rawDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
      const [year, month, day] = rawDate.split("-").map(Number);
      return new Date(year, month - 1, day); // month is 0-based
    }

    // Fallback: let Date try to parse it
    return new Date(rawDate);
  }

  static _formatDate(date) {
    // Example: Nov 13, 2025
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

    // Date
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
 */
export function renderTodo(item, listElement) {
  const todo = new Todo({ data: item, selector: "#todo-template" });
  const todoElement = todo.getView();
  listElement.append(todoElement);
  return todoElement;
}
