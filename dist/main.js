"use strict";
// =======================
// Classe que representa um contato
// =======================
class Contato {
    constructor(nome, contato, email, status, // "bloqueado" ou "desbloqueado"
    categoria // Ex: "Amigos", "Trabalho"...
    ) {
        this.nome = nome;
        this.contato = contato;
        this.email = email;
        this.status = status;
        this.categoria = categoria;
    }
}
// =======================
// Estado da aplicação
// =======================
let contatos = []; // Lista de todos os contatos
let indiceEditando = null; // Guarda o índice de um contato em edição
// =======================
// Seleção de elementos HTML
// =======================
const form = document.getElementById("form-contato");
const inputNome = document.getElementById("nome");
const inputContato = document.getElementById("contato");
const inputEmail = document.getElementById("email");
const selectStatus = document.getElementById("status");
const modal = document.getElementById("form-modal");
const btnNovo = document.getElementById("btn-novo");
const btnCancelar = document.getElementById("btn-cancelar");
const tabela = document.getElementById("tabela-contatos");
const busca = document.getElementById("barra-pesquisa");
const inputCategoria = document.getElementById("categoria");
const btnExportar = document.getElementById("btn-exportar");
// =======================
// Funções de persistência
// =======================
// Salva a lista de contatos no navegador
const salvarNoLocalStorage = () => {
    localStorage.setItem("contatos", JSON.stringify(contatos));
};
// Carrega a lista de contatos do navegador
const carregarDoLocalStorage = () => {
    const dados = localStorage.getItem("contatos");
    if (dados)
        contatos = JSON.parse(dados);
};
// =======================
// Função utilitária: validar e-mail
// =======================
const validarEmail = (email) => {
    const re = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return re.test(email);
};
// =======================
// Ordena contatos por nome (ignora acentos)
// =======================
function ordenarContatos() {
    contatos.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }));
}
// =======================
// Eventos de UI
// =======================
// Abrir modal de novo contato
btnNovo.onclick = () => {
    indiceEditando = null;
    form.reset();
    modal.classList.remove("oculto");
};
// Cancelar e fechar modal
btnCancelar.onclick = () => {
    modal.classList.add("oculto");
    form.reset();
    indiceEditando = null;
};
// Salvar contato (novo ou edição)
form.onsubmit = e => {
    e.preventDefault();
    // Pega os valores digitados
    const nome = inputNome.value.trim();
    const contato = inputContato.value.trim();
    const email = inputEmail.value.trim();
    const status = selectStatus.value;
    const categoria = inputCategoria.value.trim();
    // Valida campos obrigatórios
    if (!nome || !contato || !email) {
        showAlert("Preencha todos os campos!");
        return;
    }
    // Valida formato de e-mail
    if (!validarEmail(email)) {
        showAlert("Por favor, insira um e-mail válido!");
        return;
    }
    // Valida que contato é apenas números
    if (!/^\d+$/.test(contato)) {
        showAlert("Por favor, insira apenas números no campo de contato!");
        return;
    }
    // Cria o objeto contato
    const novoContato = new Contato(nome, contato, email, status, categoria);
    // Evita números duplicados
    if (indiceEditando === null) {
        if (contatos.some(c => c.contato === contato)) {
            showAlert("Este número já está cadastrado!");
            return;
        }
        contatos.push(novoContato); // Novo contato
    }
    else {
        if (contatos.some((c, i) => c.contato === contato && i !== indiceEditando)) {
            showAlert("Este número já está cadastrado em outro contato!");
            return;
        }
        contatos[indiceEditando] = novoContato; // Atualiza contato existente
        indiceEditando = null;
    }
    // Salva, ordena e atualiza tabela
    ordenarContatos();
    salvarNoLocalStorage();
    modal.classList.add("oculto");
    atualizarTabela();
};
// =======================
// Atualiza tabela de contatos na tela
// =======================
function atualizarTabela(lista = contatos) {
    tabela.innerHTML = "";
    lista.forEach((c, index) => {
        tabela.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${c.nome}</td>
        <td>${c.contato}</td>
        <td>${c.email}</td>
        <td>${c.status === "bloqueado" ? "🔒 Bloqueado" : "✅ Desbloqueado"}</td>
        <td>${c.categoria}</td>
        <td>
          <button class="editar" data-i="${index}">✏️</button>
          <button class="apagar" data-i="${index}">🗑️</button>
        </td>
      </tr>
    `);
    });
    // Botões de edição
    tabela.querySelectorAll("button.editar").forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-i') || '0');
            editarContato(index);
        });
    });
    // Botões de exclusão
    tabela.querySelectorAll("button.apagar").forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-i') || '0');
            apagarContato(index);
        });
    });
}
// =======================
// Editar um contato existente
// =======================
function editarContato(i) {
    const c = contatos[i];
    inputNome.value = c.nome;
    inputContato.value = c.contato;
    inputEmail.value = c.email;
    selectStatus.value = c.status;
    inputCategoria.value = c.categoria;
    indiceEditando = i;
    modal.classList.remove("oculto");
}
// =======================
// Apagar um contato
// =======================
function apagarContato(i) {
    if (confirm(`Deseja apagar o contato "${contatos[i].nome}"?`)) {
        contatos.splice(i, 1);
        salvarNoLocalStorage();
        atualizarTabela();
    }
}
// =======================
// Pesquisa em tempo real
// =======================
busca.addEventListener('input', () => {
    const termo = busca.value.toLowerCase().trim();
    const resultados = termo
        ? contatos.filter(c => c.nome.toLowerCase().includes(termo) ||
            c.contato.includes(termo) ||
            c.email.toLowerCase().includes(termo) ||
            c.status.toLowerCase().includes(termo) ||
            c.categoria.toLowerCase().includes(termo))
        : contatos;
    atualizarTabela(resultados);
});
// =======================
// Exportar lista para CSV
// =======================
btnExportar.addEventListener('click', () => {
    if (contatos.length === 0) {
        showAlert("Não há contatos para exportar!");
        return;
    }
    const csv = [
        ['Nome', 'Contato', 'E-mail', 'Status', 'Categoria'],
        ...contatos.map(c => [c.nome, c.contato, c.email, c.status, c.categoria])
    ]
        .map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contatos.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
// =======================
// Alerta customizado
// =======================
function showAlert(mensagem) {
    const alertDiv = document.getElementById('customAlert');
    const message = document.getElementById('alertMessage');
    const closeBtn = document.getElementById('alertClose');
    if (!alertDiv || !message || !closeBtn) {
        alert(mensagem); // fallback se o elemento não existir
        return;
    }
    message.textContent = mensagem;
    alertDiv.style.display = 'block';
    closeBtn.onclick = () => alertDiv.style.display = 'none';
}
// =======================
// Inicialização
// =======================
carregarDoLocalStorage();
atualizarTabela();
