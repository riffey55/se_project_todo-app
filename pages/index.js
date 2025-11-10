// /pages/index.js
import Todo from "../components/Todo.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import Popup from "../components/Popup.js";
import PopupWithForm from "../components/PopupWithForm.js";
import TodoCounter from "../components/TodoCounter.js";

// ---- selectors
const selectors = {
  listContainer: ".todos__list",
  newTodoPopup: ".popup_type_new-todo",
  newTodoForm: ".popup__form_type_new-todo",
  newTodoOpenBtn: ".header__button",
  counterEl: ".counter__text",
  clearBtn: ".counter__clear",
};

// optional clarity
const INCREMENT = true;
const DECREMENT = false;

// ---- LocalStorage helpers
const STORAGE_KEY = "todos";

const loadTodos = () => {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
    return data.filter(
      (t) => t && typeof t.text === "string" && t.text.trim() !== "",
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

// ---- Empty state toggle
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

// --- recent <datalist>
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

// ---- Initial data
const initialTodos = loadTodos();

// ---- Render function for Section
function renderTodo(item) {
  const todo = new Todo(item, (todoInstance) => {
    const li = document.querySelector(`[data-id="${todoInstance.id}"]`);
    const wasCompleted = li.querySelector('input[type="checkbox"]').checked;

    li.classList.add("todo_deleting");
    li.addEventListener(
      "animationend",
      () => {
        li.remove();

        // deleting reduces total; if it was completed, reduce completed
        counter.updateTotal(DECREMENT);
        if (wasCompleted) counter.updateCompleted(DECREMENT);

        updateEmptyState();
        updateClearButtonState();
        saveTodos(snapshotTodosFromDOM());
        updateDatalist();
      },
      { once: true },
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
updateDatalist();

// ---- Counter
const counter = new TodoCounter(initialTodos, selectors.counterEl);

// ---- Checkbox toggles completed count
document
  .querySelector(selectors.listContainer)
  .addEventListener("change", (e) => {
    if (e.target.matches('input[type="checkbox"]')) {
      counter.updateCompleted(e.target.checked ? INCREMENT : DECREMENT);
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

    // new item => total +1
    counter.updateTotal(INCREMENT);

    updateEmptyState();
    updateClearButtonState();
    saveTodos(snapshotTodosFromDOM());
    updateDatalist();
    addTodoPopup.close();
  },
});
addTodoPopup.setEventListeners();

// ---- Clear completed
document.querySelector(selectors.clearBtn).addEventListener("click", () => {
  const list = document.querySelector(selectors.listContainer);
  const completedLis = Array.from(list.children).filter(
    (li) => li.querySelector('input[type="checkbox"]')?.checked,
  );
  if (completedLis.length === 0) return;

  let remaining = completedLis.length;
  completedLis.forEach((li) => {
    li.classList.add("todo_deleting");
    li.addEventListener(
      "animationend",
      () => {
        // each removed completed item reduces both counts
        counter.updateTotal(DECREMENT);
        counter.updateCompleted(DECREMENT);

        li.remove();
        remaining -= 1;
        if (remaining === 0) {
          updateEmptyState();
          updateClearButtonState();
          saveTodos(snapshotTodosFromDOM());
          updateDatalist();
        }
      },
      { once: true },
    );
  });
});

// ---- Open button
document
  .querySelector(selectors.newTodoOpenBtn)
  .addEventListener("click", () => {
    if (typeof newTodoValidator.resetValidation === "function") {
      newTodoValidator.resetValidation();
    }
    addTodoPopup.open();
  });
