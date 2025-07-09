"use strict";
// Classe para representar um contato
class Contato {
    constructor(nome, // Nome do contato
    contato, // Telefone ou email
    status // Status: Bloqueado ou Desbloqueado
    ) {
        this.nome = nome;
        this.contato = contato;
        this.status = status;
    }
}
// Arrays para armazenar os contatos
let contatos = []; // Contatos desbloqueados
let bloqueados = []; // Contatos bloqueados
// Variável para saber se estamos editando um contato
let indiceEditando = null;
// Pegando os elementos do HTML (por ID)
const form = document.getElementById("form-contato");
const inputNome = document.getElementById("nomo");
const inputContato = document.getElementById("contato");
const selectStatus = document.getElementById("status");
const modal = document.getElementById("form-modal");
const btnNovo = document.getElementById("btn-novo");
const btnCancelar = document.getElementById("btn-cancelar");
const tabela = document.getElementById("tabela-contatos");
// Quando clicar no botão "Novo"
btnNovo.addEventListener("click", () => {
    indiceEditando = null; // Não estamos editando ninguém
    form.reset(); // Limpa o formulário
    modal.classList.remove("oculto"); // Mostra o formulário
});
// Quando clicar no botão "Cancelar"
btnCancelar.addEventListener("click", () => {
    modal.classList.add("oculto"); // Esconde o formulário
    form.reset(); // Limpa o formulário
    indiceEditando = null; // Cancela qualquer edição
});
// Quando o formulário for enviado
form.addEventListener("submit", (e) => {
    e.preventDefault(); // Evita o recarregamento da página
    // Pegamos os valores do formulário
    const nome = inputNome.value.trim();
    const contato = inputContato.value.trim();
    const status = selectStatus.value;
    // Se nome ou contato estiverem vazios, mostra alerta
    if (!nome || !contato) {
        alert("Preencha todos os campos!");
        return;
    }
    // Criamos um novo objeto Contato
    const novo = new Contato(nome, contato, status);
    // Se for um novo contato
    if (indiceEditando === null) {
        // Se for bloqueado, vai para o array bloqueados
        if (status === "Bloqueado") {
            bloqueados.push(novo);
        }
        else {
            contatos.push(novo); // Senão, vai para o array contatos
        }
    }
    else {
        // Se estiver editando um contato existente
        if (status === "Bloqueado") {
            bloqueados.push(novo); // Manda para o array de bloqueados
            contatos.splice(indiceEditando, 1); // Remove dos desbloqueados
        }
        else {
            contatos[indiceEditando] = novo; // Atualiza o contato
        }
        indiceEditando = null; // Finaliza a edição
    }
    salvarNoLocalStorage(); // Salva no navegador
    form.reset(); // Limpa o formulário
    modal.classList.add("oculto"); // Fecha o formulário
    atualizarTabela(); // Atualiza a tabela na tela
});
// Atualiza a tabela com os contatos
function atualizarTabela() {
    tabela.innerHTML = ""; // Limpa a tabela
    // Para cada contato, cria uma linha na tabela
    contatos.forEach((contato, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${contato.nome}</td>
      <td>${contato.contato}</td>
      <td>${contato.status}</td>
      <td>
        <button class="editar" data-index="${index}">✏️</button>
        <button class="apagar" data-index="${index}">🗑️</button>
      </td>
    `;
        tabela.appendChild(tr); // Adiciona a linha na tabela
    });
    // Ativa os botões de editar
    document.querySelectorAll(".editar").forEach((btn) => btn.addEventListener("click", () => {
        const i = Number(btn.dataset.index);
        editarContato(i); // Chama função para editar
    }));
    // Ativa os botões de apagar
    document.querySelectorAll(".apagar").forEach((btn) => btn.addEventListener("click", () => {
        const i = Number(btn.dataset.index);
        apagarContato(i); // Chama função para apagar
    }));
}
// Função para editar um contato
function editarContato(index) {
    const c = contatos[index]; // Pega o contato
    inputNome.value = c.nome; // Coloca os dados no formulário
    inputContato.value = c.contato;
    selectStatus.value = c.status;
    indiceEditando = index; // Guarda o índice para edição
    modal.classList.remove("oculto"); // Abre o formulário
}
// Função para apagar um contato
function apagarContato(index) {
    if (confirm("Deseja apagar este contato?")) {
        contatos.splice(index, 1); // Remove do array
        salvarNoLocalStorage(); // Atualiza no localStorage
        atualizarTabela(); // Atualiza a tabela
    }
}
// Salva os dados no navegador
function salvarNoLocalStorage() {
    localStorage.setItem("contatos", JSON.stringify(contatos));
    localStorage.setItem("bloqueados", JSON.stringify(bloqueados));
}
// Carrega os dados salvos no navegador
function carregarDoLocalStorage() {
    const dadosContatos = localStorage.getItem("contatos");
    const dadosBloqueados = localStorage.getItem("bloqueados");
    if (dadosContatos)
        contatos = JSON.parse(dadosContatos);
    if (dadosBloqueados)
        bloqueados = JSON.parse(dadosBloqueados);
}
// Quando a página carrega, chamamos isso:
carregarDoLocalStorage(); // Carrega os dados salvos
atualizarTabela(); // Mostra os contatos na tela
