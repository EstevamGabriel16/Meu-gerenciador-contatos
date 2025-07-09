"use strict";
class Contato {
    constructor(nome, contato, status) {
        this.nome = nome;
        this.contato = contato;
        this.status = status;
    }
}
// Array para guardar contatos
let contatos = [];
const form = document.getElementById("form-contato");
const inputNome = document.getElementById("nomo");
const inputContato = document.getElementById("contato");
const selectStatus = document.getElementById("status");
const modal = document.getElementById("form-modal");
const botaoNovo = document.getElementById("btn-novo");
const botaoCancelar = document.getElementById("btn-cancelar");
const tabela = document.getElementById("tabela-contatos");
botaoNovo.addEventListener("click", () => {
    modal.classList.remove("oculto");
});
botaoCancelar.addEventListener("click", () => {
    modal.classList.add("oculto");
    form.reset();
});
form.addEventListener("submit", (e) => {
    e.preventDefault();
    let nome = inputNome.value;
    let contato = inputContato.value;
    let status = selectStatus.value;
    contatos.push(new Contato(nome, contato, status));
    form.reset();
    modal.classList.add("oculto");
    atualizarTabela();
});
function atualizarTabela() {
    tabela.innerHTML = "";
    contatos.forEach((contato) => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${contato.nome}</td>
      <td>${contato.contato}</td>
      <td>${contato.status}</td>
      <td></td>
    `;
        tabela.appendChild(tr);
    });
}
