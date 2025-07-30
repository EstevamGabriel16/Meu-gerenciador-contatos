"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const csv_export_js_1 = require("./csv-export.js");
class Contato {
    constructor(nome, contato, email, status, categoria) {
        this.nome = nome;
        this.contato = contato;
        this.email = email;
        this.status = status;
        this.categoria = categoria;
    }
}
let contatos = [];
let indiceEditando = null;
const form = document.getElementById("form-contato");
const inputNome = document.getElementById("nomo");
const inputContato = document.getElementById("contato");
const inputEmail = document.getElementById("email");
const selectStatus = document.getElementById("status");
const inputCategoria = document.getElementById("categoria");
const modal = document.getElementById("form-modal");
const btnNovo = document.getElementById("btn-novo");
const btnCancelar = document.getElementById("btn-cancelar");
const tabela = document.getElementById("tabela-contatos");
const busca = document.getElementById("barra-pesquisa");
btnNovo.onclick = () => {
    indiceEditando = null;
    form.reset();
    modal.classList.remove("oculto");
};
btnCancelar.onclick = () => {
    modal.classList.add("oculto");
    form.reset();
};
form.onsubmit = (e) => {
    e.preventDefault();
    const nome = inputNome.value.trim();
    const contato = inputContato.value.trim();
    const email = inputEmail.value.trim();
    const status = selectStatus.value;
    const categoria = inputCategoria.value.trim();
    const novoContato = new Contato(nome, contato, email, status, categoria);
    if (indiceEditando === null) {
        contatos.push(novoContato);
    }
    else {
        contatos[indiceEditando] = novoContato;
        indiceEditando = null;
    }
    salvar();
    form.reset();
    modal.classList.add("oculto");
    atualizarTabela();
};
function atualizarTabela(lista = contatos) {
    tabela.innerHTML = "";
    lista.forEach((c, i) => {
        tabela.innerHTML += `
      <tr>
        <td>${c.nome}</td>
        <td>${c.contato}</td>
        <td>${c.email}</td>
        <td>${c.status}</td>
        <td>${c.categoria}</td>
        <td>
          <button onclick="editar(${i})">✏️</button>
          <button onclick="apagar(${i})">🗑️</button>
        </td>
      </tr>
    `;
    });
}
window.editar = (i) => {
    const c = contatos[i];
    inputNome.value = c.nome;
    inputContato.value = c.contato;
    inputEmail.value = c.email;
    selectStatus.value = c.status;
    inputCategoria.value = c.categoria;
    indiceEditando = i;
    modal.classList.remove("oculto");
};
window.apagar = (i) => {
    if (confirm("Apagar contato?")) {
        contatos.splice(i, 1);
        salvar();
        atualizarTabela();
    }
};
function salvar() {
    localStorage.setItem("contatos", JSON.stringify(contatos));
}
function carregar() {
    const dados = localStorage.getItem("contatos");
    if (dados)
        contatos = JSON.parse(dados);
}
busca.oninput = () => {
    const termo = busca.value.toLowerCase().trim();
    const filtrados = contatos.filter(c => c.nome.toLowerCase().includes(termo) ||
        c.contato.includes(termo) ||
        c.email.toLowerCase().includes(termo) ||
        c.categoria.toLowerCase().includes(termo));
    atualizarTabela(filtrados);
};
const btnExportar = document.getElementById("btn-exportar");
(0, csv_export_js_1.setupCSVExport)(() => contatos, btnExportar);
carregar();
atualizarTabela();
