// =======================
// Classe que representa um contato
// =======================
class Contato {
  constructor(
    public nome: string,
    public contato: string,
    public email: string,
    public status: string,    // "bloqueado" ou "desbloqueado"
    public categoria: string  // Ex: "Amigos", "Trabalho"...
  ) {}
}

// =======================
// Estado da aplicação
// =======================
let contatos: Contato[] = [];       // Lista de contatos
let indiceEditando: number | null = null; // Índice do contato que está sendo editado

// =======================
// Seleção de elementos HTML
// =======================
const form           = document.getElementById("form-contato")     as HTMLFormElement;
const inputNome      = document.getElementById("nome")             as HTMLInputElement;
const inputContato   = document.getElementById("contato")          as HTMLInputElement;
const inputEmail     = document.getElementById("email")            as HTMLInputElement;
const selectStatus   = document.getElementById("status")           as HTMLSelectElement;
const modal          = document.getElementById("form-modal")       as HTMLElement;
const btnNovo        = document.getElementById("btn-novo")         as HTMLButtonElement;
const btnCancelar    = document.getElementById("btn-cancelar")     as HTMLButtonElement;
const tabela         = document.getElementById("tabela-contatos")  as HTMLTableSectionElement;
const busca          = document.getElementById("barra-pesquisa")   as HTMLInputElement | null;
const inputCategoria = document.getElementById("categoria")        as HTMLInputElement;
const btnExportar    = document.getElementById("btn-exportar")     as HTMLButtonElement;

// =======================
// Funções de persistência
// =======================

// Salva contatos no localStorage
const salvarNoLocalStorage = () => {
  localStorage.setItem("contatos", JSON.stringify(contatos));
};

// Carrega contatos do localStorage
const carregarDoLocalStorage = () => {
  const dados = localStorage.getItem("contatos");
  if (dados) contatos = JSON.parse(dados);
};

// =======================
// Valida e-mail com regex
// =======================
const validarEmail = (email: string): boolean => {
  const re = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return re.test(email);
};

// =======================
// Ordena contatos pelo nome (ignora maiúsculas e acentos)
// =======================
function ordenarContatos(): void {
  contatos.sort((a, b) =>
    a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' })
  );
}

// =======================
// Eventos de UI
// =======================

// Abrir modal para novo contato
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

  const nome      = inputNome.value.trim();
  const contato   = inputContato.value.trim();
  const email     = inputEmail.value.trim();
  const status    = selectStatus.value;
  const categoria = inputCategoria.value.trim();

  // Validação básica dos campos obrigatórios
  if (!nome || !contato || !email) {
    showAlert("Preencha todos os campos!");
    return;
  }

  // Valida formato do e-mail
  if (!validarEmail(email)) {
    showAlert("Por favor, insira um e-mail válido!");
    return;
  }

  // Valida que contato contém só números
  if (!/^\d+$/.test(contato)) {
    showAlert("Por favor, insira apenas números no campo de contato!");
    return;
  }

  // Cria novo contato
  const novoContato = new Contato(nome, contato, email, status, categoria);

  // Evita números duplicados
  if (indiceEditando === null) {
    if (contatos.some(c => c.contato === contato)) {
      showAlert("Este número já está cadastrado!");
      return;
    }
    contatos.push(novoContato); // Adiciona novo contato
  } else {
    if (contatos.some((c, i) => c.contato === contato && i !== indiceEditando)) {
      showAlert("Este número já está cadastrado em outro contato!");
      return;
    }
    contatos[indiceEditando] = novoContato; // Atualiza contato existente
    indiceEditando = null;
  }

  ordenarContatos();
  salvarNoLocalStorage();
  modal.classList.add("oculto");
  atualizarTabela();
};

// =======================
// Atualiza tabela de contatos na tela
// =======================
function atualizarTabela(lista: Contato[] = contatos): void {
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
      const dataIndex = btn.getAttribute('data-i');
      if (!dataIndex) return;               // Se não tiver índice, ignora
      const index = parseInt(dataIndex);
      if (isNaN(index)) return;             // Se índice inválido, ignora
      editarContato(index);
    });
  });

  // Botões de exclusão
  tabela.querySelectorAll("button.apagar").forEach(btn => {
    btn.addEventListener('click', () => {
      const dataIndex = btn.getAttribute('data-i');
      if (!dataIndex) return;
      const index = parseInt(dataIndex);
      if (isNaN(index)) return;
      apagarContato(index);
    });
  });
}

// =======================
// Editar contato - valida índice
// =======================
function editarContato(i: number) {
  if (i < 0 || i >= contatos.length) return; // Evita erro com índice inválido

  const c = contatos[i];
  inputNome.value      = c.nome;
  inputContato.value   = c.contato;
  inputEmail.value     = c.email;
  selectStatus.value   = c.status;
  inputCategoria.value = c.categoria;
  indiceEditando = i;
  modal.classList.remove("oculto");
}

// =======================
// Apagar contato - valida índice
// =======================
function apagarContato(i: number) {
  if (i < 0 || i >= contatos.length) return; // Evita erro com índice inválido

  if (confirm(`Deseja apagar o contato "${contatos[i].nome}"?`)) {
    contatos.splice(i, 1);
    salvarNoLocalStorage();
    atualizarTabela();
  }
}

// =======================
// Pesquisa em tempo real
// =======================
if (busca) {
  busca.addEventListener('input', () => {
    const termo = busca.value.toLowerCase().trim();
    const resultados = termo
      ? contatos.filter(c =>
          c.nome.toLowerCase().includes(termo) ||
          c.contato.includes(termo) ||
          c.email.toLowerCase().includes(termo) ||
          c.status.toLowerCase().includes(termo) ||
          c.categoria.toLowerCase().includes(termo)
        )
      : contatos;
    atualizarTabela(resultados);
  });
}

// =======================
// Exportar lista para CSV (com campo garantido como string)
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
    .map(row =>
      row
        .map(field => `"${String(field).replace(/"/g, '""')}"`) // Garante que campo é string e escapa aspas
        .join(',')
    )
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
function showAlert(mensagem: string): void {
  const alertDiv = document.getElementById('customAlert');
  const message  = document.getElementById('alertMessage');
  const closeBtn = document.getElementById('alertClose');

  if (!alertDiv || !message || !closeBtn) {
    alert(mensagem); // fallback se os elementos não existirem
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
