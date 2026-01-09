import "./plugins/swiper";
import "./plugins/popup";
import "./plugins/menu";
import "./plugins/dynamicAdapt";
import "./plugins/select";
import "./plugins/mouseParallax";
import "./plugins/tabs";

import Inputmask from "inputmask";

var input = document.getElementById("phone");
if (input) {
  var im = new Inputmask("+7 (999) 999-9999", {
    placeholder: "_", // какой символ использовать для незаполненных позиций
    clearMaskOnLostFocus: false, // маска остаётся даже без фокуса
    showMaskOnHover: false,
    // Важно: делаем +7 неизменяемым и предзаполненным
    definitions: {
      9: {
        validator: "[0-9]",
        cardinality: 1,
      },
    },
    // Предзаполняем +7 и ставим курсор после скобки
    onBeforeMask: function (value, opts) {
      // Если поле пустое или содержит только +7 — возвращаем пустую строку для маски
      if (!value || value === "+7" || value.trim() === "") {
        return "";
      }
      // Убираем +7 в начале, если пользователь ввёл его сам
      return value.replace(/^(\+7|8)/, "");
    },
    // После применения маски — значение в input будет +7 (xxx) xxx-xxxx
    onUnMask: function (maskedValue, unmaskedValue) {
      return maskedValue; // или можно возвращать только цифры
    },
  });

  im.mask(input);

  // Делаем +7 предзаполненным при загрузке страницы
  input.value = "+7 (";

  // Опционально: ставим курсор в правильное место при фокусе
  input.addEventListener("focus", function () {
    if (this.value === "+7 (") {
      // Ставим курсор после "+7 ("
      setTimeout(() => {
        this.setSelectionRange(4, 4);
      }, 0);
    }
  });
} else {
  console.info("Элемент для маски не найден!");
}

window.addEventListener("scroll", function () {
  const header = document.querySelector(".header");
  if (window.scrollY > 100) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
});

let checkbox = document.getElementById("checkbox");
if (checkbox) {
  checkbox.addEventListener("change", function () {
    document.querySelector(".review-popup__button").disabled = !this.checked;
  });
}
