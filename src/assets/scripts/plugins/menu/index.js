import "./burger.scss";

document.querySelector(".burger-button").addEventListener(
  "click",
  function () {
    document.querySelector(".menu").classList.toggle("active");
    document.querySelector(".burger-button").classList.toggle("active");
  },
  false
);
