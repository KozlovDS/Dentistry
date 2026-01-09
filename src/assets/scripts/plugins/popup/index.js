import "./popup.scss";

const body = document.body; // оставляем, если где-то ещё используется

// ==================== ПОЛИФИЛЛЫ (оставляем только если нужна поддержка старых браузеров) ====================
(() => {
  if (!Element.prototype.closest) {
    Element.prototype.closest = function (selector) {
      let node = this;
      while (node) {
        if (node.matches(selector)) return node;
        node = node.parentElement;
      }
      return null;
    };
  }

  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector;
  }
})();

// ==================== ФИКС FOUC (опционально) ====================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".popup").forEach((popup) => {
    popup.classList.add("no-transition");
  });

  setTimeout(() => {
    document.querySelectorAll(".popup").forEach((popup) => {
      popup.classList.remove("no-transition");
    });
  }, 100);
});

// ==================== ОТКРЫТИЕ ПО КНОПКАМ С data-popup ====================
document.querySelectorAll("[data-popup]").forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const popupId = button.getAttribute("data-popup");
    const popup = document.getElementById(popupId);

    if (popup) {
      popupOpen(popup);
    }
  });
});

// ==================== ЗАКРЫТИЕ ПО КРЕСТИКУ ====================
document.querySelectorAll(".close-popup").forEach((icon) => {
  icon.addEventListener("click", (e) => {
    e.preventDefault();
    const popup = icon.closest(".popup");
    if (popup) popupClose(popup);
  });
});

// ==================== ОТКРЫТИЕ ПОПАПА ====================
function popupOpen(popup) {
  if (!popup) return;

  const activePopup = document.querySelector(".popup.open");
  if (activePopup) {
    popupClose(activePopup, false); // закрываем предыдущий (без разблокировки, т.к. её больше нет)
  }

  popup.classList.add("open");

  // Закрытие по клику на оверлей
  popup.addEventListener("click", overlayClickHandler);
}

function overlayClickHandler(e) {
  if (!e.target.closest(".popup__content")) {
    popupClose(e.target.closest(".popup"));
  }
}

// ==================== ЗАКРЫТИЕ ПОПАПА ====================
function popupClose(popup, doUnlock = true) {
  if (!popup) return;

  popup.classList.remove("open");
  popup.removeEventListener("click", overlayClickHandler);

  // doUnlock больше не нужен — ничего не разблокируем
}

// ==================== ЗАКРЫТИЕ ПО ESC ====================
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" || e.keyCode === 27) {
    const activePopup = document.querySelector(".popup.open");
    if (activePopup) {
      popupClose(activePopup);
    }
  }
});
