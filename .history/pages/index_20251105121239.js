// pages/index.js

import { renderTodo } from "../components/Todo.js";
import FormValidator from "../components/FormValidator.js";
import { initialTodos, validationConfig } from "../utils/constants.js";

// ------- DOM -------
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

// ------- Modal helpers -------
const OPEN_CLASS = "popup_visible";

const openModal = (popup) => popup && popup.classList.add(OPEN_CLASS);
const closeModal = (popup) => popup && popup.classList.remove(OPEN_CLASS);

// ------- Validation -------
const formValidator = new FormValidator(validationConfig, addTodoForm);
formValidator.enableValidation();

// ------- Counter -------
function updateCounter() {
  const total = document.querySelectorAll(".todo").length;
  const done = document.querySelectorAll(".todo__completed:checked").length;
  if (counterText) {
    counterText.textContent = `Showing ${done} out of ${total} completed`;
  }
}

// ------- Initial render -------
if (Array.isArray(initialTodos)) {
  initialTodos.forEach((item) => renderTodo(item, todosList));
}
updateCounter();

// ------- Events -------

// Open popup
if (addTodoButton && addTodoPopup) {
  addTodoButton.addEventListener("click", () => openModal(addTodoPopup));
}

// Close by overlay / close button
if (addTodoPopup) {
  addTodoPopup.addEventListener("mousedown", (e) => {
    const clickedOverlay =
      e.target === addTodoPopup || e.target.classList.contains("popup");
    const clickedClose = e.target.classList.contains("popup__close");
    if (clickedOverlay || clickedClose) closeModal(addTodoPopup);
  });

  // Close on Esc
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && addTodoPopup.classList.contains(OPEN_CLASS)) {
      closeModal(addTodoPopup);
    }
  });
}

// Submit handler
if (addTodoForm) {
  addTodoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = e.target.name.value.trim();
    const rawDate = e.target.date.value;

    // Normalize to UTC so comparisons/sorting are stable (optional)
    const date = rawDate ? new Date(rawDate) : undefined;
    if (date) date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

    renderTodo(
      {
        id: crypto.randomUUID(),
        name,
        date,
        completed: false,
      },
      todosList
    );

    closeModal(addTodoPopup);
    formValidator.resetValidation();
    updateCounter();
    e.target.reset();
  });
}
