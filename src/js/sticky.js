document.addEventListener("DOMContentLoaded", function () {
  const toggler = document.querySelector(".custom-toggler");
  const navbar = document.getElementById("navbarNav");

  toggler.addEventListener("click", function () {
    this.classList.toggle("active");
  });

  navbar.addEventListener("hidden.bs.collapse", function () {
    toggler.classList.remove("active");
  });
});