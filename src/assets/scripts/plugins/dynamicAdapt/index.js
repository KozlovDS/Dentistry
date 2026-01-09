// Dynamic Adapt v.2 (Mobile-First)
// Автор: улучшено на основе оригинала Andrikanych Yevhen (2020)
// Адаптировано под mobile-first подход
// data-da="куда_переместить(селектор), брейкпоинт(px), позиция(first|last|число)"

// Пример: data-da=".header__menu, 768, first"
// По умолчанию (на мобильных) — элемент будет в .header__menu первым
// При ширине ≥768px — вернётся в исходное место в DOM

"use strict";

class DynamicAdapt {
  constructor(type = "min") {
    this.type = type; // "min" — mobile-first, "max" — desktop-first (старый стиль)
    this.objects = [];
    this.daClassname = "_dynamic_adapt_";
  }

  init() {
    const nodes = document.querySelectorAll("[data-da]");

    if (nodes.length === 0) return;

    // Собираем объекты
    nodes.forEach((node) => {
      const data = node.dataset.da?.trim();
      if (!data) return;

      const [destinationSelector, breakpoint = "768", place = "last"] = data
        .split(",")
        .map((s) => s.trim());

      const destination = document.querySelector(destinationSelector);
      if (!destination) {
        console.warn(
          `DynamicAdapt: destination not found — ${destinationSelector}`
        );
        return;
      }

      this.objects.push({
        element: node,
        parent: node.parentNode,
        destination: destination,
        breakpoint: parseInt(breakpoint),
        place: isNaN(place) ? place : parseInt(place),
        index: this.indexInParent(node.parentNode, node),
      });
    });

    // Сортируем: для mobile-first — по возрастанию брейкпоинта
    this.objects.sort((a, b) => {
      if (a.breakpoint === b.breakpoint) {
        if (typeof a.place === "number" && typeof b.place === "number") {
          return a.place - b.place;
        }
        if (a.place === "first") return -1;
        if (b.place === "first") return 1;
        return 0;
      }
      return this.type === "min"
        ? a.breakpoint - b.breakpoint
        : b.breakpoint - a.breakpoint;
    });

    // Группируем по брейкпоинтам
    const breakpoints = [...new Set(this.objects.map((obj) => obj.breakpoint))];

    breakpoints.forEach((bp) => {
      const mediaQuery = `(min-width: ${bp}px)`;
      const mql = window.matchMedia(mediaQuery);

      const filteredObjects = this.objects.filter(
        (obj) => obj.breakpoint === bp
      );

      const handler = () => {
        if (this.type === "min") {
          // Mobile-first: на больших экранах — возвращаем обратно
          if (mql.matches) {
            this.moveBackAll(filteredObjects);
          } else {
            this.moveToAll(filteredObjects);
          }
        } else {
          // Desktop-first (старое поведение)
          if (mql.matches) {
            this.moveToAll(filteredObjects);
          } else {
            this.moveBackAll(filteredObjects);
          }
        }
      };

      mql.addEventListener("change", handler);
      handler(); // вызов при загрузке
    });
  }

  // Перемещение в целевое место (для мобильных в mobile-first)
  moveToAll(objects) {
    objects.forEach((obj) => {
      if (obj.element.classList.contains(this.daClassname)) return;

      obj.index = this.indexInParent(obj.parent, obj.element); // обновляем индекс на случай изменений
      obj.element.classList.add(this.daClassname);

      this.insertElement(obj.element, obj.destination, obj.place);
    });
  }

  // Возврат в исходное место
  moveBackAll(objects) {
    objects.forEach((obj) => {
      if (!obj.element.classList.contains(this.daClassname)) return;

      obj.element.classList.remove(this.daClassname);
      this.insertElement(obj.element, obj.parent, obj.index);
    });
  }

  // Универсальная вставка элемента
  insertElement(element, container, place) {
    if (place === "first") {
      container.insertAdjacentElement("afterbegin", element);
    } else if (place === "last" || place >= container.children.length) {
      container.insertAdjacentElement("beforeend", element);
    } else if (typeof place === "number") {
      const target = container.children[place];
      if (target) {
        target.insertAdjacentElement("beforebegin", element);
      } else {
        container.insertAdjacentElement("beforeend", element);
      }
    }
  }

  // Получение индекса элемента среди дочерних
  indexInParent(parent, element) {
    return Array.from(parent.children).indexOf(element);
  }
}

// Инициализация — mobile-first по умолчанию
const da = new DynamicAdapt("min"); // "min" = mobile-first
da.init();
