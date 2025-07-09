// Classe para representar um contato
class Contato {
  constructor(
    public nome: string,     // Nome do contato
    public contato: string,  // Telefone ou email
    public status: string    // Status: Bloqueado ou Desbloqueado
  ) {}
}

// Arrays para armazenar os contatos
let contatos: Array<Contato> = [];      // Contatos desbloqueados
let bloqueados: Array<Contato> = [];    // Contatos bloqueados

// Variável para saber se estamos editando um contato
let indiceEditando: number | null = null;

// Pegando os elementos do HTML (por ID)
const form = document.getElementById("form-contato") as HTMLFormElement;
const inputNome = document.getElementById("nomo") as HTMLInputElement;
const inputContato = document.getElementById("contato") as HTMLInputElement;
const selectStatus = document.getElementById("status") as HTMLSelectElement;
const modal = document.getElementById("form-modal") as HTMLElement;
const btnNovo = document.getElementById("btn-novo") as HTMLButtonElement;
const btnCancelar = document.getElementById("btn-cancelar") as HTMLButtonElement;
const tabela = document.getElementById("tabela-contatos") as HTMLTableSectionElement;

// Quando clicar no botão "Novo"
btnNovo.addEventListener("click", () => {
  indiceEditando = null;        // Não estamos editando ninguém
  form.reset();                 // Limpa o formulário
  modal.classList.remove("oculto"); // Mostra o formulário
});

// Quando clicar no botão "Cancelar"
btnCancelar.addEventListener("click", () => {
  modal.classList.add("oculto");  // Esconde o formulário
  form.reset();                   // Limpa o formulário
  indiceEditando = null;          // Cancela qualquer edição
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
    } else {
      contatos.push(novo); // Senão, vai para o array contatos
    }
  } else {
    // Se estiver editando um contato existente
    if (status === "Bloqueado") {
      bloqueados.push(novo);         // Manda para o array de bloqueados
      contatos.splice(indiceEditando, 1); // Remove dos desbloqueados
    } else {
      contatos[indiceEditando] = novo; // Atualiza o contato
    }
    indiceEditando = null; // Finaliza a edição
  }

  salvarNoLocalStorage();       // Salva no navegador
  form.reset();                 // Limpa o formulário
  modal.classList.add("oculto"); // Fecha o formulário
  atualizarTabela();            // Atualiza a tabela na tela
});

// Atualiza a tabela com os contatos
function atualizarTabela(): void {
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
  document.querySelectorAll(".editar").forEach((btn) =>
    btn.addEventListener("click", () => {
      const i = Number((btn as HTMLButtonElement).dataset.index);
      editarContato(i); // Chama função para editar
    })
  );

  // Ativa os botões de apagar
  document.querySelectorAll(".apagar").forEach((btn) =>
    btn.addEventListener("click", () => {
      const i = Number((btn as HTMLButtonElement).dataset.index);
      apagarContato(i); // Chama função para apagar
    })
  );
}

// Função para editar um contato
function editarContato(index: number): void {
  const c = contatos[index];         // Pega o contato
  inputNome.value = c.nome;          // Coloca os dados no formulário
  inputContato.value = c.contato;
  selectStatus.value = c.status;
  indiceEditando = index;            // Guarda o índice para edição
  modal.classList.remove("oculto");  // Abre o formulário
}

// Função para apagar um contato
function apagarContato(index: number): void {
  if (confirm("Deseja apagar este contato?")) {
    contatos.splice(index, 1);   // Remove do array
    salvarNoLocalStorage();      // Atualiza no localStorage
    atualizarTabela();           // Atualiza a tabela
  }
}

// Salva os dados no navegador
function salvarNoLocalStorage(): void {
  localStorage.setItem("contatos", JSON.stringify(contatos));
  localStorage.setItem("bloqueados", JSON.stringify(bloqueados));
}

// Carrega os dados salvos no navegador
function carregarDoLocalStorage(): void {
  const dadosContatos = localStorage.getItem("contatos");
  const dadosBloqueados = localStorage.getItem("bloqueados");

  if (dadosContatos) contatos = JSON.parse(dadosContatos);
  if (dadosBloqueados) bloqueados = JSON.parse(dadosBloqueados);
}

// Quando a página carrega, chamamos isso:
carregarDoLocalStorage(); // Carrega os dados salvos
atualizarTabela();        // Mostra os contatos na tela
