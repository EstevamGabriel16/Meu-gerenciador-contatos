// Classe que representa um contato
class Contato {
  constructor(
    public nome: string,
    public contato: string,
    public email: string,
    public status: string, // "bloqueado" | "desbloqueado"
    public categoria: string
  ) {}
}

// Estado
let contatos: Contato[] = [];
let indiceEditando: number | null = null;

// --------------------- Elementos ------------------
const form          = document.getElementById("form-contato") as HTMLFormElement;
const inputNome     = document.getElementById("nome") as HTMLInputElement;
const inputContato  = document.getElementById("contato") as HTMLInputElement;
const inputEmail    = document.getElementById("email") as HTMLInputElement;
const selectStatus  = document.getElementById("status") as HTMLSelectElement;
const modal         = document.getElementById("form-modal") as HTMLElement;
const btnNovo = document.getElementById("btn-novo") as HTMLButtonElement;
const btnCancelar = document.getElementById("btn-cancelar") as HTMLButtonElement;
const tabela = document.getElementById("tabela-contatos") as HTMLTableSectionElement;
const busca = document.getElementById("barra-pesquisa") as HTMLInputElement | null;
const inputCategoria = document.getElementById("categoria") as HTMLInputElement;
const btnExportar = document.getElementById("btn-exportar") as HTMLButtonElement;

// Utilidades
const salvarNoLocalStorage = () => {
  localStorage.setItem("contatos", JSON.stringify(contatos));
};

const carregarDoLocalStorage = () => {
  const dados = localStorage.getItem("contatos");
  if (dados) contatos = JSON.parse(dados);
};

// Validação de e-mail
const validarEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

function ordenarContatos(): void {
  contatos.sort((a, b) => a.nome.localeCompare(b.nome));
}

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
  const status = selectStatus.value.trim(); 
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
  } else {
    if (contatos.some((c, i) => c.contato === contato && i !== indiceEditando)) {
      alert("Este número já está cadastrado em outro contato!");
      return;
    }
    contatos[indiceEditando] = novoContato;
    indiceEditando = null;
  }
  
  ordenarContatos();
  salvarNoLocalStorage();
  modal.classList.add("oculto");
  atualizarTabela();
};

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

function editarContato(i: number) {
  if (i < 0 || i >= contatos.length) return;

  const c = contatos[i];
  inputNome.value = c.nome;
  inputContato.value = c.contato;
  inputEmail.value = c.email;
  selectStatus.value = c.status;
  inputCategoria.value = c.categoria;
  indiceEditando = i;
  modal.classList.remove("oculto");
}

function apagarContato(i: number) {
  if (i < 0 || i >= contatos.length) return;
  
  if (confirm(`Deseja apagar o contato "${contatos[i].nome}"?`)) {
    contatos.splice(i, 1);
    salvarNoLocalStorage();
    atualizarTabela();
  }
}

// Barra de pesquisa
if (busca) {
  busca.addEventListener('input', () => {
    const termo = busca.value.toLowerCase().trim();
    const resultados = termo 
      ? contatos.filter(c => 
          c.nome.toLowerCase().includes(termo) ||
          c.contato.includes(termo) ||
          c.email.toLowerCase().includes(termo) ||
          c.status.toLowerCase().includes(termo) ||
          (c.categoria && c.categoria.toLowerCase().includes(termo))
        )
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
    ['Nome', 'Contato', 'E-mail', 'Status', 'Categoria'],
    ...contatos.map(c => [c.nome, c.contato, c.email, c.status, c.categoria])
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