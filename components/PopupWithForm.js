import Popup from "./Popup.js";

export default class PopupWithForm extends Popup {
  constructor(selector, handleSubmit) {
    super(selector);
    this._form = this._popup.querySelector("form");
    this._handleSubmit = handleSubmit;
  }

  // NEW: ensure a11y + visibility are in sync
  open() {
    this._opener = document.activeElement;
    super.open?.();
    this._popup.classList.add("popup_opened");
    this._popup.setAttribute("aria-hidden", "false");
    const firstInput = this._form.querySelector("input, textarea, select");
    firstInput?.focus();
  }

  _getInputValues() {
    const values = {};
    [...this._form.elements].forEach((el) => {
      if (el.name) values[el.name] = el.value;
    });
    return values;
  }

  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener("submit", (e) => {
      e.preventDefault();
      this._handleSubmit(this._getInputValues());
    });
  }

  close() {
    super.close?.();
    this._popup.classList.remove("popup_opened");

    // 👇 add these two lines
    const fallback = document.querySelector("#open-add-todo");
    (this._opener && document.contains(this._opener)
      ? this._opener
      : fallback
    )?.focus();

    this._popup.setAttribute("aria-hidden", "true");
    this._form.reset();
  }
}
