import { v4 as uuidv4 } from "uuid";
import PopupWithForm from "../components/PopupWithForm.js";
import Section from "../components/Section.js";
import Counter from "../components/TodoCounter.js";
import { renderTodo } from "../components/Todo.js";
import FormValidator from "../components/FormValidator.js";
import * as C from "../utils/constants.js";
import validationConfig from "../utils/validationConfig.js";

// --- SELECTORS ---
const SELECTORS = {
  popup: "#add-todo-popup",
  openButton: "#open-add-todo",
  form: "#add-todo-form",
  list: "#todo-list",
  counter: "#todo-counter",
};

// ============================================================
// CALLBACKS (needed by Todo.js)
// ============================================================

// When a checkbox is toggled
function handleCheck() {
  counter.recalculate(todoSection._items);
}

// When a todo is deleted
function handleDelete() {
  counter.recalculate(todoSection._items);
}

// ============================================================
// POPUP SUBMIT HANDLER
// ============================================================
const addTodoPopup = new PopupWithForm(SELECTORS.popup, (values) => {
  const newTodo = {
    id: uuidv4(),
    name: values.name.trim(),
    date: values.time || new Date().toISOString().slice(0, 10),
    completed: false,
  };

  // Render the new <li>
  const el = renderTodo(
    newTodo,
    document.querySelector(SELECTORS.list),
    handleCheck,
    handleDelete
  );

  // Add element + data to Section
  todoSection.addItem(el, newTodo);

  // Update counter
  counter.recalculate(todoSection._items);

  // Close modal
  addTodoPopup.close();
});

addTodoPopup.setEventListeners();

// ============================================================
// COUNTER
// ============================================================
const counter = new Counter(
  Array.isArray(C.initialTodos) ? C.initialTodos : [],
  SELECTORS.counter
);

// ============================================================
// SECTION (initial render)
// ============================================================
const todoSection = new Section(
  {
    items: C.initialTodos,
    renderer: (item) =>
      renderTodo(
        item,
        document.querySelector(SELECTORS.list),
        handleCheck,
        handleDelete
      ),
  },
  SELECTORS.list
);

todoSection.renderItems();

// ============================================================
// FORM VALIDATION
// ============================================================
const formElement = document.querySelector(SELECTORS.form);
const formValidator = new FormValidator(validationConfig, formElement);
formValidator.enableValidation();

// ============================================================
// OPEN POPUP BUTTON
// ============================================================
document
  .querySelector(SELECTORS.openButton)
  .addEventListener("click", () => addTodoPopup.open());
