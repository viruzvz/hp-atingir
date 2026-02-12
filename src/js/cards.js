document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("cardModal");

  modal.addEventListener("show.bs.modal", function (event) {
    const button = event.relatedTarget;

    const nome = button.getAttribute("data-nome");
    const foto = button.getAttribute("data-foto");
    const curriculo = button.getAttribute("data-curriculo");

    const modalNome = modal.querySelector("#modalNome");
    const modalFoto = modal.querySelector("#modalFoto");
    const modalCurriculo = modal.querySelector("#modalCurriculo");

    modalNome.textContent = nome;
    modalFoto.src = foto;
    modalFoto.alt = nome;
    modalCurriculo.textContent = curriculo;
  });
});