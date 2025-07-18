// Classe que representa um contato
class Contato {
  constructor(
    public nome: string,
    public contato: string,
    public email: string,
    public status: string // "bloqueado" | "desbloqueado"
  ) {}
}

// --------------------- Estado ---------------------
let contatos: Contato[] = [];
let indiceEditando: number | null = null;

// --------------------- Elementos ------------------
const form          = document.getElementById("form-contato")  as HTMLFormElement;
const inputNome     = document.getElementById("nomo")          as HTMLInputElement;
const inputContato  = document.getElementById("contato")       as HTMLInputElement;
const inputEmail    = document.getElementById("email")         as HTMLInputElement;
const selectStatus  = document.getElementById("status")        as HTMLSelectElement;
const modal         = document.getElementById("form-modal")    as HTMLElement;
const btnNovo       = document.getElementById("btn-novo")      as HTMLButtonElement;
const btnCancelar   = document.getElementById("btn-cancelar")  as HTMLButtonElement;
const tabela        = document.getElementById("tabela-contatos") as HTMLTableSectionElement;
const busca         = document.getElementById("barra-pesquisa") as HTMLInputElement | null;

// ------------------- Utilidades -------------------
const salvarNoLocalStorage = () =>
  localStorage.setItem("contatos", JSON.stringify(contatos));

const carregarDoLocalStorage = () => {
  const dados = localStorage.getItem("contatos");
  if (dados) contatos = JSON.parse(dados);
};

// --------------------- UI -------------------------
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

// Envio do formulário (salvar ou editar)
form.onsubmit = e => {
  e.preventDefault();

  const nome    = inputNome.value.trim();
  const contato = inputContato.value.trim();
  const email   = inputEmail.value.trim();
  const status  = selectStatus.value.toLowerCase().trim(); // ✅ Correção aplicada aqui

  if (!nome || !contato || !email) {
    alert("Preencha todos os campos!");
    return;
  }

  const novoContato = new Contato(nome, contato, email, status);

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

  salvarNoLocalStorage();
  form.reset();
  modal.classList.add("oculto");
  atualizarTabela();
};

// Renderização da tabela
function atualizarTabela(lista: Contato[] = contatos): void {
  tabela.innerHTML = "";
  lista.forEach((c => {
    const realIndex = contatos.indexOf(c);
    tabela.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${c.nome}</td>
        <td>${c.contato}</td>
        <td>${c.email}</td>
        <td>${c.status === "bloqueado" ? "🔒 Bloqueado" : "✅ Desbloqueado"}</td>
        <td>
          <button class="editar" data-i="${realIndex}">✏️</button>
          <button class="apagar" data-i="${realIndex}">🗑️</button>
        </td>
      </tr>`);
  }));

  tabela.querySelectorAll<HTMLButtonElement>("button.editar").forEach(btn =>
    btn.onclick = () => editarContato(+btn.dataset.i!)
  );
  tabela.querySelectorAll<HTMLButtonElement>("button.apagar").forEach(btn =>
    btn.onclick = () => apagarContato(+btn.dataset.i!)
  );
}

// Editar
function editarContato(i: number) {
  const c = contatos[i];
  inputNome.value    = c.nome;
  inputContato.value = c.contato;
  inputEmail.value   = c.email;
  selectStatus.value = c.status;
  indiceEditando = i;
  modal.classList.remove("oculto");
}

// Apagar
function apagarContato(i: number) {
  if (confirm("Deseja apagar este contato?")) {
    contatos.splice(i, 1);
    salvarNoLocalStorage();
    atualizarTabela();
  }
}

// Barra de pesquisa
if (busca) {
  busca.oninput = () => {
    const termo = busca.value.toLowerCase().trim();

    if (!termo) {
      atualizarTabela();
      return;
    }

    const resultados = contatos.filter(c =>
      (c.nome?.toLowerCase().includes(termo) ?? false) ||
      (c.contato?.includes(termo) ?? false) ||
      (c.email?.toLowerCase().includes(termo) ?? false) ||
      (c.status?.toLowerCase().trim().includes(termo) ?? false)
    );

    atualizarTabela(resultados);
  };
}

// ------------ Inicialização ---------------
carregarDoLocalStorage();

// ✅ Correção: normaliza os status já carregados do localStorage
contatos.forEach(c => {
  if (c.status) {
    c.status = c.status.toLowerCase().trim();
  }
});

atualizarTabela();
