// components/Todo.js
export default class Todo {
  constructor(
    { text, completed = false, id = crypto.randomUUID() },
    handleDelete,
  ) {
    this._text = text;
    this._completed = completed;
    this.id = id;
    this._handleDelete = handleDelete;
  }

  getView() {
    // Build DOM safely (no innerHTML with user data)
    const li = document.createElement("li");
    li.className = "todo";
    li.dataset.id = this.id;

    const checkboxId = `todo-${this.id}`;

    const label = document.createElement("label");
    label.className = "todo__label";
    label.setAttribute("for", checkboxId);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = checkboxId;
    checkbox.className = "todo__completed";
    checkbox.checked = this._completed;

    const spanText = document.createElement("span");
    spanText.className = "todo__name";
    spanText.textContent = this._text;

    const delBtn = document.createElement("button");
    delBtn.className = "todo__delete-btn";
    delBtn.type = "button";
    delBtn.setAttribute("aria-label", "Delete");
    delBtn.innerHTML = `
  <svg class="todo__delete-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 6h18M9 6V4h6v2m2 0v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6h12z"
      fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

    delBtn.addEventListener("click", () => this._handleDelete(this));

    label.append(checkbox, spanText);
    li.append(label, delBtn);
    return li;
  }

  get completed() {
    return this._completed;
  }
}
