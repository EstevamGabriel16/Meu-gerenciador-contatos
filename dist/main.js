"use strict";
// Classe que representa um contato
class Contato {
    constructor(nome, // Nome do contato
    contato, // Telefone ou email
    status // Status: "Bloqueado" ou "Desbloqueado"
    ) {
        this.nome = nome;
        this.contato = contato;
        this.status = status;
    }
}
// Array para armazenar todos os contatos 
let contatos = [];
// Índice para controlar se estamos editando algum contato 
let indiceEditando = null; // null e se for novo
const form = document.getElementById("form-contato"); // Pegando o formulário onde o usuário vai digitar os dados do contato
const inputNome = document.getElementById("nomo"); // Pegando o campo de texto para o nome do contato
const inputContato = document.getElementById("contato"); // Pegando o campo de texto para o telefone ou email do contato
const selectStatus = document.getElementById("status"); // Pegando o campo seletor para o status do contato (Bloqueado ou Desbloqueado)
const modal = document.getElementById("form-modal"); // Pegando o modal (janela que aparece para adicionar/editar contato)
const btnNovo = document.getElementById("btn-novo"); // Pegando o botão "+ Novo" que abre o formulário para adicionar contato novo
const btnCancelar = document.getElementById("btn-cancelar"); // Pegando o botão "Cancelar" dentro do formulário para fechar o modal sem salvar
const tabela = document.getElementById("tabela-contatos"); // Pegando o corpo da tabela onde os contatos serão listados (elemento <tbody>)
// Ao clicar no botão "Novo", abrir o modal para adicionar contato novo
btnNovo.addEventListener("click", () => {
    indiceEditando = null; // Não estamos editando ninguém
    form.reset(); // Limpar formulário
    modal.classList.remove("oculto"); // Mostrar modal
});
// Ao clicar em "Cancelar", fechar o modal e limpar o formulário
btnCancelar.addEventListener("click", () => {
    modal.classList.add("oculto"); // Esconder modal
    form.reset(); // Limpar formulário
    indiceEditando = null; // Cancelar edição
});
// Quando o formulário for enviado (adicionar ou editar)
form.addEventListener("submit", (e) => {
    e.preventDefault(); // Evita recarregar a página
    // Pegar os valores digitados no formulário
    const nome = inputNome.value.trim();
    const contato = inputContato.value.trim();
    const status = selectStatus.value;
    // Validar campos obrigatórios
    if (!nome || !contato) {
        alert("Preencha todos os campos!");
        return;
    }
    // Criar novo contato com os dados do formulário
    const novoContato = new Contato(nome, contato, status);
    // Se estiver adicionando (não editando)
    if (indiceEditando === null) {
        //verificar se já existe um contato com o mesmo número
        const numeroJaExiste = contatos.some(c => c.contato === contato);
        if (numeroJaExiste) {
            alert('Este número já está cadastrado!');
            return;
        }
        //Adiciona o novo contato na array
        contatos.push(novoContato);
    }
    else {
        //atualizar o proprio numero mesmo que seja igual
        const numeroJaExiste = contatos.some((c, i) => c.contato === contato && i !== indiceEditando);
        if (numeroJaExiste) {
            alert('Este número já está cadastrado em outro contato!');
            return;
        }
        contatos[indiceEditando] = novoContato; // Atualiza contato existente
        indiceEditando = null; // Limpa índice edição
    }
    salvarNoLocalStorage(); // Salvar dados atualizados no navegador
    form.reset(); // Limpar formulário
    modal.classList.add("oculto"); // Fechar modal
    atualizarTabela(); // Atualizar tabela na tela
});
// Função para atualizar a tabela de contatos na tela
function atualizarTabela() {
    tabela.innerHTML = ""; // Limpa tabela
    // Para cada contato, criar uma linha com os dados e botões
    contatos.forEach((contato, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${contato.nome}</td>
      <td>${contato.contato}</td>
      <td>${contato.status === "Bloqueado" ? "🔒 Bloqueado" : "✅ Desbloqueado"}</td>
      <td>
        <button class="editar" data-index="${index}">✏️</button>
        <button class="apagar" data-index="${index}">🗑️</button>
      </td>
    `;
        tabela.appendChild(tr); // Adiciona linha na tabela
    });
    // Ativa botões "Editar"
    document.querySelectorAll(".editar").forEach((btn) => btn.addEventListener("click", () => {
        const i = Number(btn.dataset.index);
        editarContato(i);
    }));
    // Ativa botões "Apagar"
    document.querySelectorAll(".apagar").forEach((btn) => btn.addEventListener("click", () => {
        const i = Number(btn.dataset.index);
        apagarContato(i);
    }));
}
// Função para preencher o formulário e abrir modal para editar contato
function editarContato(index) {
    const c = contatos[index];
    inputNome.value = c.nome;
    inputContato.value = c.contato;
    selectStatus.value = c.status;
    indiceEditando = index; // Marca o contato que está sendo editado
    modal.classList.remove("oculto"); // Abre modal
}
// Função para apagar contato da lista
function apagarContato(index) {
    if (confirm("Deseja apagar este contato?")) {
        contatos.splice(index, 1); // Remove contato do array
        salvarNoLocalStorage(); // Atualiza dados no navegador
        atualizarTabela(); // Atualiza tabela na tela
    }
}
// Função para salvar contatos no localStorage do navegador
function salvarNoLocalStorage() {
    localStorage.setItem("contatos", JSON.stringify(contatos));
}
// Função para carregar contatos do localStorage ao abrir página
function carregarDoLocalStorage() {
    const dados = localStorage.getItem("contatos");
    if (dados)
        contatos = JSON.parse(dados);
}
// Ao carregar a página, carrega os contatos e atualiza a tabela
carregarDoLocalStorage();
atualizarTabela();
