class Contato {
  constructor(
    public nome: string,
    public contato: string,
    public status: string
  ) {}
}

// Array para guardar contatos
let contatos: Array<Contato> = [];

// Pegar elementos do HTML (garantindo que não são nulos)
const form = document.getElementById("form-contato") as HTMLFormElement;
const inputNome = document.getElementById("nomo") as HTMLInputElement;
const inputContato = document.getElementById("contato") as HTMLInputElement;
const selectStatus = document.getElementById("status") as HTMLSelectElement;
const modal = document.getElementById("form-modal") as HTMLElement;
const botaoNovo = document.getElementById("btn-novo") as HTMLButtonElement;
const botaoCancelar = document.getElementById("btn-cancelar") as HTMLButtonElement;
const tabela = document.getElementById("tabela-contatos") as HTMLTableSectionElement;

// Mostrar modal ao clicar no botão "+ Novo"
botaoNovo.addEventListener("click", () => {
  modal.classList.remove("oculto");
});

// Fechar modal e limpar formulário ao clicar em "Cancelar"
botaoCancelar.addEventListener("click", () => {
  modal.classList.add("oculto");
  form.reset();
});

// Quando enviar o formulário (Salvar)
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Pega os valores dos inputs
  let nome = inputNome.value.trim();
  let contato = inputContato.value.trim();
  let status = selectStatus.value;

  if (!nome || !contato) {
    alert("Por favor, preencha Nome e Contato!");
    return;
  }

  // Cria novo contato e adiciona no array
  contatos.push(new Contato(nome, contato, status));

  // Limpa o formulário e fecha o modal
  form.reset();
  modal.classList.add("oculto");

  // Atualiza a tabela
  atualizarTabela();
});

// Função para atualizar a tabela de contatos
function atualizarTabela() {
  tabela.innerHTML = "";

  contatos.forEach((contato) => {
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${contato.nome}</td>
      <td>${contato.contato}</td>
      <td>${contato.status}</td>
      <td></td>
    `;
    tabela.appendChild(tr);
  });
}
