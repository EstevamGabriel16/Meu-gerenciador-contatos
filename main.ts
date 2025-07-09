class Contato {
    constructor(
        public nome: string,
        public contato: string,
        public status: string
    ) { }
}

// Array para guardar contatos
let contatos: Array<Contato> = [];
let indiceEditando: number | null = null;

// Pegar elementos do HTML
const form = document.getElementById("form-contato") as HTMLFormElement;
const inputNome = document.getElementById("nomo") as HTMLInputElement;
const inputContato = document.getElementById("contato") as HTMLInputElement;
const selectStatus = document.getElementById("status") as HTMLSelectElement;
const modal = document.getElementById("form-modal") as HTMLElement;
const botaoNovo = document.getElementById("btn-novo") as HTMLButtonElement;
const botaoCancelar = document.getElementById("btn-cancelar") as HTMLButtonElement;
const tabela = document.getElementById("tabela-contatos") as HTMLTableSectionElement;

// Abrir modal ao clicar em "+ Novo"
botaoNovo.addEventListener("click", () => {
    indiceEditando = null;
    form.reset();
    modal.classList.remove("oculto");
});

// Cancelar / Fechar modal
botaoCancelar.addEventListener("click", () => {
    modal.classList.add("oculto");
    form.reset();
    indiceEditando = null;
});

// Salvar contato
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = inputNome.value.trim();
    const contato = inputContato.value.trim();
    const status = selectStatus.value;

    if (!nome || !contato) {
        alert("Por favor, preencha Nome e Contato!");
        return;
    }

    if (indiceEditando === null) {
        contatos.push(new Contato(nome, contato, status));
    } else {
        contatos[indiceEditando] = new Contato(nome, contato, status);
        indiceEditando = null;
    }

    form.reset();
    modal.classList.add("oculto");
    atualizarTabela();
});

// Atualizar a tabela
function atualizarTabela() {
    tabela.innerHTML = "";

    contatos.forEach((contato, index) => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${contato.nome}</td>
            <td>${contato.contato}</td>
            <td>${contato.status}</td>
            <td>
                <button class="editar" data-index="${index}">✏️</button>
                <button class="apagar" data-index="${index}">🗑️</button>
            </td>
        `;
        tabela.appendChild(tr);
    });

    // Botões de apagar
    const botoesApagar = document.querySelectorAll(".apagar");
    botoesApagar.forEach((botao) => {
        botao.addEventListener("click", () => {
            const index = Number((botao as HTMLButtonElement).dataset.index);
            apagarContato(index);
        });
    });

    // ✅ Botões de editar
    const botoesEditar = document.querySelectorAll(".editar");
    botoesEditar.forEach((botao) => {
        botao.addEventListener("click", () => {
            const index = Number((botao as HTMLButtonElement).dataset.index);
            editarContato(index);
        });
    });
}

// Função editar
function editarContato(index: number) {
    const contato = contatos[index];
    inputNome.value = contato.nome;
    inputContato.value = contato.contato;
    selectStatus.value = contato.status;
    indiceEditando = index;
    modal.classList.remove("oculto");
}

// Função apagar
function apagarContato(index: number) {
    const confirmacao = confirm("Deseja apagar este contato?");
    if (confirmacao) {
        contatos.splice(index, 1);
        atualizarTabela();
    }
}

// Inicializar
atualizarTabela();
