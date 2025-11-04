// pages/index.js
import FormValidator from "../components/FormValidator.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import Todo from "../components/Todo.js";
import { initialTodos, validationConfig } from "../utils/constants.js";

// --- DOM refs
const addTodoButton = document.querySelector(".button_action_add");
const addTodoPopup = document.querySelector("#add-todo-popup");
const addTodoForm = addTodoPopup.querySelector(".popup__form");
const addTodoCloseBtn = document.querySelector(".popup__close");
const todosList = document.querySelector(".todos__list");

// --- helpers
const openModal = (m) => m.classList.add("popup_visible");
const closeModal = (m) => m.classList.remove("popup_visible");

// --- init validator (before using it)
const formValidator = new FormValidator(validationConfig, addTodoForm);
formValidator.enableValidation();

// --- events
addTodoButton.addEventListener("click", () => {
  formValidator.resetValidation(); // ensure fresh state when opening
  openModal(addTodoPopup);
});

addTodoCloseBtn.addEventListener("click", () => {
  closeModal(addTodoPopup);
  formValidator.resetValidation(); // clean up after close
});

addTodoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = e.target.name.value.trim();
  const dateInput = e.target.date.value;

  const date = dateInput ? new Date(dateInput) : undefined;
  if (date) date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

  const todo = new Todo({
    data: { name, date, completed: false, id: uuidv4() },
    selector: "#todo-template",
  });

  todosList.append(todo.getView());
  closeModal(addTodoPopup);
  formValidator.resetValidation(); // polish: clear errors/disable button
  e.target.reset();
});

// --- initial render
initialTodos.forEach((item) => {
  const todo = new Todo({ data: item, selector: "#todo-template" });
  todosList.append(todo.getView());
});
