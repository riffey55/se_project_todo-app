export default class Popup {
  constructor(selector) {
    this._popup = document.querySelector(selector);
    this._handleEscClose = this._handleEscClose.bind(this);
    this._lastFocus = null;
  }

  open() {
    this._lastFocus = document.activeElement; // remember trigger
    this._popup.classList.add("popup_opened");
    this._popup.setAttribute("aria-hidden", "false");
    document.addEventListener("keydown", this._handleEscClose);
  }

  close() {
    // move focus out before hiding
    if (this._popup.contains(document.activeElement)) {
      document.activeElement.blur();
    }
    this._popup.classList.remove("popup_opened");
    this._popup.setAttribute("aria-hidden", "true");
    document.removeEventListener("keydown", this._handleEscClose);

    // restore focus to trigger
    if (this._lastFocus && typeof this._lastFocus.focus === "function") {
      this._lastFocus.focus();
    }
  }

  _handleEscClose(evt) {
    if (evt.key === "Escape") this.close();
  }

  setEventListeners() {
    this._popup.addEventListener("mousedown", (evt) => {
      if (
        evt.target.classList.contains("popup_opened") ||
        evt.target.classList.contains("popup__close")
      ) {
        this.close();
      }
    });
  }
}
