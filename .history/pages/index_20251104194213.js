// pages/index.js
import Todo from "../components/Todo.js";
import FormValidator from "../components/FormValidator.js";
import { initialTodos, validationConfig } from "../utils/constants.js";

const addTodoButton =
  document.querySelector(".button_action_add") ||
  document.querySelector(".button_type_add-todo");
const addTodoPopup =
  document.querySelector("#add-todo-popup") ||
  document.querySelector(".popup_type_add-todo");
const addTodoForm =
  (addTodoPopup && addTodoPopup.querySelector(".popup__form")) ||
  document.querySelector(".popup__form");
const todosList = document.querySelector(".todos__list");
const counterText = document.querySelector(".counter__text");

const OPEN_CLASS = "popup_visible";
const openModal = (p) => p.classList.add(OPEN_CLASS);
const closeModal = (p) => p.classList.remove(OPEN_CLASS);

const formValidator = new FormValidator(validationConfig, addTodoForm);
formValidator.enableValidation();

function updateCounter() {
  const total = document.querySelectorAll(".todo").length;
  const done = document.querySelectorAll(".todo__completed:checked").length;
  if (counterText)
    counterText.textContent = `Showing ${done} out of ${total} completed`;
}

if (Array.isArray(initialTodos)) {
  initialTodos.forEach((item) => {
    const todo = new Todo({ data: item, selector: "#todo-template" });
    todosList.append(todo.getView());
  });
}
updateCounter();

if (addTodoButton && addTodoPopup) {
  addTodoButton.addEventListener("click", () => openModal(addTodoPopup));
}
if (addTodoPopup) {
  addTodoPopup.addEventListener("mousedown", (e) => {
    const clickedOverlay =
      e.target === addTodoPopup || e.target.classList.contains("popup");
    const clickedClose = e.target.classList.contains("popup__close");
    if (clickedOverlay || clickedClose) closeModal(addTodoPopup);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && addTodoPopup.classList.contains(OPEN_CLASS)) {
      closeModal(addTodoPopup);
    }
  });
}

if (addTodoForm) {
  addTodoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const rawDate = e.target.date.value;
    const date = rawDate ? new Date(rawDate) : undefined;
    if (date) date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

    const todo = new Todo({
      data: { id: crypto.randomUUID(), name, date, completed: false },
      selector: "#todo-template",
    });
    todosList.append(todo.getView());
    formValidator.resetValidation();
    closeModal(addTodoPopup);
    updateCounter();
  });
}

todosList.addEventListener("change", (e) => {
  if (e.target.classList.contains("todo__completed")) updateCounter();
});
todosList.addEventListener("click", (e) => {
  if (e.target.classList.contains("todo__delete-btn"))
    setTimeout(updateCounter, 0);
});
