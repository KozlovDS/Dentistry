// plugins/tabs.js

(() => {
  // Защищаем от повторной инициализации
  if (window.tabsPluginInitialized) return;
  window.tabsPluginInitialized = true;

  const defaultOptions = {
    isChanged: () => {},
  };

  // Автоматически находим все элементы с атрибутом data-tabs
  const tabsContainers = document.querySelectorAll("[data-tabs]");

  if (tabsContainers.length === 0) {
    // Если ничего не найдено — тихо выходим (можно раскомментировать для дебага)
    // console.warn("Табы с атрибутом data-tabs не найдены на странице");
    return;
  }

  tabsContainers.forEach((container) => {
    const selector = container.getAttribute("data-tabs");
    const tabList = container.querySelector(".tabs__nav");
    if (!tabList) return;

    const buttons = Array.from(tabList.querySelectorAll(".tabs__nav-btn"));
    const panels = Array.from(container.querySelectorAll(".tabs__panel"));

    if (buttons.length === 0 || panels.length === 0) return;

    // Если количество не совпадает — предупреждаем, но продолжаем работать с тем, что есть
    if (buttons.length !== panels.length) {
      console.warn(
        `[data-tabs="${selector}"]: Количество кнопок (${buttons.length}) и панелей (${panels.length}) не совпадает`
      );
    }

    let activeIndex = buttons.findIndex((btn) =>
      btn.classList.contains("tabs__nav-btn--active")
    );
    if (activeIndex === -1) activeIndex = 0;

    // Инициализация ARIA
    tabList.setAttribute("role", "tablist");

    buttons.forEach((btn, i) => {
      btn.setAttribute("role", "tab");
      btn.setAttribute("id", `${selector}-tab-${i + 1}`);
      btn.setAttribute("aria-controls", `${selector}-panel-${i + 1}`);
    });

    panels.forEach((panel, i) => {
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", buttons[i].id);
      panel.setAttribute("id", `${selector}-panel-${i + 1}`);
    });

    const deactivateAll = () => {
      buttons.forEach((btn) => {
        btn.classList.remove("tabs__nav-btn--active");
        btn.setAttribute("tabindex", "-1");
        btn.setAttribute("aria-selected", "false");
      });
      panels.forEach((panel) => panel.classList.remove("tabs__panel--active"));
    };

    const activate = (index) => {
      if (index < 0 || index >= buttons.length) return;

      deactivateAll();

      const btn = buttons[index];
      const panel = panels[index];

      btn.classList.add("tabs__nav-btn--active");
      btn.removeAttribute("tabindex");
      btn.setAttribute("aria-selected", "true");
      btn.focus();

      panel.classList.add("tabs__panel--active");

      // Передаём полезные данные в callback, если он задан где-то снаружи
      if (window[`tabsChanged_${selector}`]) {
        window[`tabsChanged_${selector}`]({
          container,
          activeIndex: index,
          button: btn,
          panel,
        });
      }

      // Глобальный callback (если нужно общее событие)
      if (window.onTabsChanged) {
        window.onTabsChanged({
          selector,
          container,
          activeIndex: index,
          button: btn,
          panel,
        });
      }
    };

    // Начальная активация
    activate(activeIndex);

    // Обработчики
    const handleClick = (e) => {
      const index = buttons.indexOf(e.currentTarget);
      if (index !== activeIndex) {
        activeIndex = index;
        activate(index);
      }
    };

    const handleKeydown = (e) => {
      const index = buttons.indexOf(e.currentTarget);
      let newIndex = null;

      switch (e.key) {
        case "ArrowLeft":
        case "ArrowUp":
          newIndex = (index - 1 + buttons.length) % buttons.length;
          break;
        case "ArrowRight":
        case "ArrowDown":
          newIndex = (index + 1) % buttons.length;
          break;
        case "Home":
          newIndex = 0;
          break;
        case "End":
          newIndex = buttons.length - 1;
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (index !== activeIndex) {
            activeIndex = index;
            activate(index);
          }
          return;
      }

      if (newIndex !== null) {
        e.preventDefault();
        activeIndex = newIndex;
        activate(newIndex);
      }
    };

    buttons.forEach((btn) => {
      btn.addEventListener("click", handleClick);
      btn.addEventListener("keydown", handleKeydown);
    });

    // Сохраняем метод активации на контейнере (для внешнего управления, если нужно)
    container.activateTab = (index) => activate(index);
  });
})();
