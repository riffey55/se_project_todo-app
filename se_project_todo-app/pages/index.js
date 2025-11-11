// pages/index.js
import { v4 as uuidv4 } from "uuid";
import * as C from "../utils/constants.js";

import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import TodoCounter from "../components/TodoCounter.js";
import Todo from "../components/Todo.js";
import FormValidator from "../components/FormValidator.js";

/* -------------------------
   1) DOM SELECTORS (safe defaults if constants.js doesn't define them)
------------------------- */
const SELECTORS = {
  list: C.todoListSelector || "#todo-list",
  addButton: C.addTodoButtonSelector || "#open-add-todo",
  popup: C.addTodoPopupSelector || "#add-todo-popup",
  form: C.addTodoFormSelector || "#add-todo-form",
  counterText: C.counterTextSelector || "#todo-counter",
};

const initialTodos = Array.isArray(C.initialTodos) ? C.initialTodos : [];

/* -------------------------
   2) COUNTER
------------------------- */
const counter = new TodoCounter(initialTodos, SELECTORS.counterText);

/* -------------------------
   3) HELPER: build Todo DOM via your Todo class (adapts to common APIs)
------------------------- */
function createTodoElement(data) {
  // Use your Todo API: { data, selector } + getView()
  const todo = new Todo({ data, selector: "#todo-template" });
  const el = todo.getView(); // returns the <li> DOM node

  // Wire the counter to checkbox & delete button
  const checkbox = el.querySelector(".todo__completed");
  const deleteBtn = el.querySelector(".todo__delete-btn");

  // When user toggles completed
  checkbox.addEventListener("change", () => {
    counter.updateCompleted(checkbox.checked ? true : false);
  });

  // When user deletes the item
  deleteBtn.addEventListener("click", () => {
    counter.updateTotal(false);
  });

  return el;
}

/* -------------------------
   4) SECTION (renders the list)
------------------------- */
const todoSection = new Section(
  {
    items: initialTodos,
    renderer: (item) => {
      const todoEl = createTodoElement(item);
      todoSection.addItem(todoEl);
    },
  },
  SELECTORS.list
);

// First paint
todoSection.renderItems();

/* -------------------------
   5) POPUP WITH FORM (name + time)
------------------------- */
const addTodoPopup = new PopupWithForm(SELECTORS.popup, (values) => {
  // Values should include: values.name, values.time  (from index.html inputs)
  // Optional nice formatting:
  const fmt = (iso) => new Date(iso).toLocaleDateString("en-US"); // e.g., 11/11/2025

  const newTodo = {
    id: uuidv4(),
    name: values.name,
    date: fmt(values.time), // <-- key change: use 'date'
    time: values.time, // keep raw value if you want it later
    completed: false,
  };

  const todoEl = createTodoElement(newTodo);
  todoSection.addItem(todoEl);

  // Update totals, close + reset handled by PopupWithForm.close()
  counter.updateTotal(true);
  addTodoPopup.close();
});

// enable overlay/close button handlers
addTodoPopup.setEventListeners();

/* -------------------------
   6) OPEN BUTTON → open popup
------------------------- */
const openBtn = document.querySelector(SELECTORS.addButton);
openBtn.addEventListener("click", () => addTodoPopup.open());

/* -------------------------
   7) FORM VALIDATION (uses your existing config if present)
------------------------- */
const formEl = document.querySelector(SELECTORS.form);
const validationConfig = C.validationConfig || {
  // safe default if your constants.js doesn't export config
  formSelector: ".form",
  inputSelector: ".form__input",
  submitButtonSelector: ".form__submit, .popup__button, .button",
  inactiveButtonClass: "button_disabled",
  inputErrorClass: "form__input_type_error",
  errorClass: "form__input-error_visible",
};

const addTodoValidator = new FormValidator(validationConfig, formEl);
addTodoValidator.enableValidation();

/* -------------------------
   8) OPTIONAL: support adding via Enter when text field focused
------------------------- */
formEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.matches('input[name="name"]')) {
    e.preventDefault();
    formEl.requestSubmit();
  }
});
