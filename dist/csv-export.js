"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupCSVExport = setupCSVExport;
function setupCSVExport(getContacts, triggerElement, filename = 'contatos.csv') {
    triggerElement.addEventListener('click', () => {
        const contatos = getContacts();
        if (contatos.length === 0) {
            alert("Nenhum contato para exportar!");
            return;
        }
        const csv = gerarCSV(contatos);
        baixarCSV(csv, filename);
    });
}
function gerarCSV(contatos) {
    const header = ['Nome', 'Contato', 'Email', 'Status', 'Categoria'];
    const linhas = contatos.map(c => [
        escape(c.nome),
        escape(c.contato),
        escape(c.email),
        escape(c.status),
        escape(c.categoria)
    ]);
    return [
        header.join(','),
        ...linhas.map(l => l.join(','))
    ].join('\n');
}
function escape(valor) {
    if (valor.includes(',') || valor.includes('"') || valor.includes('\n')) {
        return `"${valor.replace(/"/g, '""')}"`;
    }
    return valor;
}
function baixarCSV(conteudo, nomeArquivo) {
    const blob = new Blob([conteudo], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    link.click();
    URL.revokeObjectURL(url);
}
