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

const addTodoPopup = new PopupWithForm(SELECTORS.popup, (values) => {
  const newTodo = {
    id: uuidv4(),
    name: values.name.trim(),
    date: values.time || new Date().toISOString().slice(0, 10),
    completed: false,
  };

  // Let Section call the renderer
  const el = renderTodo(newTodo, document.querySelector(SELECTORS.list));
  todoSection.addItem(el); // ✅ pass the <li>, not the data

  counter.updateTotal(true);
  addTodoPopup.close();
});
addTodoPopup.setEventListeners();

const counter = new Counter(
  Array.isArray(C.initialTodos) ? C.initialTodos : [],
  SELECTORS.counter
);

const todoSection = new Section(
  {
    items: C.initialTodos,
    renderer: (item) =>
      renderTodo(item, document.querySelector(SELECTORS.list)), // ✅ no getContainer
  },
  SELECTORS.list
);

todoSection.renderItems();

const formElement = document.querySelector(SELECTORS.form);
const formValidator = new FormValidator(validationConfig, formElement);
formValidator.enableValidation();

document
  .querySelector(SELECTORS.openButton)
  .addEventListener("click", () => addTodoPopup.open());
