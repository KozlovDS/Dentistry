import "swiper/css";
import "./swiper.scss";
import "swiper/css/grid";
import "swiper/css/scrollbar";

import { Swiper } from "swiper";
import {
  Autoplay,
  Navigation,
  Pagination,
  Grid,
  Scrollbar,
  Thumbs,
} from "swiper/modules";
import autoprefixer from "autoprefixer";

new Swiper(".hero__swiper", {
  modules: [Autoplay, Pagination],
  loop: true, // Зацикливание слайдов
  // autoplay: {
  //   delay: 5000,
  // },
  speed: 1000,
  slidesPerView: 1,
  spaceBetween: 20,
  pagination: {
    el: ".hero__swiper-pagination",
    clickable: true,
  },
});

new Swiper(".doctors__slider", {
  modules: [Navigation],
  slidesPerView: 1,
  spaceBetween: 10,
  navigation: {
    nextEl: ".doctors__slider-button--next",
    prevEl: ".doctors__slider-button--prev",
  },
  breakpoints: {
    768: {
      slidesPerView: 2,
    },
    1280: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
  },
});

new Swiper(".reviews__slider", {
  modules: [Navigation, Grid],
  speed: 1000,
  slidesPerView: 1,
  spaceBetween: 10,
  navigation: {
    nextEl: ".reviews__slider-button--next",
    prevEl: ".reviews__slider-button--prev",
  },
  breakpoints: {
    768: {
      slidesPerView: "1.40",
    },
    1280: {
      slidesPerView: "2",
      grid: {
        rows: 2,
        fill: "row",
      },
    },
    1440: {
      slidesPerView: "2",
      spaceBetween: 40,
      grid: {
        rows: 2,
        fill: "row",
      },
    },
    1920: {
      spaceBetween: 50,
    },
  },
});

new Swiper(".profitable__slider", {
  modules: [Navigation],
  slidesPerView: 1,
  spaceBetween: 20,
  navigation: {
    nextEl: ".profitable__slider-button--next",
    prevEl: ".profitable__slider-button--prev",
  },
  breakpoints: {
    768: {
      slidesPerView: "2",
    },
    1280: {
      slidesPerView: "3",
    },
  },
});

new Swiper(".services-page__slider", {
  modules: [Scrollbar],
  slidesPerView: 1,
  spaceBetween: 10,
  scrollbar: {
    el: ".swiper-scrollbar",
    hide: true,
  },
  breakpoints: {
    440: {
      slidesPerView: "2",
    },
    600: {
      slidesPerView: "3",
    },
    1280: {
      slidesPerView: "5",
    },
    1440: {
      slidesPerView: "6",
    },
    1760: {
      slidesPerView: "7",
    },
  },
});

let swiperDoctors = new Swiper(".doctors-page-thumbs", {
  loop: true,
  spaceBetween: 10,
  slidesPerView: "auto",
  freeMode: true,
  watchSlidesProgress: true,
});
let swiperDoctors2 = new Swiper(".doctors-page-slider", {
  modules: [Thumbs],
  loop: true,
  spaceBetween: 10,
  thumbs: {
    swiper: swiperDoctors,
  },
});

new Swiper(".qualifications__slider", {
  modules: [Navigation],
  slidesPerView: 1,
  spaceBetween: 20,
  navigation: {
    nextEl: ".qualifications__slider-button--next",
    prevEl: ".qualifications__slider-button--prev",
  },
  breakpoints: {
    768: {
      slidesPerView: "2",
    },
    1280: {
      slidesPerView: "3",
    },
  },
});
