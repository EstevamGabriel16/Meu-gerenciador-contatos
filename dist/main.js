"use strict";
// Classe que representa um contato
class Contato {
    constructor(nome, contato, email, status, categoria) {
        this.nome = nome;
        this.contato = contato;
        this.email = email;
        this.status = status;
        this.categoria = categoria;
    }
}
// Estado
let contatos = [];
let indiceEditando = null;
// Elementos (mantendo os IDs originais do HTML)
const form = document.getElementById("form-contato");
const inputNome = document.getElementById("nome"); // Corrigido de 'nomo' para 'nome'
const inputContato = document.getElementById("contato");
const inputEmail = document.getElementById("email");
const selectStatus = document.getElementById("status");
const modal = document.getElementById("form-modal");
const btnNovo = document.getElementById("btn-novo");
const btnCancelar = document.getElementById("btn-cancelar");
const tabela = document.getElementById("tabela-contatos");
const busca = document.getElementById("barra-pesquisa");
const btnExportar = document.getElementById("btn-exportar");
const inputCategoria = document.getElementById("categoria");
// Utilidades
const salvarNoLocalStorage = () => {
    localStorage.setItem("contatos", JSON.stringify(contatos));
};
const carregarDoLocalStorage = () => {
    const dados = localStorage.getItem("contatos");
    if (dados)
        contatos = JSON.parse(dados);
};
// Validação de e-mail
const validarEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};
// UI
btnNovo.onclick = () => {
    indiceEditando = null;
    form.reset();
    modal.classList.remove("oculto");
};
btnCancelar.onclick = () => {
    modal.classList.add("oculto");
    form.reset();
    indiceEditando = null;
};
form.onsubmit = e => {
    e.preventDefault();
    const nome = inputNome.value.trim();
    const contato = inputContato.value.trim();
    const email = inputEmail.value.trim();
    const status = selectStatus.value;
    const categoria = inputCategoria.value.trim();
    if (!nome || !contato || !email) {
        alert("Preencha todos os campos!");
        return;
    }
    if (!validarEmail(email)) {
        alert("Por favor, insira um e-mail válido!");
        return;
    }
    const novoContato = new Contato(nome, contato, email, status, categoria);
    if (indiceEditando === null) {
        if (contatos.some(c => c.contato === contato)) {
            alert("Este número já está cadastrado!");
            return;
        }
        contatos.push(novoContato);
    }
    else {
        if (contatos.some((c, i) => c.contato === contato && i !== indiceEditando)) {
            alert("Este número já está cadastrado em outro contato!");
            return;
        }
        contatos[indiceEditando] = novoContato;
        indiceEditando = null;
    }
    salvarNoLocalStorage();
    modal.classList.add("oculto");
    atualizarTabela();
};
function atualizarTabela(lista = contatos) {
    tabela.innerHTML = "";
    lista.forEach((c, index) => {
        tabela.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${c.nome}</td>
        <td>${c.contato}</td>
        <td>${c.email}</td>
        <td>${c.status}</td>
        <td>${c.categoria}</td>
        <td>
          <button class="editar" data-i="${index}">✏️</button>
          <button class="apagar" data-i="${index}">🗑️</button>
        </td>
      </tr>`);
    });
    tabela.querySelectorAll("button.editar").forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-i') || '0');
            editarContato(index);
        });
    });
    tabela.querySelectorAll("button.apagar").forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-i') || '0');
            apagarContato(index);
        });
    });
}
function editarContato(i) {
    // Verificação mais robusta do índice
    if (i < 0 || i >= contatos.length) {
        console.error(`Índice inválido para edição: ${i}`);
        return false;
    }
    // Verifica se os elementos do formulário existem
    if (!inputNome || !inputContato || !inputEmail || !selectStatus || !inputCategoria) {
        console.error('Elementos do formulário não encontrados!');
        return false;
    }
    try {
        const c = contatos[i];
        // Preenche os campos do formulário
        inputNome.value = c.nome;
        inputContato.value = c.contato;
        inputEmail.value = c.email;
        selectStatus.value = c.status;
        inputCategoria.value = c.categoria;
        // Atualiza o índice sendo editado
        indiceEditando = i;
        // Mostra o modal
        modal.classList.remove("oculto");
        return true;
    }
    catch (error) {
        console.error('Erro ao editar contato:', error);
        return false;
    }
}
function apagarContato(i) {
    if (i < 0 || i >= contatos.length)
        return;
    if (confirm(`Deseja apagar o contato "${contatos[i].nome}"?`)) {
        contatos.splice(i, 1);
        salvarNoLocalStorage();
        atualizarTabela();
    }
}
// Barra de pesquisa
// Barra de pesquisa
if (busca) {
    busca.addEventListener('input', () => {
        const termo = busca.value.toLowerCase().trim();
        const resultados = termo
            ? contatos.filter(c => c.nome.toLowerCase().includes(termo) ||
                c.contato.includes(termo) ||
                c.email.toLowerCase().includes(termo) ||
                c.status.toLowerCase().includes(termo) ||
                (c.categoria && c.categoria.toLowerCase().includes(termo)))
            : contatos;
        atualizarTabela(resultados);
    });
}
// Exportar para CSV
btnExportar.addEventListener('click', () => {
    if (contatos.length === 0) {
        alert("Não há contatos para exportar!");
        return;
    }
    const csv = [
        ['Nome', 'Contato', 'E-mail', 'Status', 'Categoria',],
        ...contatos.map(c => [c.nome, c.contato, c.email, c.status, c.categoria,])
            .map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contatos.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
// Inicialização
carregarDoLocalStorage();
atualizarTabela();
