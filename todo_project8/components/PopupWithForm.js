import Popup from "./Popup.js";

export default class PopupWithForm extends Popup {
  constructor(selector, { handleFormSubmit }) {
    super(selector);
    this._handleFormSubmit = handleFormSubmit;
    this._form = this._popup.querySelector("form");
    this._submitBtn = this._form.querySelector('[type="submit"]');
  }

  _getInputValues() {
    const inputs = [...this._form.querySelectorAll("input, textarea")];
    return inputs.reduce((acc, input) => {
      acc[input.name] = input.value;
      return acc;
    }, {});
  }

  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener("submit", (evt) => {
      evt.preventDefault();
      const values = this._getInputValues();
      this._handleFormSubmit(values);
    });
  }

  close() {
    super.close();
    this._form.reset();
  }
}
