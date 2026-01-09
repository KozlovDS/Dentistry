import "./select.scss";

// Основная инициализация
let selects = document.getElementsByTagName("select");
if (selects.length > 0) {
  selects_init();
}

function selects_init() {
  for (let i = 0; i < selects.length; i++) {
    const select = selects[i];
    // Защищаем от повторной инициализации
    if (
      select.parentNode.classList &&
      select.parentNode.classList.contains("select")
    ) {
      continue;
    }
    select_init(select);
  }

  // Глобальные обработчики закрытия
  document.addEventListener("click", selects_close);
  document.addEventListener("keydown", function (e) {
    if (e.code === "Escape") {
      selects_close();
    }
  });
}

// Закрытие всех открытых селектов при клике вне или Escape
function selects_close(e) {
  const activeSelects = document.querySelectorAll(".select._active");

  let clickedInside = false;
  if (e) {
    clickedInside = e.target.closest(".select");
  }

  if (!clickedInside) {
    activeSelects.forEach((select) => {
      const options = select.querySelector(".select__options");
      select.classList.remove("_active");
      if (options) _slideUp(options, 200);
    });
  }
}

// Инициализация одного select
function select_init(select) {
  const select_modifikator = select.getAttribute("class") || "";
  const selectedOption =
    select.querySelector("option:checked") || select.options[0];

  // Сохраняем дефолт
  select.dataset.default = selectedOption.value;
  select.style.display = "none";

  // Создаём обёртку .select
  const customWrapper = document.createElement("div");
  customWrapper.className =
    "select" + (select_modifikator ? " select_" + select_modifikator : "");

  // Вставляем обёртку точно на место оригинального select
  select.parentNode.insertBefore(customWrapper, select);
  customWrapper.appendChild(select);

  // Генерируем содержимое
  select_build(select);
}

// Построение структуры кастомного select
function select_build(select) {
  const wrapper = select.parentNode; // теперь это .select
  const selectedOption = select.querySelector("option:checked");
  const selectedText = selectedOption ? selectedOption.textContent.trim() : "";
  const selectType = select.dataset.type; // "input" для поиска

  // Удаляем старый .select__item, если был (для обновления)
  const oldItem = wrapper.querySelector(".select__item");
  if (oldItem) oldItem.remove();

  let valueHtml = "";
  if (selectType === "input") {
    valueHtml = `
      <div class="select__value icon-select-arrow">
        <input autocomplete="off" type="text" name="form[]" value="${selectedText}"
               data-error="Ошибка" data-value="${selectedText}" class="select__input">
      </div>`;
  } else {
    valueHtml = `
      <div class="select__value icon-select-arrow">
        <span>${selectedText}</span>
      </div>`;
  }

  const optionsHtml = select_get_options(select);

  const itemHtml = `
    <div class="select__item">
      <div class="select__title">${valueHtml}</div>
      <div class="select__options" hidden>${optionsHtml}</div>
    </div>`;

  wrapper.insertAdjacentHTML("beforeend", itemHtml);

  // Навешиваем события
  select_events(select, wrapper);
}

// Генерация списка опций
function select_get_options(select) {
  let optionsHtml = "";
  const options = select.querySelectorAll("option");

  options.forEach((option) => {
    const value = option.value;
    if (value !== "") {
      const text = option.textContent.trim();
      optionsHtml += `<div class="select__option" data-value="${value}">${text}</div>`;
    }
  });

  return optionsHtml;
}

// Навешивание событий на элементы
function select_events(originalSelect, wrapper) {
  const title = wrapper.querySelector(".select__title");
  const optionsContainer = wrapper.querySelector(".select__options");
  const options = wrapper.querySelectorAll(".select__option");
  const input = wrapper.querySelector(".select__input");
  const isMultiple = originalSelect.hasAttribute("multiple");
  const selectType = originalSelect.dataset.type;

  // Открытие/закрытие по клику на заголовок
  title.addEventListener("click", () => {
    // Закрываем другие селекты
    document.querySelectorAll(".select._active").forEach((other) => {
      if (other !== wrapper) {
        other.classList.remove("_active");
        const otherOpts = other.querySelector(".select__options");
        if (otherOpts) _slideUp(otherOpts, 200);
      }
    });

    wrapper.classList.toggle("_active");
    _slideToggle(optionsContainer, 200);
  });

  // Клик по опции
  options.forEach((option) => {
    option.addEventListener("click", () => {
      const value = option.dataset.value;
      const text = option.textContent.trim();

      if (isMultiple) {
        option.classList.toggle("_selected");
        update_multiple_value(originalSelect, wrapper);
      } else {
        wrapper.querySelector(".select__value span") &&
          (wrapper.querySelector(".select__value span").textContent = text);
        if (input) input.value = text;
        originalSelect.value = value;

        // Скрываем выбранную опцию в одиночном режиме (по желанию)
        // option.style.display = "none";
      }

      // Закрываем только в одиночном режиме
      if (!isMultiple) {
        wrapper.classList.remove("_active");
        _slideUp(optionsContainer, 200);
      }

      // Вызываем событие change
      originalSelect.dispatchEvent(new Event("change", { bubbles: true }));
    });
  });

  // Поиск при вводе (если data-type="input")
  if (selectType === "input" && input) {
    input.addEventListener("keyup", () =>
      select_search(input, optionsContainer)
    );
  }
}

// Обновление значения для multiple select
function update_multiple_value(originalSelect, wrapper) {
  const selectedOptions = wrapper.querySelectorAll(".select__option._selected");
  const texts = Array.from(selectedOptions).map((opt) =>
    opt.textContent.trim()
  );

  const span = wrapper.querySelector(".select__value span");
  if (span) {
    span.textContent = texts.length ? texts.join(", ") : "Выберите...";
  }

  // Синхронизируем с оригинальным select
  originalSelect.querySelectorAll("option").forEach((opt) => {
    opt.selected = false;
  });
  selectedOptions.forEach((opt) => {
    const value = opt.dataset.value;
    const originalOpt = originalSelect.querySelector(
      `option[value="${value}"]`
    );
    if (originalOpt) originalOpt.selected = true;
  });
}

// Поиск в опциях
function select_search(input, optionsContainer) {
  const options = optionsContainer.querySelectorAll(".select__option");
  const searchText = input.value.trim().toUpperCase();

  options.forEach((option) => {
    const text = option.textContent.toUpperCase();
    option.style.display = text.includes(searchText) ? "" : "none";
  });
}

// Функция обновления всех селектов (например, после динамического изменения options)
function selects_update_all() {
  document.querySelectorAll("select").forEach((select) => {
    if (select.parentNode.classList.contains("select")) {
      select_build(select);
    }
  });
}

// ======================= Анимации slide =======================
let _slideUp = (target, duration = 300) => {
  if (!target || target.classList.contains("_slide")) return;
  target.classList.add("_slide");
  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = duration + "ms";
  target.style.height = target.offsetHeight + "px";
  target.offsetHeight; // reflow
  target.style.overflow = "hidden";
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  setTimeout(() => {
    target.hidden = true;
    target.style.removeProperty("height");
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    target.style.removeProperty("overflow");
    target.style.removeProperty("transition-duration");
    target.style.removeProperty("transition-property");
    target.classList.remove("_slide");
  }, duration);
};

let _slideDown = (target, duration = 300) => {
  if (!target || target.classList.contains("_slide")) return;
  target.classList.add("_slide");
  if (target.hidden) target.hidden = false;
  let height = target.offsetHeight;
  target.style.overflow = "hidden";
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  target.offsetHeight; // reflow
  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = duration + "ms";
  target.style.height = height + "px";
  target.style.removeProperty("padding-top");
  target.style.removeProperty("padding-bottom");
  target.style.removeProperty("margin-top");
  target.style.removeProperty("margin-bottom");
  setTimeout(() => {
    target.style.removeProperty("height");
    target.style.removeProperty("overflow");
    target.style.removeProperty("transition-duration");
    target.style.removeProperty("transition-property");
    target.classList.remove("_slide");
  }, duration);
};

let _slideToggle = (target, duration = 300) => {
  if (!target) return;
  return target.hidden
    ? _slideDown(target, duration)
    : _slideUp(target, duration);
};
