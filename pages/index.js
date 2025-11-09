// /pages/index.js

import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import Todo from "../components/Todo.js";
import TodoCounter from "../components/TodoCounter.js";
import FormValidator from "../components/FormValidator.js";

// ---- selectors
const selectors = {
  listContainer: ".todos__list",
  newTodoPopup: ".popup_type_new-todo",
  newTodoForm: ".popup__form_type_new-todo",
  newTodoOpenBtn: ".header__button",
  counterEl: ".counter__text",
  clearBtn: ".counter__clear",
};

// ---- LocalStorage helpers
const STORAGE_KEY = "todos";

const loadTodos = () => {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
    // 🧹 filter out empty or invalid todos
    return data.filter(
      (t) => t && typeof t.text === "string" && t.text.trim() !== ""
    );
  } catch {
    return [];
  }
};

const saveTodos = (todos) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));

const snapshotTodosFromDOM = () => {
  const list = document.querySelector(selectors.listContainer);
  return Array.from(list.children).map((li) => {
    const id = li.dataset.id;
    const text = li.querySelector(".todo__name")?.textContent ?? "";
    const completed =
      li.querySelector('input[type="checkbox"]')?.checked ?? false;
    return { id, text, completed };
  });
};

// ---- Empty state toggle (also hides/shows the counter row)
function updateEmptyState() {
  const list = document.querySelector(selectors.listContainer);
  const empty = document.querySelector(".todos__empty");
  const counterRow = document.querySelector(".counter");
  if (!list || !empty || !counterRow) return;

  const hasItems = list.children.length > 0;
  empty.hidden = hasItems;
  counterRow.classList.toggle("counter--hidden", !hasItems);
}

// ---- Enable/disable "Clear completed"
function updateClearButtonState() {
  const btn = document.querySelector(selectors.clearBtn);
  const list = document.querySelector(selectors.listContainer);
  if (!btn || !list) return;
  const hasCompleted = !!list.querySelector('input[type="checkbox"]:checked');
  btn.disabled = !hasCompleted;
}

// --- Build a de-duplicated, recent-first list of labels
function getRecentTodoTexts(limit = 8) {
  const stored = loadTodos() ?? [];
  const texts = [];
  for (const t of stored) {
    const text = (t.text || "").trim();
    if (text && !texts.includes(text)) texts.push(text);
    if (texts.length >= limit) break;
  }
  return texts;
}

// --- Render into the <datalist>
function updateDatalist() {
  const dl = document.getElementById("recentTodos");
  if (!dl) return;
  const texts = getRecentTodoTexts(8);
  dl.innerHTML = "";
  for (const label of texts) {
    const opt = document.createElement("option");
    opt.value = label;
    dl.appendChild(opt);
  }
}

// ---- Initial data (from storage)
const initialTodos = loadTodos();

// ---- Render function for Section
function renderTodo(item) {
  const todo = new Todo(item, (todoInstance) => {
    const li = document.querySelector(`[data-id="${todoInstance.id}"]`);
    const completed = li.querySelector('input[type="checkbox"]').checked;

    // animate out, then remove
    li.classList.add("todo_deleting");
    li.addEventListener(
      "animationend",
      () => {
        li.remove();
        counter.onDeleteTodo({ completed });
        updateEmptyState();
        updateClearButtonState();
        saveTodos(snapshotTodosFromDOM());
        updateDatalist(); // keep datalist fresh after delete
      },
      { once: true }
    );
  });
  return todo.getView();
}

// ---- Section
const section = new Section({
  items: initialTodos,
  renderer: renderTodo,
  containerSelector: selectors.listContainer,
});
section.renderItems();
updateEmptyState();
updateClearButtonState();
updateDatalist(); // initial render

// ---- Counter
const counter = new TodoCounter({
  selector: selectors.counterEl,
  todosSelector: selectors.listContainer,
});
counter.bindList(document.querySelector(selectors.listContainer));

// ---- Persist + clearBtn state on checkbox toggle
document
  .querySelector(selectors.listContainer)
  .addEventListener("change", (e) => {
    if (e.target.matches('input[type="checkbox"]')) {
      saveTodos(snapshotTodosFromDOM());
      updateClearButtonState();
      updateDatalist();
    }
  });

// ---- Validator
const validationConfig = {
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__save",
  inactiveButtonClass: "button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};
const formEl = document.querySelector(selectors.newTodoForm);
const newTodoValidator = new FormValidator(validationConfig, formEl);
newTodoValidator.enableValidation();

// ---- Popup
const addTodoPopup = new PopupWithForm(selectors.newTodoPopup, {
  handleFormSubmit: ({ todoText }) => {
    const newItem = { text: todoText, completed: false };
    section.addItem(newItem, { prepend: true });
    counter.onAddTodo({ completed: false });
    updateEmptyState();
    updateClearButtonState();
    saveTodos(snapshotTodosFromDOM());
    updateDatalist();
    addTodoPopup.close(); // PopupWithForm handles preventDefault + reset
  },
});
addTodoPopup.setEventListeners();

// ---- Clear completed handler
document.querySelector(selectors.clearBtn).addEventListener("click", () => {
  const list = document.querySelector(selectors.listContainer);
  const completedLis = Array.from(list.children).filter(
    (li) => li.querySelector('input[type="checkbox"]')?.checked
  );
  if (completedLis.length === 0) return;

  let remaining = completedLis.length;
  completedLis.forEach((li) => {
    li.classList.add("todo_deleting");
    li.addEventListener(
      "animationend",
      () => {
        counter.onDeleteTodo({ completed: true });
        li.remove();
        remaining -= 1;
        if (remaining === 0) {
          updateEmptyState();
          updateClearButtonState();
          saveTodos(snapshotTodosFromDOM());
          updateDatalist();
        }
      },
      { once: true }
    );
  });
});

// ---- Open button
document
  .querySelector(selectors.newTodoOpenBtn)
  .addEventListener("click", () => {
    if (typeof newTodoValidator.resetValidation === "function") {
      newTodoValidator.resetValidation(); // single source of truth for reset
    }
    addTodoPopup.open();
  });
