/**
 * Mouse Parallax Plugin
 * Независимый плагин параллакс-эффекта за движением мыши
 * Автор: адаптация под независимый модуль (на основе кода Хмурого Кота)
 *
 * Использование:
 * 1. Элементу, который будет двигаться — атрибут data-prlx-mouse
 * 2. Опционально родительскому контейнеру — data-prlx-mouse-wrapper (чтобы отслеживать мышь только внутри него)
 *
 * Доступные data-атрибуты:
 * - data-prlx-cx="100"     — коэффициент сдвига по X (чем больше — тем меньше сдвиг)
 * - data-prlx-cy="100"     — коэффициент сдвига по Y
 * - data-prlx-dxr          — движение против оси X
 * - data-prlx-dyr          — движение против оси Y
 * - data-prlx-a="50"       — скорость анимации (чем больше — тем быстрее)
 */

(function () {
  "use strict";

  class MouseParallax {
    constructor() {
      this.elements = document.querySelectorAll("[data-prlx-mouse]");
      if (this.elements.length === 0) {
        console.log(
          "[MouseParallax] Нет элементов с атрибутом data-prlx-mouse"
        );
        return;
      }

      this.init();
      console.log(
        `[MouseParallax] Инициализировано элементов: ${this.elements.length}`
      );
    }

    init() {
      this.elements.forEach((el) => {
        const wrapper = el.closest("[data-prlx-mouse-wrapper]");

        // Параметры из data-атрибутов
        const cx = parseFloat(el.dataset.prlxCx) || 100;
        const cy = parseFloat(el.dataset.prlxCy) || 100;
        const dx = el.hasAttribute("data-prlx-dxr") ? -1 : 1;
        const dy = el.hasAttribute("data-prlx-dyr") ? -1 : 1;
        const speed = parseFloat(el.dataset.prlxA) || 50;

        let posX = 0;
        let posY = 0;
        let targetX = 0;
        let targetY = 0;

        const updatePosition = () => {
          posX += (targetX - posX) * (speed / 1000);
          posY += (targetY - posY) * (speed / 1000);

          el.style.transform = `translate3d(${(dx * posX) / (cx / 10)}%, ${
            (dy * posY) / (cy / 10)
          }%, 0)`;

          requestAnimationFrame(updatePosition);
        };

        const handleMouseMove = (e) => {
          const rect = el.getBoundingClientRect();
          const elTop = rect.top + window.scrollY;
          const elBottom = elTop + rect.height;

          // Проверяем, находится ли элемент в области видимости
          if (
            elBottom < window.scrollY ||
            elTop > window.scrollY + window.innerHeight
          ) {
            return;
          }

          // Размеры области отслеживания
          const areaWidth = wrapper ? wrapper.clientWidth : window.innerWidth;
          const areaHeight = wrapper
            ? wrapper.clientHeight
            : window.innerHeight;

          // Координаты относительно центра области
          const mouseX =
            e.clientX - (wrapper ? wrapper.getBoundingClientRect().left : 0);
          const mouseY =
            e.clientY -
            (wrapper
              ? wrapper.getBoundingClientRect().top + window.scrollY
              : 0);

          const centerX = mouseX - areaWidth / 2;
          const centerY = mouseY - areaHeight / 2;

          targetX = (centerX / areaWidth) * 100;
          targetY = (centerY / areaHeight) * 100;
        };

        // Подписываемся на событие
        if (wrapper) {
          wrapper.addEventListener("mousemove", handleMouseMove);
          // Опционально: поддержка touch-устройств
          wrapper.addEventListener("touchmove", (e) => {
            if (e.touches.length > 0) {
              handleMouseMove(e.touches[0]);
            }
          });
        } else {
          window.addEventListener("mousemove", handleMouseMove);
          window.addEventListener(
            "touchmove",
            (e) => {
              if (e.touches.length > 0) {
                handleMouseMove(e.touches[0]);
              }
            },
            { passive: true }
          );
        }

        // Запускаем анимацию
        updatePosition();
      });
    }
  }

  // Автозапуск при загрузке DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => new MouseParallax());
  } else {
    new MouseParallax();
  }

  // Экспорт для модульных систем (опционально)
  if (typeof module !== "undefined" && module.exports) {
    module.exports = MouseParallax;
  } else if (typeof window !== "undefined") {
    window.MouseParallax = MouseParallax;
  }
})();
