/* =====================================================================
   SINAL VERDE — Protótipo funcional (arquivo único de script)
   Baseado no PRD "Sistema Sinal Verde".

   Este arquivo concentra TODO o JavaScript do aplicativo de propósito —
   a pedido, para manter apenas 3 arquivos (index.html, style.css,
   script.js) e não depender de nenhuma pasta extra.

   Sem dependências externas: os ícones estão embutidos aqui mesmo
   (seção ÍCONES, abaixo) e não é feita nenhuma chamada de rede para
   o app funcionar. Só a fonte do navegador é usada (system font).

   IMPORTANTE (limitações deste protótipo):
   - Todos os dados vivem em memória (variável DB). Ao recarregar a
     página, tudo volta ao estado inicial semeado em seed().
   - Não há backend, banco de dados ou autenticação real: o login
     apenas seleciona um perfil de demonstração.
   - As regras de fluxo são simuladas no cliente para fins de demons-
     tração da UX; em produção, toda regra de negócio deve ser
     validada no servidor.
   ===================================================================== */


// ======================================================================
// ÍCONES — conjunto próprio, embutido, sem depender de nenhum CDN.
// Cada entrada é o conteúdo interno de um <svg viewBox="0 0 24 24">
// no mesmo estilo (traço 2px, cantos arredondados). Assim o app nunca
// depende de internet para exibir ícones.
// ======================================================================
const ICONS = {
  'arrow-left': '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  'arrow-right': '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  'activity': '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  'alert-triangle': '<path d="M12 2 2 20h20L12 2z"/><line x1="12" y1="9" x2="12" y2="14"/><line x1="12" y1="17.3" x2="12" y2="17.31"/>',
  'badge-check': '<circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2 2 5-5"/>',
  'bar-chart-3': '<line x1="6" y1="20" x2="6" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="18" y1="20" x2="18" y2="14"/>',
  'bell': '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  'bell-off': '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><line x1="3" y1="3" x2="21" y2="21"/>',
  'briefcase': '<rect x="3" y="7" width="18" height="12" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="3" y1="12" x2="21" y2="12"/>',
  'calculator': '<rect x="4" y="2" width="16" height="20" rx="2"/><rect x="7" y="5" width="10" height="4"/><line x1="8" y1="13" x2="8" y2="13.01"/><line x1="12" y1="13" x2="12" y2="13.01"/><line x1="16" y1="13" x2="16" y2="13.01"/><line x1="8" y1="17" x2="8" y2="17.01"/><line x1="12" y1="17" x2="12" y2="17.01"/><line x1="16" y1="17" x2="16" y2="17.01"/>',
  'calendar': '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  'calendar-check': '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M9 16l2 2 4-4"/>',
  'calendar-plus': '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="10" y1="16" x2="14" y2="16"/>',
  'check': '<polyline points="20 6 9 17 4 12"/>',
  'check-circle-2': '<circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.5 2.5 5-5.5"/>',
  'chevron-right': '<polyline points="9 6 15 12 9 18"/>',
  'circle-dollar-sign': '<circle cx="12" cy="12" r="9"/><path d="M14.8 9.5c-.3-1-1.3-1.7-2.8-1.7-1.7 0-2.8.9-2.8 2s1 1.6 2.8 2 2.8.8 2.8 2-1.1 2-2.8 2c-1.5 0-2.5-.6-2.8-1.6"/><line x1="12" y1="6" x2="12" y2="18"/>',
  'clipboard-check': '<rect x="6" y="4" width="12" height="18" rx="2"/><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/><path d="M9 13l2 2 4-4"/>',
  'clock': '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 16 14"/>',
  'coffee': '<path d="M4 9h13v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9z"/><path d="M17 10h1a2 2 0 0 1 0 4h-1"/><path d="M7 2c0 1-1 1-1 2s1 1 1 2"/><path d="M11 2c0 1-1 1-1 2s1 1 1 2"/>',
  'coins': '<circle cx="9" cy="9" r="6"/><circle cx="15" cy="15" r="6"/>',
  'construction': '<rect x="3" y="14" width="18" height="6" rx="1"/><path d="M6 14V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6"/><line x1="9" y1="4" x2="9" y2="6"/><line x1="15" y1="4" x2="15" y2="6"/>',
  'eye': '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  'eye-off': '<path d="M2 12s4-7 10-7c2 0 3.7.6 5.2 1.5"/><path d="M22 12s-1.3 2.3-3.5 4.2"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/><line x1="3" y1="3" x2="21" y2="21"/>',
  'file-check-2': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/>',
  'file-text': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>',
  'flag': '<path d="M5 3v18"/><path d="M5 4h11l-2 4 2 4H5"/>',
  'gauge': '<circle cx="12" cy="13" r="8"/><path d="M12 13l4-4"/><line x1="8" y1="5.5" x2="8.5" y2="7"/><line x1="16" y1="5.5" x2="15.5" y2="7"/>',
  'history': '<path d="M3 12a9 9 0 1 0 3-6.7"/><polyline points="3 4 3 9 8 9"/><polyline points="12 8 12 12 15 14"/>',
  'inbox': '<polyline points="4 12 8 12 10 15 14 15 16 12 20 12"/><path d="M5.5 5h13l2.5 7v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-7z"/>',
  'info': '<circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><line x1="12" y1="7.9" x2="12" y2="7.91"/>',
  'landmark': '<line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><path d="M3 11l9-6 9 6"/>',
  'layout-dashboard': '<rect x="3" y="3" width="8" height="9" rx="1"/><rect x="13" y="3" width="8" height="5" rx="1"/><rect x="13" y="10" width="8" height="11" rx="1"/><rect x="3" y="14" width="8" height="7" rx="1"/>',
  'layout-grid': '<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>',
  'lightbulb': '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>',
  'list-checks': '<path d="M3 6l1.3 1.3L7 5"/><line x1="10" y1="6" x2="21" y2="6"/><path d="M3 12l1.3 1.3L7 11"/><line x1="10" y1="12" x2="21" y2="12"/><path d="M3 18l1.3 1.3L7 17"/><line x1="10" y1="18" x2="21" y2="18"/>',
  'list-plus': '<line x1="3" y1="6" x2="15" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="11" y2="18"/><line x1="19" y1="14" x2="19" y2="20"/><line x1="16" y1="17" x2="22" y2="17"/>',
  'lock': '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  'mail': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 6l9 7 9-7"/>',
  'mail-check': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 6l9 7 9-7"/><path d="M16 16.5l1.4 1.4L21 14.5"/>',
  'paperclip': '<path d="M21 12.5l-9 9a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5l-8 8a2 2 0 0 1-3-3l7-7"/>',
  'pencil': '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  'percent': '<line x1="19" y1="5" x2="5" y2="19"/><circle cx="7" cy="7" r="2.2"/><circle cx="17" cy="17" r="2.2"/>',
  'play': '<polygon points="6 3 20 12 6 21"/>',
  'plus': '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  'rocket': '<path d="M12 2c3 2 5 6 5 10 0 3-2 5-5 8-3-3-5-5-5-8 0-4 2-8 5-10z"/><circle cx="12" cy="10" r="1.5"/><path d="M8.5 16.5L6 19"/><path d="M15.5 16.5L18 19"/>',
  'rotate-ccw': '<path d="M3 12a9 9 0 1 0 3-6.7"/><polyline points="3 4 3 9 8 9"/>',
  'save': '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
  'scale': '<path d="M12 3v18"/><path d="M5 7l-3 6a3.5 3.5 0 0 0 6 0z"/><path d="M19 7l-3 6a3.5 3.5 0 0 0 6 0z"/><path d="M5 7h14"/><path d="M8 21h8"/>',
  'search': '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  'search-x': '<circle cx="11" cy="11" r="7"/><line x1="8.5" y1="8.5" x2="13.5" y2="13.5"/><line x1="13.5" y1="8.5" x2="8.5" y2="13.5"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  'send': '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  'settings': '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
  'shield': '<path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/>',
  'shield-check': '<path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/>',
  'sparkles': '<path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 15l.6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6z"/>',
  'table': '<rect x="3" y="4" width="18" height="16" rx="1"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="9" y1="4" x2="9" y2="20"/>',
  'thumbs-up': '<path d="M7 10v11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z"/><path d="M7 10l4-7a2 2 0 0 1 3.6 1.7L13.5 9H19a2 2 0 0 1 2 2.3l-1.4 7A2 2 0 0 1 17.6 20H7"/>',
  'trending-up': '<polyline points="3 17 9 11 13 15 21 7"/><polyline points="14 7 21 7 21 14"/>',
  'upload': '<path d="M12 16V4"/><polyline points="7 9 12 4 17 9"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
  'user': '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/>',
  'user-cog': '<circle cx="10" cy="8" r="4"/><path d="M2 21c0-4 3.5-7 8-7"/><circle cx="18" cy="17" r="2.3"/><path d="M18 13.3v1.2M18 19.5v1.2M14.9 15.2l1 .8M21.1 18l1 .8M13.7 17h1.3M21 17h1.3M14.9 18.8l1-.8M21.1 16l1-.8"/>',
  'user-plus': '<circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3.5-7 7-7s7 3 7 7"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/>',
  'users': '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 21c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6"/><circle cx="17.5" cy="9" r="3"/><path d="M23 21c0-2.8-1.8-5-4.5-5.7"/>',
  'x': '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  'x-circle': '<circle cx="12" cy="12" r="9"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
  'award': '<circle cx="12" cy="8" r="6"/><path d="M9 13.5L7.5 21l4.5-2.5 4.5 2.5-1.5-7.5"/>',
  'circle': '<circle cx="12" cy="12" r="9"/>',
};

// Compatibilidade: mantemos um objeto global "lucide" com createIcons()
// como no-op, porque nada mais no código depende dele — os ícones agora
// já nascem como SVG dentro do próprio HTML gerado, sem CDN e sem
// processamento assíncrono depois de inserir na página.
const lucide = { createIcons: function () {} };

/* ============================================================
   SINAL VERDE — Constantes e metadados de domínio
   Parte do protótipo do Programa Sinal Verde (ver /README.md).
   ============================================================ */

// ======================================================================
// CONSTANTES / METADADOS
// ======================================================================
const AREAS = ['Manutenção', 'Operação', 'Oficina', 'Administrativo', 'Logística', 'Segurança do Trabalho'];

const STATUS_META = {
  rascunho:            { label: 'Rascunho',                              cls: 'badge-gray' },
  enviada:             { label: 'Enviada',                               cls: 'badge-info' },
  recebida:            { label: 'Recebida pela Qualidade',               cls: 'badge-info' },
  aguardando_reuniao:  { label: 'Aguardando Reunião',                    cls: 'badge-warning' },
  em_analise_comite:   { label: 'Em análise pelo Comitê',                cls: 'badge-info' },
  aguardando_decisao:  { label: 'Aguardando decisão da Qualidade',       cls: 'badge-warning' },
  carta_elaboracao:    { label: 'Carta em elaboração',                   cls: 'badge-info' },
  carta_analista:      { label: 'Carta — aprovação da Analista',         cls: 'badge-info' },
  carta_gerente:       { label: 'Carta — aprovação da Gerente',          cls: 'badge-info' },
  carta_diretoria:     { label: 'Carta — aprovação da Diretoria',        cls: 'badge-info' },
  carta_pronta:        { label: 'Carta pronta para envio',               cls: 'badge-success' },
  carta_enviada:       { label: 'Resposta enviada',                      cls: 'badge-success' },
  implantacao:         { label: 'Implantação',                          cls: 'badge-info' },
  acompanhamento:      { label: 'Em acompanhamento',                     cls: 'badge-info' },
  concluida:           { label: 'Concluída',                            cls: 'badge-success' },
};
const ALL_STAGES = ['rascunho','enviada','recebida','aguardando_reuniao','em_analise_comite','aguardando_decisao',
  'carta_elaboracao','carta_analista','carta_gerente','carta_diretoria','carta_pronta','carta_enviada',
  'implantacao','acompanhamento','concluida'];

const CHECKPOINTS = [
  { label: 'Ideia enviada',              idx: 1 },
  { label: 'Recebida pela Qualidade',    idx: 2 },
  { label: 'Em análise pelo Comitê',     idx: 4 },
  { label: 'Em avaliação da Qualidade',  idx: 5 },
  { label: 'Carta em elaboração',        idx: 6 },
  { label: 'Carta em aprovação',         idx: 9 },
  { label: 'Retorno enviado',            idx: 11 },
  { label: 'Implantação',               idx: 12 },
  { label: 'Concluída',                 idx: 14 },
];

const KANBAN_COLUMNS = [
  { key: 'recebida',            label: 'Recebidas' },
  { key: 'aguardando_reuniao',  label: 'Aguardando Reunião' },
  { key: 'em_analise_comite',   label: 'Em análise pelo Comitê' },
  { key: 'aguardando_decisao',  label: 'Aguardando decisão' },
  { key: 'carta_elaboracao',    label: 'Carta em elaboração' },
  { key: 'carta_analista',      label: 'Analista' },
  { key: 'carta_gerente',       label: 'Gerente' },
  { key: 'carta_diretoria',     label: 'Diretoria' },
  { key: 'carta_pronta',        label: 'Carta pronta' },
  { key: 'implantacao',         label: 'Implantação' },
  { key: 'acompanhamento',      label: 'Acompanhamento' },
  { key: 'concluida',           label: 'Concluídas' },
];

const PRIORIDADE_META = {
  baixa: { label: 'Baixa', cls: 'badge-gray' },
  normal: { label: 'Normal', cls: 'badge-info' },
  alta: { label: 'Alta', cls: 'badge-orange' },
  critica: { label: 'Crítica', cls: 'badge-error' },
};

const STOPWORDS = new Set(['de','da','do','das','dos','em','no','na','nos','nas','para','com','por','uma','um','o','a','os','as','e','que','ao','à','aos']);


/* ============================================================
   SINAL VERDE — Funções utilitárias e helpers de UI
   Parte do protótipo do Programa Sinal Verde (ver /README.md).
   ============================================================ */

// ======================================================================
// HELPERS GERAIS
// ======================================================================
let _uidSeq = 1;
function uid(prefix) { return `${prefix || 'X'}${Date.now().toString(36)}${(_uidSeq++)}`; }

function nextProtocolo() {
  DB.protocoloSeq += 1;
  return `SV-2026-${String(DB.protocoloSeq).padStart(6, '0')}`;
}

function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR');
}
function fmtDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return `${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
}
function fmtMoney(v) {
  return (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}
function esc(s) { return (s || '').toString().replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])); }
function icon(name, cls) {
  const svg = ICONS[name] || ICONS['circle'];
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon ${cls || ''}">${svg}</svg>`;
}

function addHistorico(idea, evento) {
  idea.historico.push({ data: new Date().toISOString(), evento });
}
function addAudit(usuario, acao) {
  DB.auditoria.unshift({ data: new Date().toISOString(), usuario, acao });
}
function addNotif(audience, texto, icone) {
  DB.notificacoes.unshift({ id: uid('N'), audience, texto, icone: icone || 'bell', data: new Date().toISOString(), lida: false });
}
function toast(msg) {
  const stack = document.getElementById('toastStack');
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span class="dot"></span><span>${esc(msg)}</span>`;
  stack.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(() => el.remove(), 300); }, 3600);
}

function normalizeTxt(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, '');
}
function tokenSet(s) {
  return new Set(normalizeTxt(s).split(/\s+/).filter(w => w.length >= 4 && !STOPWORDS.has(w)));
}
function findSimilar(titulo, excludeId) {
  const base = tokenSet(titulo);
  if (base.size === 0) return [];
  const pool = [];
  DB.ideias.forEach(i => { if (i.id !== excludeId) pool.push({ protocolo: i.protocolo, titulo: i.titulo, statusLabel: ideaResultLabel(i), economia: (i.estimativa && i.estimativa.anual) || 0 }); });
  DB.historicoImportado.forEach(h => pool.push({ protocolo: h.protocolo, titulo: h.titulo, statusLabel: histLabel(h.status), economia: h.economia }));
  const scored = pool.map(p => {
    const t = tokenSet(p.titulo);
    let inter = 0; base.forEach(w => { if (t.has(w)) inter++; });
    const union = new Set([...base, ...t]).size;
    const score = union ? Math.round((inter / union) * 100) : 0;
    return { ...p, score };
  }).filter(p => p.score >= 25).sort((a, b) => b.score - a.score);
  return scored.slice(0, 3);
}
function histLabel(s) {
  return { aprovada_hist: 'Aprovada', implantada_hist: 'Implantada', reprovada_hist: 'Reprovada' }[s] || s;
}
function ideaResultLabel(i) {
  if (i.decisao === 'reprovada') return 'Reprovada';
  if (i.status === 'concluida') return 'Implantada';
  if (i.decisao === 'aprovada') return 'Aprovada';
  return 'Em análise';
}

function stageIdx(status) { return ALL_STAGES.indexOf(status); }

// ======================================================================
// CARTAS / PLANOS — criação
// ======================================================================
function cartaModelo(idea, reprovacao) {
  if (reprovacao) {
    return `Prezado(a) ${idea.colaborador.nome},\n\nAgradecemos sua participação no Programa Sinal Verde.\n\nApós análise realizada pelo Comitê do Programa Sinal Verde e decisão da equipe de Qualidade referente à ideia "${idea.titulo}" (protocolo ${idea.protocolo}), informamos que, neste momento, a proposta não foi aprovada.\n\nMotivo: ${idea.decisaoQualidade ? idea.decisaoQualidade.motivo : '[a definir]'}.\n\nAgradecemos sua contribuição e incentivamos o envio de novas ideias.\n\nEquipe de Qualidade — Programa Sinal Verde.`;
  }
  return `Prezado(a) ${idea.colaborador.nome},\n\nAgradecemos sua participação no Programa Sinal Verde.\n\nApós análise realizada pelo Comitê do Programa Sinal Verde, referente à ideia "${idea.titulo}" (protocolo ${idea.protocolo}), temos a satisfação de informar que sua proposta foi APROVADA.\n\nBenefício esperado: ${idea.beneficio}\n\nEm breve nossa equipe entrará em contato para dar início ao Plano de Implantação.\n\nParabéns pela contribuição!\n\nEquipe de Qualidade — Programa Sinal Verde.`;
}
function criarCartaParaIdeia(idea, reprovacao) {
  const carta = {
    id: uid('C'),
    ideiaId: idea.id,
    tipo: reprovacao ? 'reprovacao' : 'aprovacao',
    versao: 1,
    status: 'carta_elaboracao',
    conteudo: cartaModelo(idea, reprovacao),
    responsavelRedacao: 'Isabella Ramos',
    comentarios: [],
    historicoVersoes: [{ versao: 1, evento: 'Rascunho gerado automaticamente pelo sistema.', data: new Date().toISOString() }],
  };
  DB.cartas.push(carta);
  idea.cartaId = carta.id;
  return carta;
}
function criarPlanoParaIdeia(idea, over) {
  const plano = Object.assign({
    id: uid('P'),
    ideiaId: idea.id,
    titulo: `Plano de Implantação — ${idea.titulo}`,
    responsavel: 'Isabella Ramos',
    setor: idea.area,
    dataInicio: new Date().toISOString().slice(0, 10),
    prazo: '60 dias',
    prioridade: idea.prioridade,
    status: 'planejamento',
    objetivo: idea.beneficio,
    acoes: [
      { id: uid('A'), descricao: 'Levantamento técnico e definição de responsáveis', responsavel: 'Equipe Qualidade', prazo: '10 dias', status: 'concluida' },
      { id: uid('A'), descricao: 'Execução da ação principal', responsavel: idea.colaborador.nome, prazo: '30 dias', status: 'em_andamento' },
      { id: uid('A'), descricao: 'Validação dos resultados obtidos', responsavel: 'Equipe Qualidade', prazo: '20 dias', status: 'nao_iniciada' },
    ],
    acompanhamentos: [],
    economia: { prevista: (idea.estimativa && idea.estimativa.anual) || 0, obtida: 0 },
  }, over || {});
  DB.planos.push(plano);
  return plano;
}


/* ============================================================
   SINAL VERDE — Estado da aplicação e dados de demonstração
   Parte do protótipo do Programa Sinal Verde (ver /README.md).
   ============================================================ */

// ======================================================================
// ESTADO / SESSÃO
// ======================================================================
let DB = null;
const SESSION = { role: null, user: null };
const UI = { view: null, colabStep: 1, draft: null, qualIdeiasMode: 'table', qualSearch: '', notifOpenFor: null };

// ======================================================================
// SEED — dados iniciais de demonstração
// ======================================================================
function seed() {
  DB = {
    protocoloSeq: 184,
    ideias: [],
    historicoImportado: [
      { protocolo: 'SV-2024-0158', titulo: 'Redução de consumo de diesel na frota', categoria: 'custos', status: 'aprovada_hist', economia: 35000 },
      { protocolo: 'SV-2025-0098', titulo: 'Controle de abastecimento por cartão', categoria: 'custos', status: 'implantada_hist', economia: 18000 },
      { protocolo: 'SV-2024-00125', titulo: 'Padronização de troca de óleo na manutenção', categoria: 'custos', status: 'aprovada_hist', economia: 28000 },
      { protocolo: 'SV-2023-00081', titulo: 'Uso de óculos de proteção reforçado na oficina', categoria: 'seguranca', status: 'reprovada_hist', economia: 0 },
      { protocolo: 'SV-2025-00041', titulo: 'Sinalização de área de risco no pátio', categoria: 'seguranca', status: 'implantada_hist', economia: 42000 },
      { protocolo: 'SV-2023-00044', titulo: 'Troca de lâmpadas do pátio por LED', categoria: 'custos', status: 'reprovada_hist', economia: 0 },
    ],
    reunioes: [
      { id: 'R1', codigo: 'COM-2026-014', data: '2026-08-10', hora: '09:00', local: 'Sala de Reuniões 2', participantes: ['Rafael Nunes', 'Fernanda Dias', 'Carlos Prado'], pauta: [], ata: null, status: 'agendada' },
      { id: 'R2', codigo: 'COM-2026-013', data: '2026-07-28', hora: '14:00', local: 'Sala de Reuniões 1', participantes: ['Rafael Nunes', 'Fernanda Dias'], pauta: [], ata: 'Reunião realizada conforme pauta. Todos os pareceres registrados no sistema.', status: 'realizada' },
    ],
    cartas: [],
    planos: [],
    notificacoes: [],
    auditoria: [],
  };

  const mk = (over) => {
    const base = {
      id: uid('I'),
      protocolo: nextProtocolo(),
      colaborador: { nome: 'Marina Costa', matricula: '10234', funcao: 'Motorista', setor: 'Operação', unidade: 'Unidade Matriz', telefone: '(11) 98888-1234', email: 'marina.costa@empresa.com' },
      area: 'Operação',
      categoria: 'custos',
      descricao: 'Descrição detalhada da ideia proposta pelo colaborador, explicando o problema atual e a melhoria sugerida.',
      beneficio: 'Redução de custos operacionais e padronização do processo.',
      estimativa: { mensal: 0, anual: 0 },
      investimento: 'Até R$2.000',
      tempoImplantacao: 'Até 30 dias',
      anexos: [],
      prioridade: 'normal',
      dataCriacao: new Date().toISOString(),
      historico: [],
      parecerComite: null,
      decisaoQualidade: null,
      decisao: null,
      cartaId: null,
      planoId: null,
      status: 'enviada',
    };
    const idea = Object.assign(base, over);
    idea.historico.push({ data: idea.dataCriacao, evento: `${idea.colaborador.nome} criou a ideia.` });
    return idea;
  };

  // ---- Ideia 1: recém enviada ----
  DB.ideias.push(mk({
    titulo: 'Redução de consumo de diesel com monitoramento de rotas',
    categoria: 'custos', area: 'Logística',
    estimativa: { mensal: 3200, anual: 38400 },
    descricao: 'Implantar monitoramento de rotas via GPS para identificar desvios de trajeto e reduzir consumo de diesel da frota de entrega, com relatórios semanais de desempenho por motorista.',
    beneficio: 'Redução estimada de 12% no consumo mensal de diesel.',
    status: 'enviada', prioridade: 'alta',
  }));

  // ---- Ideia 2: recebida pela Qualidade ----
  DB.ideias.push(mk({
    titulo: 'Padronização de check-list de segurança na oficina',
    categoria: 'seguranca', area: 'Segurança do Trabalho',
    colaborador: { nome: 'João Silva', matricula: '10891', funcao: 'Mecânico', setor: 'Oficina', unidade: 'Unidade Matriz', telefone: '(11) 97777-4321', email: 'joao.silva@empresa.com' },
    descricao: 'Criar check-list obrigatório de EPIs e condições de segurança antes de iniciar qualquer manutenção em equipamentos pesados, reduzindo o risco de acidentes.',
    beneficio: 'Redução do número de quase-acidentes registrados na oficina.',
    status: 'recebida', prioridade: 'critica',
  }));

  // ---- Ideia 3: aguardando reunião ----
  DB.ideias.push(mk({
    titulo: 'Reaproveitamento de peças recondicionadas na manutenção',
    categoria: 'custos', area: 'Manutenção',
    colaborador: { nome: 'Carlos Prado', matricula: '11290', funcao: 'Técnico de Manutenção', setor: 'Manutenção', unidade: 'Unidade Matriz', telefone: '(11) 96666-1111', email: 'carlos.prado@empresa.com' },
    estimativa: { mensal: 1500, anual: 18000 },
    descricao: 'Estabelecer processo formal de recondicionamento de peças ainda aproveitáveis antes de comprar novas, com avaliação técnica de viabilidade.',
    beneficio: 'Redução de gastos com peças novas.',
    status: 'aguardando_reuniao', prioridade: 'normal',
  }));

  // ---- Ideia 4: em análise pelo Comitê (na fila de pareceres) ----
  DB.ideias.push(mk({
    titulo: 'Instalação de sinalização fotoluminescente nas rotas de fuga',
    categoria: 'seguranca', area: 'Segurança do Trabalho',
    colaborador: { nome: 'Fernanda Dias', matricula: '10555', funcao: 'Técnica de Segurança', setor: 'Administrativo', unidade: 'Unidade Matriz', telefone: '(11) 95555-2222', email: 'fernanda.dias@empresa.com' },
    descricao: 'Substituir a sinalização atual das rotas de fuga por placas fotoluminescentes, garantindo visibilidade mesmo em caso de queda de energia.',
    beneficio: 'Melhoria na segurança em situações de emergência.',
    status: 'em_analise_comite', prioridade: 'alta',
    reuniaoId: 'R1',
  }));

  // ---- Ideia 5: aguardando decisão da Qualidade (parecer favorável) ----
  DB.ideias.push(mk({
    titulo: 'Controle digital de abastecimento por cartão magnético',
    categoria: 'custos', area: 'Logística',
    colaborador: { nome: 'Marina Costa', matricula: '10234', funcao: 'Motorista', setor: 'Operação', unidade: 'Unidade Matriz', telefone: '(11) 98888-1234', email: 'marina.costa@empresa.com' },
    estimativa: { mensal: 2100, anual: 25200 },
    descricao: 'Substituir o controle manual de abastecimento por cartões magnéticos vinculados a cada veículo, eliminando divergências e desvios.',
    beneficio: 'Maior controle e rastreabilidade do consumo de combustível.',
    status: 'aguardando_decisao', prioridade: 'alta',
    parecerComite: { resultado: 'favoravel', justificativa: 'Ideia tecnicamente viável, com baixo investimento e retorno rápido. O Comitê recomenda aprovação, pois soluções semelhantes já mostraram resultado positivo em outras unidades.', riscos: 'Necessário treinamento da equipe operacional.', data: '2026-07-20T15:00:00', participantes: ['Rafael Nunes', 'Fernanda Dias', 'Carlos Prado'] },
  }));

  // ---- Ideia 6: carta em elaboração (aprovada) ----
  const idea6 = mk({
    titulo: 'Reutilização de água de lavagem de veículos',
    categoria: 'custos', area: 'Manutenção',
    colaborador: { nome: 'Paulo Menezes', matricula: '10777', funcao: 'Lavador', setor: 'Manutenção', unidade: 'Unidade Matriz', telefone: '(11) 94444-3333', email: 'paulo.menezes@empresa.com' },
    estimativa: { mensal: 900, anual: 10800 },
    descricao: 'Instalar sistema de captação e reuso da água utilizada na lavagem de veículos para reduzir o consumo de água tratada.',
    beneficio: 'Redução no consumo de água e no custo da conta mensal.',
    status: 'carta_elaboracao', prioridade: 'normal', decisao: 'aprovada',
    parecerComite: { resultado: 'favoravel', justificativa: 'Solução simples, de baixo custo e com impacto ambiental positivo. Comitê recomenda aprovação.', riscos: 'Nenhum risco relevante identificado.', data: '2026-07-15T10:00:00', participantes: ['Rafael Nunes', 'Fernanda Dias'] },
    decisaoQualidade: { resultado: 'aprovada', justificativa: 'Ideia aprovada por unanimidade. Baixo investimento e retorno ambiental relevante.', motivo: 'Viabilidade técnica e financeira', data: '2026-07-16T11:00:00' },
  });
  DB.ideias.push(idea6);
  const carta6 = criarCartaParaIdeia(idea6, false);
  carta6.status = 'carta_elaboracao';

  // ---- Ideia 7: carta em aprovação (Analista) ----
  const idea7 = mk({
    titulo: 'Treinamento de direção econômica para motoristas',
    categoria: 'custos', area: 'Operação',
    colaborador: { nome: 'Marina Costa', matricula: '10234', funcao: 'Motorista', setor: 'Operação', unidade: 'Unidade Matriz', telefone: '(11) 98888-1234', email: 'marina.costa@empresa.com' },
    estimativa: { mensal: 2800, anual: 33600 },
    descricao: 'Realizar treinamento periódico de direção econômica para reduzir consumo de combustível e desgaste de peças.',
    beneficio: 'Redução no consumo de combustível e manutenção da frota.',
    status: 'carta_analista', prioridade: 'alta', decisao: 'aprovada',
    parecerComite: { resultado: 'favoravel', justificativa: 'Ação de baixo custo com retorno recorrente. Comitê recomenda aprovação imediata.', riscos: 'Necessário acompanhar adesão dos motoristas.', data: '2026-07-10T09:30:00', participantes: ['Rafael Nunes', 'Carlos Prado'] },
    decisaoQualidade: { resultado: 'aprovada', justificativa: 'Aprovada. Iniciativa alinhada às metas de redução de custos do ano.', motivo: 'Viabilidade técnica e financeira', data: '2026-07-11T09:00:00' },
  });
  DB.ideias.push(idea7);
  const carta7 = criarCartaParaIdeia(idea7, false);
  carta7.status = 'carta_analista';
  carta7.historicoVersoes.push({ versao: 1, evento: 'Carta enviada para a Analista.', data: '2026-07-12T09:00:00' });

  // ---- Ideia 8: implantação em andamento ----
  const idea8 = mk({
    titulo: 'Redução de consumo de diesel (piloto 2026)',
    categoria: 'custos', area: 'Logística',
    colaborador: { nome: 'Ricardo Nogueira', matricula: '10456', funcao: 'Supervisor de Frota', setor: 'Logística', unidade: 'Unidade Matriz', telefone: '(11) 93333-7777', email: 'ricardo.nogueira@empresa.com' },
    estimativa: { mensal: 3300, anual: 39600 },
    descricao: 'Piloto de redução de consumo de diesel com monitoramento eletrônico da frota e metas por motorista.',
    beneficio: 'Redução direta de custo com combustível.',
    status: 'implantacao', prioridade: 'alta', decisao: 'aprovada',
    parecerComite: { resultado: 'favoravel', justificativa: 'Projeto piloto já validado tecnicamente. Comitê recomenda aprovação e expansão gradual.', riscos: 'Curva de adaptação da equipe.', data: '2026-05-20T10:00:00', participantes: ['Rafael Nunes', 'Fernanda Dias', 'Carlos Prado'] },
    decisaoQualidade: { resultado: 'aprovada', justificativa: 'Aprovada para execução em caráter piloto.', motivo: 'Alto potencial de economia', data: '2026-05-22T09:00:00' },
  });
  DB.ideias.push(idea8);
  const carta8 = criarCartaParaIdeia(idea8, false);
  carta8.status = 'carta_enviada'; carta8.versao = 4;
  idea8.planoId = criarPlanoParaIdeia(idea8, { status: 'execucao' }).id;

  // ---- Ideia 9: concluída (histórico) — vencedora da premiação anual ----
  const idea9 = mk({
    titulo: 'Padronização de troca de óleo na manutenção preventiva',
    categoria: 'custos', area: 'Manutenção',
    colaborador: { nome: 'Marina Costa', matricula: '10234', funcao: 'Motorista', unidade: 'Unidade Matriz', setor: 'Operação', telefone: '(11) 98888-1234', email: 'marina.costa@empresa.com' },
    estimativa: { mensal: 2300, anual: 27600 },
    descricao: 'Padronizar intervalos e procedimento de troca de óleo, reduzindo desperdício de lubrificante e retrabalho.',
    beneficio: 'Redução de custo com lubrificantes e menor desgaste de motores.',
    status: 'concluida', prioridade: 'normal', decisao: 'aprovada', premiacaoAnual: true, anoPremiacao: 2025,
    parecerComite: { resultado: 'favoravel', justificativa: 'Padronização simples com ganho operacional relevante. Comitê recomenda aprovação.', riscos: 'Nenhum.', data: '2026-03-05T10:00:00', participantes: ['Rafael Nunes', 'Carlos Prado'] },
    decisaoQualidade: { resultado: 'aprovada', justificativa: 'Aprovada. Processo já em uso em outra unidade com sucesso.', motivo: 'Viabilidade técnica comprovada', data: '2026-03-06T09:00:00' },
  });
  DB.ideias.push(idea9);
  const carta9 = criarCartaParaIdeia(idea9, false); carta9.status = 'carta_enviada'; carta9.versao = 3;
  const plano9 = criarPlanoParaIdeia(idea9, { status: 'concluido' });
  plano9.economia.obtida = 26200;
  idea9.planoId = plano9.id;

  // ---- Ideia 10: reprovada e encerrada ----
  const idea10 = mk({
    titulo: 'Troca de todas as lâmpadas do pátio por modelo importado',
    categoria: 'custos', area: 'Administrativo',
    colaborador: { nome: 'Ana Beatriz', matricula: '10999', funcao: 'Assistente Administrativo', setor: 'Administrativo', unidade: 'Unidade Matriz', telefone: '(11) 92222-8888', email: 'ana.beatriz@empresa.com' },
    estimativa: { mensal: 100, anual: 1200 },
    descricao: 'Trocar todas as lâmpadas do pátio por um modelo importado de alto custo, com retorno financeiro baixo comparado ao investimento necessário.',
    beneficio: 'Melhoria estética da iluminação.',
    status: 'concluida', prioridade: 'baixa', decisao: 'reprovada',
    parecerComite: { resultado: 'desfavoravel', justificativa: 'Investimento elevado sem retorno financeiro proporcional. Existem alternativas nacionais com custo muito menor e desempenho equivalente.', riscos: 'Alto custo de importação e manutenção.', data: '2026-06-01T10:00:00', participantes: ['Rafael Nunes', 'Fernanda Dias'] },
    decisaoQualidade: { resultado: 'reprovada', justificativa: 'Reprovada. Relação custo-benefício desfavorável frente a alternativas nacionais já avaliadas.', motivo: 'Baixa viabilidade financeira', data: '2026-06-02T09:00:00' },
  });
  DB.ideias.push(idea10);
  const carta10 = criarCartaParaIdeia(idea10, true); carta10.status = 'carta_enviada'; carta10.versao = 2;

  // Notificações iniciais
  addNotif('qualidade', 'Nova ideia recebida: "Redução de consumo de diesel com monitoramento de rotas".', 'inbox');
  addNotif('qualidade', '3 ideias aguardando decisão oficial.', 'alert-triangle');
  addNotif('comite', 'Reunião COM-2026-014 agendada para 10/08.', 'calendar');
  addNotif('comite', '1 ideia entrou na pauta da próxima reunião.', 'list-plus');
  addNotif('colaborador', 'Sua ideia SV-2026-000009 está em acompanhamento após a implantação.', 'rocket');
  addNotif('analista', '1 carta aguardando sua revisão.', 'mail-check');
  addNotif('gerente', 'Indicadores de cartas atualizados.', 'bar-chart-3');
  addNotif('diretoria', '1 carta aguardando aprovação institucional.', 'briefcase');

  addAudit('sistema', 'Sistema Sinal Verde inicializado com dados de demonstração.');
}


/* ============================================================
   SINAL VERDE — Autenticação, navegação, modais e drawers
   Parte do protótipo do Programa Sinal Verde (ver /README.md).
   ============================================================ */

// ======================================================================
// AUTENTICAÇÃO
// ======================================================================
const TEAM_ROLES = [
  { role: 'comite', icon: 'users', label: 'Comitê', sub: 'Parecer técnico das ideias', user: { nome: 'Rafael Nunes', cargo: 'Membro do Comitê' } },
  { role: 'qualidade', icon: 'shield-check', label: 'Qualidade', sub: 'Administração do Programa', user: { nome: 'Isabella Ramos', cargo: 'Analista de Qualidade Sênior' } },
  { role: 'analista', icon: 'file-check-2', label: 'Analista da Qualidade', sub: '1ª aprovação das cartas', user: { nome: 'Camila Alves', cargo: 'Analista da Qualidade' } },
  { role: 'gerente', icon: 'briefcase', label: 'Gerente da Qualidade', sub: '2ª aprovação das cartas', user: { nome: 'Eduardo Lima', cargo: 'Gerente da Qualidade' } },
  { role: 'diretoria', icon: 'landmark', label: 'Diretoria', sub: 'Aprovação institucional', user: { nome: 'Roberto Cardoso', cargo: 'Diretor de Operações' } },
];

function renderTeamRoleList() {
  const el = document.getElementById('teamRoleList');
  el.innerHTML = TEAM_ROLES.map(r => `
    <button class="role-btn" onclick="loginTeam('${r.role}')">
      <span class="ic">${icon(r.icon)}</span>
      <span>
        <div class="lbl">${r.label}</div>
        <div class="sub">${r.sub}</div>
      </span>
    </button>`).join('');
}

function switchLoginTab(tab) {
  document.getElementById('loginTabColab').classList.toggle('hidden', tab !== 'colab');
  document.getElementById('loginTabTeam').classList.toggle('hidden', tab !== 'team');
  document.getElementById('loginFootAdmin').classList.toggle('hidden', tab === 'team');
  const title = document.getElementById('loginTitle');
  const sub = document.getElementById('loginSub');
  if (tab === 'team') {
    title.textContent = 'Acesso da equipe interna';
    sub.textContent = 'Escolha seu perfil para continuar.';
  } else {
    title.textContent = 'Bem-vindo de volta';
    sub.textContent = 'Acesse com sua matrícula e senha.';
  }
  lucide.createIcons();
}

function togglePasswordField(inputId, btnEl) {
  const input = document.getElementById(inputId);
  const showing = input.type === 'text';
  input.type = showing ? 'password' : 'text';
  btnEl.innerHTML = showing ? icon('eye') : icon('eye-off');
  lucide.createIcons();
}

function loginColaborador() {
  SESSION.role = 'colaborador';
  SESSION.user = DB.ideias[0].colaborador; // Marina Costa — usuária de demonstração
  enterApp();
}
function loginTeam(role) {
  const r = TEAM_ROLES.find(x => x.role === role);
  SESSION.role = role;
  SESSION.user = r.user;
  enterApp();
}
function logout() {
  SESSION.role = null; SESSION.user = null;
  document.getElementById('appShell').classList.remove('active');
  document.getElementById('loginScreen').style.display = 'flex';
}

function enterApp() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('appShell').classList.add('active');
  buildSidebar();
  const home = { colaborador: 'home', comite: 'dashboard', qualidade: 'dashboard', analista: 'cartas', gerente: 'cartas', diretoria: 'dashboard' }[SESSION.role];
  navigateTo(home);
}

// ======================================================================
// NAVEGAÇÃO / SIDEBAR
// ======================================================================
const NAV = {
  colaborador: [
    { id: 'home', label: 'Início', icon: 'layout-dashboard' },
    { id: 'nova-ideia', label: 'Nova Ideia', icon: 'lightbulb' },
    { id: 'minhas-ideias', label: 'Minhas Ideias', icon: 'list-checks' },
    { id: 'conquistas', label: 'Conquistas', icon: 'award' },
    { id: 'notificacoes', label: 'Notificações', icon: 'bell' },
    { id: 'perfil', label: 'Meu Perfil', icon: 'user' },
  ],
  comite: [
    { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
    { id: 'fila', label: 'Fila de Pareceres', icon: 'list-checks' },
    { id: 'reunioes', label: 'Reuniões', icon: 'calendar' },
    { id: 'implantacoes', label: 'Implantações', icon: 'rocket' },
    { id: 'historico', label: 'Histórico', icon: 'history' },
    { id: 'perfil', label: 'Meu Perfil', icon: 'user' },
  ],
  qualidade: [
    { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
    { id: 'ideias', label: 'Ideias', icon: 'list-checks' },
    { id: 'comite', label: 'Comitê', icon: 'users' },
    { id: 'cartas', label: 'Cartas', icon: 'mail' },
    { id: 'implantacoes', label: 'Implantações', icon: 'rocket' },
    { id: 'indicadores', label: 'Indicadores', icon: 'bar-chart-3' },
    { id: 'usuarios', label: 'Usuários', icon: 'user-cog' },
    { id: 'auditoria', label: 'Auditoria', icon: 'shield-check' },
    { id: 'config', label: 'Configurações', icon: 'settings' },
  ],
  analista: [
    { id: 'cartas', label: 'Cartas para Aprovação', icon: 'mail-check' },
    { id: 'perfil', label: 'Meu Perfil', icon: 'user' },
  ],
  gerente: [
    { id: 'cartas', label: 'Cartas para Aprovação', icon: 'mail-check' },
    { id: 'indicadores', label: 'Indicadores', icon: 'bar-chart-3' },
    { id: 'perfil', label: 'Meu Perfil', icon: 'user' },
  ],
  diretoria: [
    { id: 'dashboard', label: 'Dashboard Estratégico', icon: 'layout-dashboard' },
    { id: 'cartas', label: 'Cartas para Aprovação', icon: 'mail-check' },
    { id: 'perfil', label: 'Meu Perfil', icon: 'user' },
  ],
};
const PORTAL_LABEL = { colaborador: 'Portal do Colaborador', comite: 'Portal do Comitê', qualidade: 'Portal da Qualidade', analista: 'Aprovação de Cartas', gerente: 'Aprovação de Cartas', diretoria: 'Diretoria' };

function buildSidebar() {
  document.getElementById('sidebarPortalLabel').textContent = PORTAL_LABEL[SESSION.role];
  const nav = NAV[SESSION.role];
  document.getElementById('sidebarNav').innerHTML = nav.map(n => `
    <button class="nav-item" data-nav="${n.id}" onclick="navigateTo('${n.id}')">${icon(n.icon)}<span>${n.label}</span></button>
  `).join('');
  const initials = SESSION.user.nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
  document.getElementById('userChip').innerHTML = `
    <div class="avatar">${initials}</div>
    <div><div class="name">${esc(SESSION.user.nome)}</div><div class="role">${esc(SESSION.user.cargo || SESSION.user.funcao || PORTAL_LABEL[SESSION.role])}</div></div>`;
  lucide.createIcons();
}

const VIEW_META = {
  'home': ['Início', 'Bem-vinda de volta! Aqui está o resumo das suas ideias.'],
  'nova-ideia': ['Nova Ideia', 'Leva menos de 5 minutos — preencha as etapas abaixo.'],
  'minhas-ideias': ['Minhas Ideias', 'Acompanhe o andamento de tudo o que você enviou.'],
  'conquistas': ['Conquistas', 'Seus selos por ideias aprovadas e premiações.'],
  'notificacoes': ['Notificações', 'Avisos sobre suas ideias e o Programa Sinal Verde.'],
  'perfil': ['Meu Perfil', 'Seus dados de acesso.'],
  'dashboard': ['Dashboard', 'Visão geral do Programa Sinal Verde.'],
  'fila': ['Fila de Pareceres', 'Ideias aguardando análise técnica do Comitê.'],
  'reunioes': ['Reuniões', 'Agenda e atas do Comitê.'],
  'implantacoes': ['Implantações', 'Acompanhamento das melhorias aprovadas.'],
  'historico': ['Histórico', 'Consulta completa de reuniões e pareceres.'],
  'ideias': ['Ideias', 'Fila completa do Programa Sinal Verde.'],
  'comite': ['Comitê', 'Agenda de reuniões e pareceres.'],
  'cartas': ['Cartas', 'Elaboração, revisão e envio das cartas oficiais.'],
  'indicadores': ['Indicadores', 'Business Intelligence do Programa Sinal Verde.'],
  'usuarios': ['Usuários', 'Gestão de colaboradores e perfis de acesso.'],
  'auditoria': ['Auditoria', 'Log completo e imutável de ações no sistema.'],
  'config': ['Configurações', 'Parâmetros do Programa Sinal Verde.'],
};

function navigateTo(viewId) {
  UI.view = viewId;
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.nav === viewId));
  const meta = VIEW_META[viewId] || ['', ''];
  document.getElementById('viewTitle').textContent = meta[0];
  document.getElementById('viewSub').textContent = meta[1];
  const root = document.getElementById('viewRoot');

  const key = `${SESSION.role}:${viewId}`;
  const renderers = {
    'colaborador:home': renderColabHome,
    'colaborador:nova-ideia': renderColabNovaIdeia,
    'colaborador:minhas-ideias': renderColabMinhasIdeias,
    'colaborador:conquistas': renderColabConquistas,
    'colaborador:notificacoes': renderNotificacoesView,
    'colaborador:perfil': renderPerfilView,
    'comite:dashboard': renderComiteDashboard,
    'comite:fila': renderComiteFila,
    'comite:reunioes': renderComiteReunioes,
    'comite:implantacoes': renderComiteImplantacoes,
    'comite:historico': renderComiteHistorico,
    'comite:perfil': renderPerfilView,
    'qualidade:dashboard': renderQualDashboard,
    'qualidade:ideias': renderQualIdeias,
    'qualidade:comite': renderQualComite,
    'qualidade:cartas': renderQualCartas,
    'qualidade:implantacoes': renderQualImplantacoes,
    'qualidade:indicadores': renderQualIndicadores,
    'qualidade:usuarios': renderQualUsuarios,
    'qualidade:auditoria': renderQualAuditoria,
    'qualidade:config': renderQualConfig,
    'analista:cartas': renderAprovCartas,
    'analista:perfil': renderPerfilView,
    'gerente:cartas': renderAprovCartas,
    'gerente:indicadores': renderQualIndicadores,
    'gerente:perfil': renderPerfilView,
    'diretoria:dashboard': renderDiretoriaDashboard,
    'diretoria:cartas': renderAprovCartas,
    'diretoria:perfil': renderPerfilView,
  };
  const fn = renderers[key];
  root.innerHTML = fn ? fn() : `<div class="empty-state">${icon('construction')}<div class="t">Em construção</div></div>`;
  root.classList.remove('view-enter');
  void root.offsetWidth; // força o navegador a "esquecer" a animação anterior
  root.classList.add('view-enter');
  lucide.createIcons();
  updateNotifDot();
}

function refresh() { navigateTo(UI.view); }

// ======================================================================
// DRAWER / MODAL
// ======================================================================
function openDrawer(html) {
  document.getElementById('drawerContent').innerHTML = html;
  document.getElementById('drawerOverlay').classList.add('active');
  lucide.createIcons();
}
function closeDrawer() { document.getElementById('drawerOverlay').classList.remove('active'); }
function openModal(html) {
  document.getElementById('modalContent').innerHTML = html;
  document.getElementById('modalOverlay').classList.add('active');
  lucide.createIcons();
}
function closeModal() { document.getElementById('modalOverlay').classList.remove('active'); }

function updateNotifDot() {
  const count = DB.notificacoes.filter(n => n.audience === SESSION.role && !n.lida).length;
  document.getElementById('notifDot').style.display = count ? 'block' : 'none';
}
function openNotifPanel() {
  const list = DB.notificacoes.filter(n => n.audience === SESSION.role);
  openModal(`
    <h3>Notificações</h3>
    <p class="sub">${list.length ? 'Marcadas como lidas ao abrir.' : 'Nenhuma notificação por aqui ainda.'}</p>
    <div class="notif-list">
      ${list.map(n => `
        <div class="notif-item ${n.lida ? '' : 'unread'}">
          <div class="ic">${icon(n.icone)}</div>
          <div>
            <div class="txt">${esc(n.texto)}</div>
            <div class="time">${fmtDateTime(n.data)}</div>
          </div>
        </div>`).join('') || ''}
    </div>
    <div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">Fechar</button></div>
  `);
  list.forEach(n => n.lida = true);
  updateNotifDot();
}

// ======================================================================
// COMPONENTES REUTILIZÁVEIS
// ======================================================================
function badgeStatus(status) {
  const m = STATUS_META[status] || { label: status, cls: 'badge-gray' };
  return `<span class="badge ${m.cls}">${m.label}</span>`;
}
function badgePrioridade(p) {
  const m = PRIORIDADE_META[p] || PRIORIDADE_META.normal;
  return `<span class="badge ${m.cls}">${m.label}</span>`;
}
function badgeCategoria(c) {
  return c === 'seguranca' ? `<span class="badge badge-error">Segurança</span>` : `<span class="badge badge-info">Redução de Custos</span>`;
}
function signalProgress(status) {
  const idx = stageIdx(status);
  let frontier = -1;
  CHECKPOINTS.forEach((c, i) => { if (idx >= c.idx) frontier = i; });
  const isConcluded = status === 'concluida';
  return `<div class="signal-track">${CHECKPOINTS.map((c, i) => {
    const done = i < frontier || (i === frontier && isConcluded);
    const current = i === frontier && !isConcluded;
    return `${i > 0 ? `<div class="signal-line ${i <= frontier ? 'done' : ''}"></div>` : ''}
      <div class="signal-step ${done ? 'done' : ''} ${current ? 'current' : ''}">
        <div class="signal-dot ${done ? 'done' : ''} ${current ? 'current' : ''}"></div>
      </div>`;
  }).join('')}</div>
  <div class="stepper-labels" style="margin-top:8px">${CHECKPOINTS.map((c, i) => `<span class="${i <= frontier ? 'on' : ''}" style="flex:1;text-align:center;font-size:10px">${c.label}</span>`).join('')}</div>`;
}
function kpiCard(icon_, label, value, cls, onclick_) {
  const clickable = onclick_ ? `class="kpi-card clickable" onclick="${onclick_}" role="button" tabindex="0"` : `class="kpi-card"`;
  return `<div ${clickable}><div class="kpi-top"><span class="kpi-icon">${icon(icon_)}</span></div><div class="kpi-num" style="${cls ? `color:var(--${cls})` : ''}">${value}</div><div class="kpi-label">${label}</div></div>`;
}


/* ============================================================
   SINAL VERDE — Portal do Colaborador
   Parte do protótipo do Programa Sinal Verde (ver /README.md).
   ============================================================ */

// ======================================================================
// PORTAL DO COLABORADOR
// ======================================================================
function minhasIdeias() {
  return DB.ideias.filter(i => i.colaborador.matricula === SESSION.user.matricula);
}

function renderColabHome() {
  const mine = minhasIdeias();
  const aprovadas = mine.filter(i => i.decisao === 'aprovada').length;
  const emAnalise = mine.filter(i => !['concluida', 'carta_enviada'].includes(i.status) && i.decisao !== 'reprovada').length;
  const reprovadas = mine.filter(i => i.decisao === 'reprovada').length;
  const economiaEstimada = mine.reduce((s, i) => s + ((i.estimativa && i.estimativa.anual) || 0), 0);
  const recentes = [...mine].sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao)).slice(0, 5);
  const total = mine.length || 1;
  const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  const primeiroNome = (SESSION.user.nome || '').split(' ')[0];

  return `
  <div style="margin-bottom:18px">
    <h2 style="font-family:var(--font-display);font-size:22px;font-weight:800;margin:0 0 4px">Olá, ${esc(primeiroNome)} 👋</h2>
    <div style="font-size:13px;color:var(--text-secondary);text-transform:capitalize">${hoje}</div>
  </div>

  <div class="kpi-grid">
    ${kpiCard('send', 'Ideias Enviadas', mine.length, null, "navigateTo('minhas-ideias')")}
    ${kpiCard('badge-check', 'Aprovadas', aprovadas, null, "navigateTo('conquistas')")}
    ${kpiCard('clock', 'Em Análise', emAnalise, null, "navigateTo('minhas-ideias')")}
    ${kpiCard('circle-dollar-sign', 'Economia Estimada', fmtMoney(economiaEstimada), null, "navigateTo('minhas-ideias')")}
  </div>

  <div class="grid-2">
    <div class="panel">
      <div class="panel-head"><h3>${icon('lightbulb')} Últimas Ideias</h3><button class="link-btn" onclick="navigateTo('minhas-ideias')">Ver todas →</button></div>
      <div class="panel-body" style="padding-top:4px;padding-bottom:4px">
        <div class="idea-row-list">
        ${recentes.length ? recentes.map(i => `
          <button class="idea-row" onclick="openIdeaDrawerColab('${i.id}')">
            <span class="dot"></span>
            <span class="info">
              <div class="t">${esc(i.titulo)}</div>
              <div class="m">${i.protocolo} · ${(STATUS_META[i.status] || {}).label || i.status}</div>
            </span>
            <span class="chev">${icon('chevron-right')}</span>
          </button>`).join('') : `<div class="empty-state">${icon('inbox')}<div class="t">Nenhuma ideia ainda</div><div class="d">Que tal enviar sua primeira sugestão?</div></div>`}
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-head"><h3>${icon('gauge')} Progresso</h3></div>
      <div class="panel-body">
        <div class="progress-row">
          <div class="row-top"><span>Aprovadas</span><span class="n">${aprovadas}</span></div>
          <div class="progress-track"><div class="progress-fill success" style="width:${Math.round(aprovadas / total * 100)}%"></div></div>
        </div>
        <div class="progress-row">
          <div class="row-top"><span>Em Análise</span><span class="n">${emAnalise}</span></div>
          <div class="progress-track"><div class="progress-fill warning" style="width:${Math.round(emAnalise / total * 100)}%"></div></div>
        </div>
        <div class="progress-row">
          <div class="row-top"><span>Reprovadas</span><span class="n">${reprovadas}</span></div>
          <div class="progress-track"><div class="progress-fill error" style="width:${Math.round(reprovadas / total * 100)}%"></div></div>
        </div>
        <button class="btn btn-primary btn-block" style="margin-top:20px" onclick="navigateTo('nova-ideia')">${icon('plus')} Enviar Nova Ideia</button>
      </div>
    </div>
  </div>`;
}

function renderColabMinhasIdeias() {
  const mine = minhasIdeias();
  return `
  <div class="panel">
    <div class="panel-body table-wrap">
      <table class="data-table">
        <thead><tr><th>Protocolo</th><th>Título</th><th>Categoria</th><th>Data</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${mine.map(i => `
            <tr>
              <td class="mono">${i.protocolo}</td>
              <td style="max-width:260px">${esc(i.titulo)}</td>
              <td>${badgeCategoria(i.categoria)}</td>
              <td>${fmtDate(i.dataCriacao)}</td>
              <td>${badgeStatus(i.status)}</td>
              <td><button class="link-btn" onclick="openIdeaDrawerColab('${i.id}')">Ver detalhes</button></td>
            </tr>`).join('') || `<tr><td colspan="6"><div class="empty-state">${icon('inbox')}<div class="t">Nenhuma ideia enviada</div></div></td></tr>`}
        </tbody>
      </table>
    </div>
  </div>`;
}

function renderColabConquistas() {
  const mine = minhasIdeias();
  const aprovadas = mine.filter(i => i.decisao === 'aprovada');
  const premiadas = aprovadas.filter(i => i.premiacaoAnual);
  const semPremio = aprovadas.filter(i => !i.premiacaoAnual);
  const proximosMarcos = [
    { qtd: 1, emoji: '🌱', t: 'Primeira ideia aprovada' },
    { qtd: 5, emoji: '🌿', t: '5 ideias aprovadas' },
    { qtd: 10, emoji: '🌳', t: '10 ideias aprovadas' },
  ];

  return `
  <div class="panel" style="background:linear-gradient(135deg,var(--primary-light),var(--primary-softer));border:none">
    <div class="panel-body" style="display:flex;align-items:center;gap:18px;flex-wrap:wrap">
      <div style="font-size:44px">🏆</div>
      <div>
        <div style="font-weight:800;font-size:18px;color:var(--primary-dark)">${aprovadas.length} ideia${aprovadas.length === 1 ? '' : 's'} aprovada${aprovadas.length === 1 ? '' : 's'}</div>
        <div style="font-size:13px;color:var(--text-secondary)">${premiadas.length ? `Incluindo ${premiadas.length} com premiação anual! 🎉` : 'Continue enviando ideias para desbloquear selos.'}</div>
      </div>
    </div>
  </div>

  ${premiadas.length ? `
  <div class="section-title">Premiações anuais</div>
  <div class="badge-grid">
    ${premiadas.map(i => `
      <div class="achievement-card gold">
        <span class="emoji">🏆</span>
        <div class="t">Premiação Anual ${i.anoPremiacao || ''}</div>
        <div class="d">${esc(i.titulo)}</div>
      </div>`).join('')}
  </div>` : ''}

  <div class="section-title">Ideias aprovadas</div>
  <div class="badge-grid">
    ${semPremio.map(i => `
      <div class="achievement-card">
        <span class="emoji">💚</span>
        <div class="t">Ideia aprovada</div>
        <div class="d">${esc(i.titulo)}</div>
      </div>`).join('') || (premiadas.length ? '' : `<div class="empty-state" style="grid-column:1/-1">${icon('award')}<div class="t">Nenhum selo ainda</div><div class="d">Envie sua primeira ideia para começar a coleção!</div></div>`)}
  </div>

  <div class="section-title">Próximos marcos</div>
  <div class="badge-grid">
    ${proximosMarcos.map(m => `
      <div class="achievement-card ${aprovadas.length >= m.qtd ? '' : 'locked'}">
        <span class="emoji">${m.emoji}</span>
        <div class="t">${m.t}</div>
        <div class="d">${aprovadas.length >= m.qtd ? 'Conquistado!' : `${aprovadas.length}/${m.qtd}`}</div>
      </div>`).join('')}
  </div>`;
}

function openIdeaDrawerColab(id) {
  const i = DB.ideias.find(x => x.id === id);
  const showCelebration = (i.status === 'concluida' || i.status === 'carta_enviada') && i.decisao === 'aprovada';
  openDrawer(`
    <div class="drawer-head">
      <div><h2>${esc(i.titulo)}</h2><div class="p">${i.protocolo}</div></div>
      <button class="drawer-close" onclick="closeDrawer()">${icon('x')}</button>
    </div>
    <div class="drawer-body">
      ${i.premiacaoAnual ? `
      <div class="celebrate-banner gold">
        <span class="emoji">🏆</span>
        <div class="t">Essa ideia ganhou a Premiação Anual ${i.anoPremiacao || ''}!</div>
        <div class="d">Parabéns pela contribuição — ela está na sua aba Conquistas.</div>
      </div>` : showCelebration ? `
      <div class="celebrate-banner">
        <span class="emoji">🎉</span>
        <div class="t">Sua ideia foi aprovada!</div>
        <div class="d">Esse selo já está guardado na sua aba Conquistas.</div>
      </div>` : ''}

      <div class="section-title">Andamento</div>
      ${signalProgress(i.status)}

      <div class="section-title">Detalhes</div>
      <div class="kv-grid">
        <div class="kv"><div class="k">Categoria</div><div class="v">${i.categoria === 'seguranca' ? 'Segurança' : 'Redução de Custos'}</div></div>
        <div class="kv"><div class="k">Área</div><div class="v">${esc(i.area)}</div></div>
        <div class="kv"><div class="k">Enviada em</div><div class="v">${fmtDate(i.dataCriacao)}</div></div>
        <div class="kv"><div class="k">Status atual</div><div class="v">${badgeStatus(i.status)}</div></div>
      </div>

      <div class="section-title">Descrição enviada</div>
      <div class="desc-box">${esc(i.descricao)}</div>

      ${i.status === 'concluida' || i.status === 'carta_enviada' ? `
      <div class="section-title">Resposta oficial</div>
      <div class="desc-box">${i.decisao === 'aprovada' ? '✅ Sua ideia foi <b>aprovada</b>! Em breve você poderá acompanhar a implantação.' : '❌ Sua ideia não foi aprovada nesta etapa. Agradecemos sua contribuição — continue enviando sugestões!'}</div>
      ` : `
      <div class="section-title">O que você não visualiza</div>
      <div class="desc-box" style="color:var(--text-muted);font-size:12.5px">Comentários internos, pareceres do Comitê e nomes de aprovadores permanecem visíveis apenas para a equipe de Qualidade, conforme as regras de perfil do Programa Sinal Verde.</div>`}
    </div>`);
  if (showCelebration) celebrateConfetti(i.premiacaoAnual ? 40 : 24);
}

function renderNotificacoesView() {
  const list = DB.notificacoes.filter(n => n.audience === SESSION.role);
  list.forEach(n => n.lida = true);
  updateNotifDot();
  return `<div class="notif-list">${list.map(n => `
    <div class="notif-item"><div class="ic">${icon(n.icone)}</div><div><div class="txt">${esc(n.texto)}</div><div class="time">${fmtDateTime(n.data)}</div></div></div>`).join('') ||
    `<div class="empty-state">${icon('bell-off')}<div class="t">Sem notificações</div></div>`}</div>`;
}

function renderPerfilView() {
  const u = SESSION.user;
  return `
  <div class="panel" style="max-width:520px">
    <div class="panel-head"><h3>Meus dados</h3></div>
    <div class="panel-body">
      <div class="field"><label>Nome</label><input value="${esc(u.nome)}" readonly></div>
      ${u.matricula ? `<div class="field"><label>Matrícula</label><input value="${esc(u.matricula)}" readonly></div>` : ''}
      ${u.cargo ? `<div class="field"><label>Cargo</label><input value="${esc(u.cargo)}" readonly></div>` : ''}
      ${u.funcao ? `<div class="field"><label>Função</label><input value="${esc(u.funcao)}" readonly></div>` : ''}
      ${u.setor ? `<div class="field"><label>Setor</label><input value="${esc(u.setor)}" readonly></div>` : ''}
      <div class="field"><label>Telefone</label><input id="perfilTelefone" value="${esc(u.telefone || '')}" placeholder="(00) 00000-0000"></div>
      <div class="field"><label>E-mail</label><input id="perfilEmail" value="${esc(u.email || '')}" placeholder="voce@empresa.com"></div>
      <button class="btn btn-primary" onclick="salvarPerfil()">Salvar alterações</button>
    </div>
  </div>
  <div class="panel" style="max-width:520px">
    <div class="panel-head"><h3>Segurança</h3></div>
    <div class="panel-body">
      <div class="field"><label>Senha atual</label><input type="password" placeholder="••••••••"></div>
      <div class="field"><label>Nova senha</label><input type="password" placeholder="••••••••"></div>
      <button class="btn btn-outline" onclick="toast('Senha alterada com sucesso.')">Alterar senha</button>
    </div>
  </div>`;
}
function salvarPerfil() {
  const tel = document.getElementById('perfilTelefone').value;
  const email = document.getElementById('perfilEmail').value;
  SESSION.user.telefone = tel; SESSION.user.email = email;
  toast('Dados atualizados com sucesso.');
}

// ---------------- Nova Ideia (stepper) ----------------
function renderColabNovaIdeia() {
  if (!UI.draft) UI.draft = { categoria: null, titulo: '', area: '', descricao: '', beneficio: '', estimativaMensal: '', estimativaAnual: '', investimento: 'Sem investimento', tempo: 'Imediato', anexos: [] };
  UI.colabStep = UI.colabStep || 1;
  const pct = (UI.colabStep / 3) * 100;
  return `
  <div class="panel"><div class="panel-body">
    <div class="stepper-bar"><div style="width:${pct}%"></div></div>
    <div class="stepper-labels">
      <span class="${UI.colabStep >= 1 ? 'on' : ''}">1. Seus dados</span>
      <span class="${UI.colabStep >= 2 ? 'on' : ''}">2. A ideia</span>
      <span class="${UI.colabStep >= 3 ? 'on' : ''}">3. Revisão e envio</span>
    </div>
    <div id="stepBody">${UI.colabStep === 1 ? stepDadosHtml() : UI.colabStep === 2 ? stepIdeiaHtml() : stepRevisaoHtml()}</div>
  </div></div>`;
}

function stepDadosHtml() {
  const u = SESSION.user;
  return `
    <div class="form-grid">
      <div class="field"><label>Nome</label><input value="${esc(u.nome)}" readonly></div>
      <div class="field"><label>Matrícula</label><input value="${esc(u.matricula)}" readonly></div>
      <div class="field"><label>Função</label><input value="${esc(u.funcao)}" readonly></div>
      <div class="field"><label>Setor</label><input value="${esc(u.setor)}" readonly></div>
      <div class="field"><label>Unidade</label><input value="${esc(u.unidade)}" readonly></div>
      <div class="field"><label>Telefone</label><input id="dTelefone" value="${esc(u.telefone)}"></div>
      <div class="field full"><label>E-mail</label><input id="dEmail" value="${esc(u.email)}"></div>
    </div>
    <div class="step-actions"><span></span><button class="btn btn-primary" onclick="colabGoStep(2)">Continuar ${icon('arrow-right')}</button></div>`;
}

function stepIdeiaHtml() {
  const d = UI.draft;
  const seg = d.categoria === 'seguranca';
  const custo = d.categoria === 'custos';
  const similares = d.titulo.length > 4 ? findSimilar(d.titulo, null) : [];
  return `
    <div class="section-title">Categoria</div>
    <div class="radio-cards">
      <label class="radio-card ${seg ? 'checked' : ''}"><input type="radio" name="cat" ${seg ? 'checked' : ''} onchange="setDraftCat('seguranca')"><span class="t">🦺 Segurança</span></label>
      <label class="radio-card ${custo ? 'checked' : ''}"><input type="radio" name="cat" ${custo ? 'checked' : ''} onchange="setDraftCat('custos')"><span class="t">💰 Redução de Custos</span></label>
    </div>
    ${d.categoria ? `
    <div class="form-grid" style="margin-top:18px">
      <div class="field"><label>Área envolvida</label>
        <select id="dArea" onchange="draftSet('area', this.value)">
          <option value="">Selecione...</option>
          ${AREAS.map(a => `<option value="${a}" ${d.area === a ? 'selected' : ''}>${a}</option>`).join('')}
        </select>
      </div>
      <div class="field full">
        <label>Título da ideia</label>
        <input id="dTitulo" maxlength="120" value="${esc(d.titulo)}" oninput="draftSet('titulo', this.value); rerenderStep2Similares();" placeholder="Ex: Economizar diesel na frota">
        <div class="char-count">${d.titulo.length}/120</div>
        <div id="similaresBox">${similares.length ? similaresHtml(similares) : ''}</div>
      </div>
      <div class="field full">
        <label>Descrição detalhada (mín. 100 caracteres)</label>
        <textarea id="dDescricao" maxlength="5000" oninput="draftSet('descricao', this.value); document.getElementById('descCount').textContent=this.value.length;" placeholder="Explique o problema atual e a melhoria proposta...">${esc(d.descricao)}</textarea>
        <div class="char-count"><span id="descCount">${d.descricao.length}</span>/5000 (mínimo 100)</div>
      </div>
      <div class="field full"><label>Benefício esperado</label><textarea id="dBeneficio" maxlength="1000" oninput="draftSet('beneficio', this.value)" placeholder="Qual resultado você espera?">${esc(d.beneficio)}</textarea></div>
      ${custo ? `
      <div class="field"><label>Economia mensal estimada (R$)</label><input type="number" min="0" id="dEstMensal" value="${d.estimativaMensal}" oninput="draftSet('estimativaMensal', this.value)"></div>
      <div class="field"><label>Economia anual estimada (R$)</label><input type="number" min="0" id="dEstAnual" value="${d.estimativaAnual}" oninput="draftSet('estimativaAnual', this.value)"></div>
      ` : ''}
      <div class="field"><label>Investimento necessário</label>
        <select onchange="draftSet('investimento', this.value)">
          ${['Sem investimento', 'Até R$500', 'Até R$2.000', 'Até R$10.000', 'Acima de R$10.000', 'Outro'].map(o => `<option ${d.investimento === o ? 'selected' : ''}>${o}</option>`).join('')}
        </select>
      </div>
      <div class="field"><label>Tempo estimado de implantação</label>
        <select onchange="draftSet('tempo', this.value)">
          ${['Imediato', 'Até 30 dias', 'Até 60 dias', 'Até 90 dias', 'Mais de 90 dias'].map(o => `<option ${d.tempo === o ? 'selected' : ''}>${o}</option>`).join('')}
        </select>
      </div>
      <div class="field full"><label>Anexos (PDF, DOCX, XLSX, PNG, JPG, MP4 — até 10 arquivos, 20MB cada)</label>
        <div class="upload-zone">${icon('upload')}<div>Arraste arquivos aqui ou <button class="link-btn" onclick="simulateAttach()">selecione no computador</button></div></div>
        <div class="chip-list">${d.anexos.map((a, idx) => `<span class="chip">${icon('paperclip')} ${esc(a)} <button onclick="removeAnexo(${idx})">×</button></span>`).join('')}</div>
      </div>
    </div>` : ''}
    <div class="step-actions">
      <button class="btn btn-outline" onclick="colabGoStep(1)">${icon('arrow-left')} Voltar</button>
      <button class="btn btn-primary" onclick="colabGoStep(3)">Continuar ${icon('arrow-right')}</button>
    </div>`;
}

function similaresHtml(sims) {
  return `<div class="similar-box"><div class="h">${icon('search')} Encontramos ideias semelhantes</div>
    ${sims.map(s => `<div class="similar-item"><span><span class="prot">${s.protocolo}</span> — ${esc(s.titulo)} <span class="badge badge-gray" style="margin-left:6px">${s.statusLabel}</span></span><span class="sim-pct">${s.score}%</span></div>`).join('')}
  </div>`;
}
function rerenderStep2Similares() {
  const box = document.getElementById('similaresBox');
  if (!box) return;
  const sims = UI.draft.titulo.length > 4 ? findSimilar(UI.draft.titulo, null) : [];
  box.innerHTML = sims.length ? similaresHtml(sims) : '';
  lucide.createIcons();
}
function setDraftCat(cat) { UI.draft.categoria = cat; document.getElementById('stepBody').innerHTML = stepIdeiaHtml(); lucide.createIcons(); }
function draftSet(field, val) { UI.draft[field] = val; }
function simulateAttach() { UI.draft.anexos.push(`evidencia_${UI.draft.anexos.length + 1}.pdf`); document.getElementById('stepBody').innerHTML = stepIdeiaHtml(); lucide.createIcons(); }
function removeAnexo(idx) { UI.draft.anexos.splice(idx, 1); document.getElementById('stepBody').innerHTML = stepIdeiaHtml(); lucide.createIcons(); }

function stepRevisaoHtml() {
  const d = UI.draft;
  return `
    <div class="section-title">Revise antes de enviar</div>
    <div class="kv-grid">
      <div class="kv full" style="grid-column:1/-1"><div class="k">Título</div><div class="v">${esc(d.titulo)}</div></div>
      <div class="kv"><div class="k">Categoria</div><div class="v">${d.categoria === 'seguranca' ? 'Segurança' : 'Redução de Custos'}</div></div>
      <div class="kv"><div class="k">Área</div><div class="v">${esc(d.area || '—')}</div></div>
      <div class="kv"><div class="k">Investimento</div><div class="v">${esc(d.investimento)}</div></div>
      <div class="kv"><div class="k">Prazo estimado</div><div class="v">${esc(d.tempo)}</div></div>
    </div>
    <div class="section-title">Descrição</div>
    <div class="desc-box">${esc(d.descricao) || '—'}</div>
    <div class="section-title">Anexos</div>
    <div class="chip-list">${d.anexos.length ? d.anexos.map(a => `<span class="chip">${icon('paperclip')} ${esc(a)}</span>`).join('') : '<span style="color:var(--text-muted);font-size:12.5px">Nenhum anexo.</span>'}</div>
    <div class="field" style="margin-top:18px"><label><input type="checkbox" id="dConfirma" style="width:auto;accent-color:var(--primary)"> Confirmo que as informações acima são verdadeiras.</label></div>
    <div class="step-actions">
      <button class="btn btn-outline" onclick="colabGoStep(2)">${icon('arrow-left')} Voltar</button>
      <button class="btn btn-primary" onclick="colabSubmitIdea()">${icon('send')} Enviar ideia</button>
    </div>`;
}
function colabGoStep(n) {
  if (n === 3) {
    const d = UI.draft;
    if (!d.categoria) { toast('Selecione uma categoria.'); return; }
    if (!d.titulo || d.titulo.length < 5) { toast('Informe um título para a ideia.'); return; }
    if (!d.descricao || d.descricao.length < 100) { toast('A descrição deve ter no mínimo 100 caracteres.'); return; }
  }
  UI.colabStep = n;
  document.getElementById('viewRoot').innerHTML = renderColabNovaIdeia();
  lucide.createIcons();
}
function colabSubmitIdea() {
  if (!document.getElementById('dConfirma').checked) { toast('Confirme que as informações são verdadeiras.'); return; }
  const d = UI.draft;
  const idea = {
    id: uid('I'), protocolo: nextProtocolo(),
    colaborador: { ...SESSION.user },
    area: d.area || AREAS[0], categoria: d.categoria,
    titulo: d.titulo, descricao: d.descricao, beneficio: d.beneficio || '—',
    estimativa: { mensal: Number(d.estimativaMensal) || 0, anual: Number(d.estimativaAnual) || 0 },
    investimento: d.investimento, tempoImplantacao: d.tempo, anexos: d.anexos,
    prioridade: 'normal', dataCriacao: new Date().toISOString(),
    historico: [], parecerComite: null, decisaoQualidade: null, decisao: null, cartaId: null, planoId: null,
    status: 'enviada',
  };
  addHistorico(idea, `${idea.colaborador.nome} criou a ideia.`);
  DB.ideias.unshift(idea);
  addNotif('qualidade', `Nova ideia recebida: "${idea.titulo}" (${idea.protocolo}).`, 'inbox');
  addAudit(idea.colaborador.nome, `Enviou a ideia ${idea.protocolo}.`);

  UI.draft = null; UI.colabStep = 1;
  document.getElementById('viewRoot').innerHTML = `
    <div class="panel" style="max-width:520px;text-align:center"><div class="panel-body" style="padding:44px 30px">
      <div style="width:64px;height:64px;border-radius:50%;background:var(--success-light);color:var(--success);display:flex;align-items:center;justify-content:center;margin:0 auto 18px">${icon('check-circle-2', '')}</div>
      <h2 style="font-family:var(--font-display);margin:0 0 6px">Sua ideia foi enviada!</h2>
      <p class="mono" style="font-size:15px;margin:0 0 10px">${idea.protocolo}</p>
      <p style="color:var(--text-secondary);font-size:13.5px">Recebemos sua sugestão. A equipe da Qualidade irá analisá-la e você poderá acompanhar todo o andamento pelo portal.</p>
      <div style="display:flex;gap:10px;justify-content:center;margin-top:20px">
        <button class="btn btn-outline" onclick="navigateTo('home')">Voltar ao painel</button>
        <button class="btn btn-primary" onclick="navigateTo('nova-ideia')">Nova ideia</button>
      </div>
    </div></div>`;
  lucide.createIcons();
  celebrateConfetti(30);
}


/* ============================================================
   SINAL VERDE — Portal do Comitê
   Parte do protótipo do Programa Sinal Verde (ver /README.md).
   ============================================================ */

// ======================================================================
// PORTAL DO COMITÊ
// ======================================================================
function renderComiteDashboard() {
  const aguardando = DB.ideias.filter(i => i.status === 'em_analise_comite').length;
  const analisadas = DB.ideias.filter(i => i.parecerComite).length + 148;
  const implant = DB.ideias.filter(i => ['implantacao', 'acompanhamento'].includes(i.status)).length + 26;
  return `
  <div class="kpi-grid">
    ${kpiCard('list-checks', 'Ideias aguardando parecer', aguardando, null, "navigateTo('fila')")}
    ${kpiCard('calendar-check', 'Reunião de hoje', DB.reunioes.some(r => r.data === new Date().toISOString().slice(0, 10)) ? 'Sim' : 'Nenhuma', null, "navigateTo('reunioes')")}
    ${kpiCard('history', 'Ideias já analisadas', analisadas, null, "navigateTo('historico')")}
    ${kpiCard('rocket', 'Implantações acompanhadas', implant, null, "navigateTo('implantacoes')")}
  </div>
  <div class="grid-2">
    <div class="panel">
      <div class="panel-head"><h3>Efetividade das ideias implantadas</h3></div>
      <div class="panel-body">
        ${hbar('Ideias implantadas', 95)}
        ${hbar('Economia confirmada', 82)}
        ${hbar('Em acompanhamento', 18)}
      </div>
    </div>
    <div class="panel">
      <div class="panel-head"><h3>Próxima reunião</h3></div>
      <div class="panel-body">
        ${DB.reunioes.filter(r => r.status === 'agendada').map(r => `
          <div class="kv" style="margin-bottom:10px"><div class="k">${r.codigo}</div><div class="v">${fmtDate(r.data)} às ${r.hora} · ${esc(r.local)}</div></div>
        `).join('') || '<p style="color:var(--text-muted);font-size:13px">Nenhuma reunião agendada.</p>'}
        <button class="btn btn-outline btn-sm" onclick="navigateTo('reunioes')">Ver agenda completa</button>
      </div>
    </div>
  </div>`;
}
function hbar(label, pct) {
  return `<div class="hbar-row"><span class="name">${label}</span><div class="hbar-track"><div class="hbar-fill" style="width:${pct}%"></div></div><span class="n">${pct}%</span></div>`;
}

function renderComiteFila() {
  const fila = DB.ideias.filter(i => i.status === 'em_analise_comite');
  return `
  <div class="panel"><div class="panel-body table-wrap">
    <table class="data-table">
      <thead><tr><th>Protocolo</th><th>Título</th><th>Categoria</th><th>Área</th><th>Prioridade</th><th></th></tr></thead>
      <tbody>
        ${fila.map(i => `
          <tr>
            <td class="mono">${i.protocolo}</td>
            <td style="max-width:280px">${esc(i.titulo)}</td>
            <td>${badgeCategoria(i.categoria)}</td>
            <td>${esc(i.area)}</td>
            <td>${badgePrioridade(i.prioridade)}</td>
            <td><button class="btn btn-primary btn-sm" onclick="openParecerModal('${i.id}')">Analisar</button></td>
          </tr>`).join('') || `<tr><td colspan="6"><div class="empty-state">${icon('coffee')}<div class="t">Nenhuma ideia aguardando parecer</div></div></td></tr>`}
      </tbody>
    </table>
  </div></div>`;
}

function openParecerModal(id) {
  const i = DB.ideias.find(x => x.id === id);
  const sims = findSimilar(i.titulo, i.id);
  openDrawer(`
    <div class="drawer-head"><div><h2>${esc(i.titulo)}</h2><div class="p">${i.protocolo}</div></div><button class="drawer-close" onclick="closeDrawer()">${icon('x')}</button></div>
    <div class="drawer-body">
      <div class="kv-grid">
        <div class="kv"><div class="k">Categoria</div><div class="v">${i.categoria === 'seguranca' ? 'Segurança' : 'Redução de Custos'}</div></div>
        <div class="kv"><div class="k">Área</div><div class="v">${esc(i.area)}</div></div>
      </div>
      <div class="section-title">Descrição completa</div>
      <div class="desc-box">${esc(i.descricao)}</div>
      <div class="section-title">Benefício esperado</div>
      <div class="desc-box">${esc(i.beneficio)}</div>
      ${i.estimativa.anual ? `<div class="section-title">Estimativa financeira</div><div class="kv-grid"><div class="kv"><div class="k">Mensal</div><div class="v">${fmtMoney(i.estimativa.mensal)}</div></div><div class="kv"><div class="k">Anual</div><div class="v">${fmtMoney(i.estimativa.anual)}</div></div></div>` : ''}
      ${sims.length ? `<div class="section-title">Ideias semelhantes (somente leitura)</div>${similaresHtml(sims)}` : ''}

      <div class="section-title">Parecer técnico</div>
      <div class="radio-cards">
        <label class="radio-card" id="pcFav"><input type="radio" name="parecer" value="favoravel" onchange="setParecerChoice('favoravel')"><span class="t">✅ Favorável</span></label>
        <label class="radio-card" id="pcDesfav"><input type="radio" name="parecer" value="desfavoravel" onchange="setParecerChoice('desfavoravel')"><span class="t">❌ Desfavorável</span></label>
      </div>
      <div class="field" style="margin-top:14px"><label>Justificativa (mín. 100 caracteres)</label>
        <textarea id="parecerJustificativa" oninput="document.getElementById('pjCount').textContent=this.value.length"></textarea>
        <div class="char-count"><span id="pjCount">0</span>/100 mínimo</div>
      </div>
      <div class="field"><label>Riscos identificados (opcional)</label><textarea id="parecerRiscos"></textarea></div>
      <button class="btn btn-primary btn-block" onclick="submitParecer('${i.id}')">${icon('lock')} Finalizar Parecer</button>
      <p style="font-size:11.5px;color:var(--text-muted);margin-top:8px">Após finalizar, o parecer não poderá mais ser editado, corrigido ou excluído.</p>
    </div>`);
}
function setParecerChoice(v) {
  document.getElementById('pcFav').classList.toggle('checked', v === 'favoravel');
  document.getElementById('pcDesfav').classList.toggle('checked', v === 'desfavoravel');
}
function submitParecer(id) {
  const resultado = document.querySelector('input[name="parecer"]:checked');
  const justificativa = document.getElementById('parecerJustificativa').value.trim();
  if (!resultado) { toast('Selecione Favorável ou Desfavorável.'); return; }
  if (justificativa.length < 100) { toast('A justificativa deve ter no mínimo 100 caracteres.'); return; }
  const i = DB.ideias.find(x => x.id === id);
  i.parecerComite = { resultado: resultado.value, justificativa, riscos: document.getElementById('parecerRiscos').value.trim(), data: new Date().toISOString(), participantes: [SESSION.user.nome, 'Fernanda Dias', 'Carlos Prado'] };
  i.status = 'aguardando_decisao';
  addHistorico(i, `Comitê registrou parecer ${resultado.value === 'favoravel' ? 'favorável' : 'desfavorável'}.`);
  addAudit(SESSION.user.nome, `Emitiu parecer para ${i.protocolo}.`);
  addNotif('qualidade', `Parecer do Comitê registrado para ${i.protocolo}. Decisão oficial pendente.`, 'scale');
  closeDrawer();
  toast('Parecer registrado. Esta decisão não poderá mais ser alterada.');
  refresh();
}

function renderComiteReunioes() {
  return `
  <div class="panel">
    <div class="panel-head"><h3>Agenda</h3><button class="btn btn-outline btn-sm" onclick="toast('No Portal do Comitê, a agenda é criada pela equipe de Qualidade.')">${icon('info')} Sobre a agenda</button></div>
    <div class="panel-body table-wrap">
      <table class="data-table">
        <thead><tr><th>Código</th><th>Data</th><th>Local</th><th>Participantes</th><th>Status</th><th>Ata</th></tr></thead>
        <tbody>
          ${DB.reunioes.map(r => `
            <tr>
              <td class="mono">${r.codigo}</td>
              <td>${fmtDate(r.data)} · ${r.hora}</td>
              <td>${esc(r.local)}</td>
              <td>${r.participantes.length}</td>
              <td>${r.status === 'agendada' ? '<span class="badge badge-warning">Agendada</span>' : '<span class="badge badge-success">Realizada</span>'}</td>
              <td>${r.ata ? `<button class="link-btn" onclick="verAta('${r.id}')">Ver ata</button>` : '—'}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}
function verAta(id) {
  const r = DB.reunioes.find(x => x.id === id);
  openModal(`<h3>Ata — ${r.codigo}</h3><p class="sub">${fmtDate(r.data)} às ${r.hora} · ${esc(r.local)}</p>
    <div class="desc-box">${esc(r.ata)}</div>
    <div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">Fechar</button></div>`);
}

function renderComiteImplantacoes() {
  const planos = DB.planos.filter(p => ['execucao', 'testes', 'validacao', 'concluido'].includes(p.status));
  return `
  <div class="panel"><div class="panel-body table-wrap">
    <table class="data-table">
      <thead><tr><th>Ideia</th><th>Status</th><th>Economia prevista</th><th>Economia obtida</th><th></th></tr></thead>
      <tbody>
        ${planos.map(p => {
          const idea = DB.ideias.find(i => i.id === p.ideiaId);
          return `<tr>
            <td>${esc(idea.titulo)}</td>
            <td><span class="badge badge-info">${planoStatusLabel(p.status)}</span></td>
            <td>${fmtMoney(p.economia.prevista)}</td>
            <td>${fmtMoney(p.economia.obtida)}</td>
            <td><button class="link-btn" onclick="openPlanoDrawer('${p.id}', true)">Ver</button></td>
          </tr>`;
        }).join('') || `<tr><td colspan="5"><div class="empty-state">${icon('rocket')}<div class="t">Nenhuma implantação em acompanhamento</div></div></td></tr>`}
      </tbody>
    </table>
  </div></div>`;
}

function renderComiteHistorico() {
  const analisadas = DB.ideias.filter(i => i.parecerComite);
  return `
  <div class="panel"><div class="panel-body table-wrap">
    <table class="data-table">
      <thead><tr><th>Protocolo</th><th>Título</th><th>Parecer</th><th>Data</th><th>Resultado final</th></tr></thead>
      <tbody>
        ${analisadas.map(i => `
          <tr>
            <td class="mono">${i.protocolo}</td>
            <td>${esc(i.titulo)}</td>
            <td>${i.parecerComite.resultado === 'favoravel' ? '<span class="badge badge-success">Favorável</span>' : '<span class="badge badge-error">Desfavorável</span>'}</td>
            <td>${fmtDate(i.parecerComite.data)}</td>
            <td>${badgeStatus(i.status)}</td>
          </tr>`).join('') || `<tr><td colspan="5"><div class="empty-state">${icon('history')}<div class="t">Nenhum parecer registrado ainda</div></div></td></tr>`}
      </tbody>
    </table>
  </div></div>`;
}


/* ============================================================
   SINAL VERDE — Portal da Qualidade — núcleo operacional
   Parte do protótipo do Programa Sinal Verde (ver /README.md).
   ============================================================ */

// ======================================================================
// PORTAL DA QUALIDADE
// ======================================================================
function renderQualDashboard() {
  const ideias = DB.ideias;
  const aguardandoAnalise = ideias.filter(i => ['recebida', 'aguardando_reuniao'].includes(i.status)).length;
  const cartasElaboracao = ideias.filter(i => i.status === 'carta_elaboracao').length;
  const cartasAnalista = ideias.filter(i => i.status === 'carta_analista').length;
  const cartasGerente = ideias.filter(i => i.status === 'carta_gerente').length;
  const cartasDiretoria = ideias.filter(i => i.status === 'carta_diretoria').length;
  const implantAndamento = ideias.filter(i => i.status === 'implantacao').length;
  const acompAtivos = ideias.filter(i => i.status === 'acompanhamento').length;

  return `
  <div class="kpi-grid">
    ${kpiCard('inbox', 'Aguardando análise', aguardandoAnalise, null, "navigateTo('ideias')")}
    ${kpiCard('pencil', 'Cartas aguardando elaboração', cartasElaboracao, null, "navigateTo('cartas')")}
    ${kpiCard('file-check-2', 'Aguardando Analista', cartasAnalista, null, "navigateTo('cartas')")}
    ${kpiCard('briefcase', 'Aguardando Gerente', cartasGerente, null, "navigateTo('cartas')")}
  </div>
  <div class="kpi-grid">
    ${kpiCard('landmark', 'Aguardando Diretoria', cartasDiretoria, null, "navigateTo('cartas')")}
    ${kpiCard('rocket', 'Implantações em andamento', implantAndamento, null, "navigateTo('implantacoes')")}
    ${kpiCard('activity', 'Acompanhamentos ativos', acompAtivos, null, "navigateTo('implantacoes')")}
    ${kpiCard('badge-check', 'Concluídas', ideias.filter(i => i.status === 'concluida').length, null, "navigateTo('ideias')")}
  </div>

  <div class="grid-2">
    <div class="panel">
      <div class="panel-head"><h3>Central de Pendências</h3><span class="sub">Ideias que precisam de uma ação da Qualidade agora</span></div>
      <div class="panel-body table-wrap">
        ${pendenciasQualidade()}
      </div>
    </div>
    <div class="panel">
      <div class="panel-head"><h3>Alertas de SLA</h3></div>
      <div class="panel-body">
        ${alertasSla()}
      </div>
    </div>
  </div>`;
}
function diasDesde(iso) { return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)); }
function slaBadgeFor(dias, limite) {
  if (dias > limite) return `<span class="badge badge-error">${dias}d (atrasado)</span>`;
  if (dias >= limite - 1) return `<span class="badge badge-warning">${dias}d</span>`;
  return `<span class="badge badge-success">${dias}d</span>`;
}
function pendenciasQualidade() {
  const acao = (i) => ({
    recebida: { label: 'Agendar reunião', fn: `qualAgendarReuniaoModal('${i.id}')` },
    aguardando_reuniao: { label: 'Iniciar análise do Comitê', fn: `qualIniciarAnalise('${i.id}')` },
    aguardando_decisao: { label: 'Registrar decisão oficial', fn: `qualDecisaoModal('${i.id}')` },
    carta_elaboracao: { label: 'Elaborar carta', fn: `openCartaDrawer('${i.cartaId}')` },
    carta_pronta: { label: 'Enviar carta', fn: `openCartaDrawer('${i.cartaId}')` },
  }[i.status]);
  const pend = DB.ideias.filter(i => acao(i)).slice(0, 8);
  if (!pend.length) return `<div class="empty-state">${icon('sparkles')}<div class="t">Tudo em dia por aqui!</div></div>`;
  return `<table class="data-table"><tbody>${pend.map(i => {
    const a = acao(i);
    return `<tr><td class="mono">${i.protocolo}</td><td style="max-width:200px">${esc(i.titulo)}</td><td>${badgeStatus(i.status)}</td><td><button class="btn btn-primary btn-sm" onclick="${a.fn}">${a.label}</button></td></tr>`;
  }).join('')}</tbody></table>`;
}
function alertasSla() {
  const items = [];
  DB.ideias.forEach(i => {
    if (i.status === 'recebida') { const d = diasDesde(i.dataCriacao); if (d >= 1) items.push({ txt: `${i.protocolo} sem reunião agendada`, dias: d, limite: 1 }); }
    if (i.status === 'carta_analista' || i.status === 'carta_gerente' || i.status === 'carta_diretoria') { const d = diasDesde(i.dataCriacao); if (d >= 2) items.push({ txt: `${i.protocolo} — carta parada em aprovação`, dias: d, limite: 2 }); }
  });
  if (!items.length) return `<div class="empty-state">${icon('shield-check')}<div class="t">Nenhum SLA vencido</div></div>`;
  return items.map(it => `<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--border);font-size:13px">${esc(it.txt)} ${slaBadgeFor(it.dias, it.limite)}</div>`).join('');
}

function renderQualIdeias() {
  return `
    <div class="filters-row">
      <div class="search-box">${icon('search')}<input id="qIdeiasSearch" placeholder="Pesquisar por protocolo, título, colaborador..." value="${esc(UI.qualSearch || '')}" oninput="UI.qualSearch=this.value; updateQualIdeiasResults();"></div>
      <button class="btn ${UI.qualIdeiasMode === 'table' ? 'btn-primary' : 'btn-outline'} btn-sm" onclick="UI.qualIdeiasMode='table';refresh()">${icon('table')} Tabela</button>
      <button class="btn ${UI.qualIdeiasMode === 'kanban' ? 'btn-primary' : 'btn-outline'} btn-sm" onclick="UI.qualIdeiasMode='kanban';refresh()">${icon('layout-grid')} Kanban</button>
    </div>
    <div id="qIdeiasResults">${UI.qualIdeiasMode === 'table' ? qualIdeiasTable() : qualIdeiasKanban()}</div>
  `;
}
function updateQualIdeiasResults() {
  const el = document.getElementById('qIdeiasResults');
  if (!el) return;
  el.innerHTML = UI.qualIdeiasMode === 'table' ? qualIdeiasTable() : qualIdeiasKanban();
  lucide.createIcons();
}
function qualFiltered() {
  const q = normalizeTxt(UI.qualSearch || '');
  if (!q) return DB.ideias;
  return DB.ideias.filter(i => normalizeTxt(i.protocolo + ' ' + i.titulo + ' ' + i.colaborador.nome + ' ' + i.area).includes(q));
}
function qualIdeiasTable() {
  const list = qualFiltered();
  return `
  <div class="panel"><div class="panel-body table-wrap">
    <table class="data-table">
      <thead><tr><th>Protocolo</th><th>Título</th><th>Colaborador</th><th>Área</th><th>Categoria</th><th>Prioridade</th><th>Status</th><th></th></tr></thead>
      <tbody>
        ${list.map(i => `
          <tr>
            <td class="mono">${i.protocolo}</td>
            <td style="max-width:220px">${esc(i.titulo)}</td>
            <td>${esc(i.colaborador.nome)}</td>
            <td>${esc(i.area)}</td>
            <td>${badgeCategoria(i.categoria)}</td>
            <td>${badgePrioridade(i.prioridade)}</td>
            <td>${badgeStatus(i.status)}</td>
            <td><button class="link-btn" onclick="openIdeaDrawerQual('${i.id}')">Abrir</button></td>
          </tr>`).join('') || `<tr><td colspan="8"><div class="empty-state">${icon('search-x')}<div class="t">Nenhum resultado</div></div></td></tr>`}
      </tbody>
    </table>
  </div></div>`;
}
function qualIdeiasKanban() {
  return `
  <div class="panel"><div class="panel-body">
    <p style="font-size:12px;color:var(--text-muted);margin:0 0 12px">Os cartões avançam automaticamente conforme o fluxo oficial — movimentações manuais fora da regra de negócio são bloqueadas.</p>
    <div class="kanban-scroll">
      ${KANBAN_COLUMNS.map(col => {
        const items = DB.ideias.filter(i => i.status === col.key);
        return `<div class="kanban-col">
          <div class="kanban-col-head"><span class="t">${col.label}</span><span class="n">${items.length}</span></div>
          ${items.map(i => `
            <div class="kanban-card" onclick="openIdeaDrawerQual('${i.id}')">
              <div class="p">${i.protocolo}</div>
              <div class="t">${esc(i.titulo)}</div>
              ${badgePrioridade(i.prioridade)}
            </div>`).join('') || `<div class="kanban-empty">Vazio</div>`}
        </div>`;
      }).join('')}
    </div>
  </div></div>`;
}

function openIdeaDrawerQual(id) {
  const i = DB.ideias.find(x => x.id === id);
  const sims = findSimilar(i.titulo, i.id);
  let acaoHtml = '';
  if (i.status === 'recebida') acaoHtml = `<button class="btn btn-primary btn-block" onclick="qualAgendarReuniaoModal('${i.id}')">${icon('calendar-plus')} Agendar Reunião do Comitê</button>`;
  else if (i.status === 'aguardando_reuniao') acaoHtml = `<button class="btn btn-primary btn-block" onclick="qualIniciarAnalise('${i.id}')">${icon('play')} Iniciar análise do Comitê</button>`;
  else if (i.status === 'aguardando_decisao') acaoHtml = `<button class="btn btn-primary btn-block" onclick="qualDecisaoModal('${i.id}')">${icon('scale')} Registrar Decisão Oficial</button>`;
  else if (i.cartaId) acaoHtml = `<button class="btn btn-primary btn-block" onclick="openCartaDrawer('${i.cartaId}')">${icon('mail')} Abrir Carta</button>`;
  else if (i.status === 'enviada') acaoHtml = `<button class="btn btn-primary btn-block" onclick="qualReceberIdeia('${i.id}')">${icon('inbox')} Confirmar Recebimento</button>`;

  acaoHtml += `
    ${i.planoId ? `<button class="btn btn-outline btn-block" style="margin-top:8px" onclick="openPlanoDrawer('${i.planoId}')">${icon('rocket')} Ver Plano de Implantação</button>` : ''}
    ${(i.status === 'carta_enviada' && i.decisao === 'aprovada' && !i.planoId) ? `<button class="btn btn-outline btn-block" style="margin-top:8px" onclick="qualCriarPlanoModal('${i.id}')">${icon('rocket')} Criar Plano de Implantação</button>` : ''}`;

  openDrawer(`
    <div class="drawer-head"><div><h2>${esc(i.titulo)}</h2><div class="p">${i.protocolo}</div></div><button class="drawer-close" onclick="closeDrawer()">${icon('x')}</button></div>
    <div class="drawer-body">
      ${signalProgress(i.status)}
      <div class="section-title">Colaborador</div>
      <div class="kv-grid">
        <div class="kv"><div class="k">Nome</div><div class="v">${esc(i.colaborador.nome)}</div></div>
        <div class="kv"><div class="k">Matrícula</div><div class="v">${esc(i.colaborador.matricula)}</div></div>
        <div class="kv"><div class="k">Setor</div><div class="v">${esc(i.colaborador.setor)}</div></div>
        <div class="kv"><div class="k">Área</div><div class="v">${esc(i.area)}</div></div>
      </div>
      <div class="section-title">Descrição</div>
      <div class="desc-box">${esc(i.descricao)}</div>
      <div class="section-title">Benefício esperado</div>
      <div class="desc-box">${esc(i.beneficio)}</div>
      ${i.estimativa.anual ? `<div class="section-title">Estimativa financeira</div><div class="kv-grid"><div class="kv"><div class="k">Mensal</div><div class="v">${fmtMoney(i.estimativa.mensal)}</div></div><div class="kv"><div class="k">Anual</div><div class="v">${fmtMoney(i.estimativa.anual)}</div></div></div>` : ''}
      ${i.parecerComite ? `<div class="section-title">Parecer do Comitê</div><div class="desc-box">${i.parecerComite.resultado === 'favoravel' ? '✅ Favorável' : '❌ Desfavorável'} — ${esc(i.parecerComite.justificativa)}</div>` : ''}
      ${i.decisaoQualidade ? `<div class="section-title">Decisão Oficial</div><div class="desc-box">${i.decisaoQualidade.resultado === 'aprovada' ? '✅ Aprovada' : '❌ Reprovada'} — ${esc(i.decisaoQualidade.justificativa)}</div>` : ''}
      ${sims.length ? `<div class="section-title">Ideias semelhantes</div>${similaresHtml(sims)}` : ''}
      <div class="section-title">Histórico completo</div>
      <div class="hist-list">${i.historico.slice().reverse().map(h => `<div class="hist-item"><div class="t">${fmtDateTime(h.data)}</div><div class="e">${esc(h.evento)}</div></div>`).join('')}</div>
      <div class="section-title">Ações</div>
      ${acaoHtml}
    </div>`);
}
function qualReceberIdeia(id) {
  const i = DB.ideias.find(x => x.id === id);
  i.status = 'recebida'; addHistorico(i, 'Qualidade confirmou o recebimento.'); addAudit(SESSION.user.nome, `Confirmou recebimento de ${i.protocolo}.`);
  addNotif('colaborador', `Sua ideia ${i.protocolo} foi recebida pela Qualidade.`, 'inbox');
  closeDrawer(); toast('Recebimento confirmado.'); refresh();
}
function qualAgendarReuniaoModal(id) {
  const i = DB.ideias.find(x => x.id === id);
  const abertas = DB.reunioes.filter(r => r.status === 'agendada');
  openModal(`
    <h3>Agendar reunião do Comitê</h3>
    <p class="sub">Ideia ${i.protocolo} — ${esc(i.titulo)}</p>
    <div class="field"><label>Reunião</label>
      <select id="reuniaoSelect">
        ${abertas.map(r => `<option value="${r.id}">${r.codigo} — ${fmtDate(r.data)} às ${r.hora}</option>`).join('')}
        <option value="__nova__">+ Criar nova reunião</option>
      </select>
    </div>
    <div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="confirmarAgendamento('${i.id}')">Agendar</button></div>
  `);
}
function confirmarAgendamento(ideaId) {
  const i = DB.ideias.find(x => x.id === ideaId);
  const sel = document.getElementById('reuniaoSelect').value;
  let reuniao;
  if (sel === '__nova__') {
    reuniao = { id: uid('R'), codigo: `COM-2026-0${DB.reunioes.length + 15}`, data: '2026-08-17', hora: '09:00', local: 'Sala de Reuniões 1', participantes: ['Rafael Nunes', 'Fernanda Dias', 'Carlos Prado'], pauta: [], ata: null, status: 'agendada' };
    DB.reunioes.push(reuniao);
  } else { reuniao = DB.reunioes.find(r => r.id === sel); }
  reuniao.pauta.push(i.id);
  i.reuniaoId = reuniao.id; i.status = 'aguardando_reuniao';
  addHistorico(i, `Reunião ${reuniao.codigo} agendada.`);
  addAudit(SESSION.user.nome, `Agendou reunião ${reuniao.codigo} para ${i.protocolo}.`);
  closeModal(); closeDrawer(); toast('Reunião agendada com sucesso.'); refresh();
}
function qualIniciarAnalise(id) {
  const i = DB.ideias.find(x => x.id === id);
  i.status = 'em_analise_comite';
  addHistorico(i, 'Ideia liberada para análise do Comitê.');
  addAudit(SESSION.user.nome, `Liberou ${i.protocolo} para análise do Comitê.`);
  addNotif('comite', `Nova ideia na pauta de análise: ${i.protocolo}.`, 'list-plus');
  closeDrawer(); toast('Ideia liberada para o Comitê.'); refresh();
}
function qualDecisaoModal(id) {
  const i = DB.ideias.find(x => x.id === id);
  openModal(`
    <h3>Decisão Oficial</h3>
    <p class="sub">${i.protocolo} — ${esc(i.titulo)}</p>
    ${i.parecerComite ? `<div class="desc-box" style="margin-bottom:14px;font-size:12.5px">Parecer do Comitê: ${i.parecerComite.resultado === 'favoravel' ? '✅ Favorável' : '❌ Desfavorável'} — ${esc(i.parecerComite.justificativa)}</div>` : ''}
    <div class="radio-cards">
      <label class="radio-card" id="decAprova"><input type="radio" name="decisao" value="aprovada" onchange="setDecisaoChoice('aprovada')"><span class="t">Aprovar</span></label>
      <label class="radio-card" id="decReprova"><input type="radio" name="decisao" value="reprovada" onchange="setDecisaoChoice('reprovada')"><span class="t">Reprovar</span></label>
    </div>
    <div class="field" style="margin-top:14px"><label>Categoria da decisão</label>
      <select id="decMotivo">
        <option>Viabilidade técnica e financeira</option>
        <option>Alto potencial de economia</option>
        <option>Baixa viabilidade financeira</option>
        <option>Risco de segurança não mitigado</option>
        <option>Ideia duplicada</option>
      </select>
    </div>
    <div class="field"><label>Justificativa</label><textarea id="decJustificativa"></textarea></div>
    <div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="submitDecisao('${i.id}')">Confirmar decisão</button></div>
  `);
}
function setDecisaoChoice(v) {
  document.getElementById('decAprova').classList.toggle('checked', v === 'aprovada');
  document.getElementById('decReprova').classList.toggle('checked', v === 'reprovada');
}
function submitDecisao(id) {
  const resultado = document.querySelector('input[name="decisao"]:checked');
  const justificativa = document.getElementById('decJustificativa').value.trim();
  if (!resultado) { toast('Selecione Aprovar ou Reprovar.'); return; }
  if (!justificativa) { toast('Preencha a justificativa.'); return; }
  const i = DB.ideias.find(x => x.id === id);
  i.decisaoQualidade = { resultado: resultado.value, justificativa, motivo: document.getElementById('decMotivo').value, data: new Date().toISOString() };
  i.decisao = resultado.value;
  i.status = 'carta_elaboracao';
  addHistorico(i, `Qualidade ${resultado.value === 'aprovada' ? 'aprovou' : 'reprovou'} oficialmente.`);
  addAudit(SESSION.user.nome, `Registrou decisão oficial (${resultado.value}) para ${i.protocolo}.`);
  criarCartaParaIdeia(i, resultado.value === 'reprovada');
  addNotif('colaborador', `A decisão oficial sobre a ideia ${i.protocolo} foi registrada.`, 'scale');
  closeModal(); closeDrawer(); toast('Decisão registrada. Uma carta foi gerada automaticamente.'); refresh();
}

// ---------------- Comitê / Agenda (visão da Qualidade) ----------------
function renderQualComite() {
  return `
  <div class="panel">
    <div class="panel-head"><h3>Agenda do Comitê</h3><button class="btn btn-primary btn-sm" onclick="novaReuniaoModal()">${icon('plus')} Nova reunião</button></div>
    <div class="panel-body table-wrap">
      <table class="data-table">
        <thead><tr><th>Código</th><th>Data</th><th>Local</th><th>Pauta</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${DB.reunioes.map(r => `
            <tr>
              <td class="mono">${r.codigo}</td>
              <td>${fmtDate(r.data)} · ${r.hora}</td>
              <td>${esc(r.local)}</td>
              <td>${r.pauta.length} ideia(s)</td>
              <td>${r.status === 'agendada' ? '<span class="badge badge-warning">Agendada</span>' : '<span class="badge badge-success">Realizada</span>'}</td>
              <td>${r.status === 'agendada' ? `<button class="link-btn" onclick="registrarAtaModal('${r.id}')">Registrar ata</button>` : `<button class="link-btn" onclick="verAta('${r.id}')">Ver ata</button>`}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}
function novaReuniaoModal() {
  openModal(`
    <h3>Nova reunião do Comitê</h3>
    <div class="field"><label>Data</label><input type="date" id="nrData" value="2026-08-24"></div>
    <div class="field"><label>Hora</label><input type="time" id="nrHora" value="09:00"></div>
    <div class="field"><label>Local</label><input id="nrLocal" value="Sala de Reuniões 1"></div>
    <div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="criarReuniao()">Criar</button></div>
  `);
}
function criarReuniao() {
  const r = { id: uid('R'), codigo: `COM-2026-0${DB.reunioes.length + 15}`, data: document.getElementById('nrData').value, hora: document.getElementById('nrHora').value, local: document.getElementById('nrLocal').value, participantes: ['Rafael Nunes', 'Fernanda Dias', 'Carlos Prado'], pauta: [], ata: null, status: 'agendada' };
  DB.reunioes.push(r); addAudit(SESSION.user.nome, `Criou reunião ${r.codigo}.`); addNotif('comite', `Reunião ${r.codigo} agendada para ${fmtDate(r.data)}.`, 'calendar');
  closeModal(); toast('Reunião criada.'); refresh();
}
function registrarAtaModal(id) {
  openModal(`<h3>Registrar ata</h3><div class="field"><label>Conclusões da reunião</label><textarea id="ataTexto" placeholder="Descreva o que foi discutido e decidido..."></textarea></div>
  <div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="salvarAta('${id}')">Salvar ata</button></div>`);
}
function salvarAta(id) {
  const r = DB.reunioes.find(x => x.id === id);
  r.ata = document.getElementById('ataTexto').value.trim() || 'Reunião realizada sem observações adicionais.';
  r.status = 'realizada';
  addAudit(SESSION.user.nome, `Registrou ata da reunião ${r.codigo}.`);
  addNotif('comite', `Ata da reunião ${r.codigo} disponível.`, 'file-text');
  closeModal(); toast('Ata registrada e vinculada permanentemente.'); refresh();
}

// ---------------- Cartas ----------------
function renderQualCartas() {
  const list = DB.cartas.map(c => ({ c, idea: DB.ideias.find(i => i.id === c.ideiaId) })).filter(x => x.idea);
  return `
  <div class="panel"><div class="panel-body table-wrap">
    <table class="data-table">
      <thead><tr><th>Protocolo</th><th>Tipo</th><th>Versão</th><th>Status</th><th>Responsável</th><th></th></tr></thead>
      <tbody>
        ${list.map(({ c, idea }) => `
          <tr>
            <td class="mono">${idea.protocolo}</td>
            <td>${c.tipo === 'aprovacao' ? '<span class="badge badge-success">Aprovação</span>' : '<span class="badge badge-error">Reprovação</span>'}</td>
            <td>v${c.versao}</td>
            <td>${badgeStatus(idea.status)}</td>
            <td>${esc(c.responsavelRedacao)}</td>
            <td><button class="link-btn" onclick="openCartaDrawer('${c.id}')">Abrir</button></td>
          </tr>`).join('') || `<tr><td colspan="6"><div class="empty-state">${icon('mail')}<div class="t">Nenhuma carta criada ainda</div></div></td></tr>`}
      </tbody>
    </table>
  </div></div>`;
}
function openCartaDrawer(cartaId) {
  const c = DB.cartas.find(x => x.id === cartaId);
  const idea = DB.ideias.find(i => i.id === c.ideiaId);
  const canEditContent = SESSION.role === 'qualidade' && idea.status === 'carta_elaboracao';
  let acoes = '';
  if (SESSION.role === 'qualidade') {
    if (idea.status === 'carta_elaboracao') acoes = `<button class="btn btn-primary btn-block" onclick="qualEnviarParaAnalista('${c.id}')">${icon('send')} Enviar para Analista</button>`;
    else if (idea.status === 'carta_pronta') acoes = `<button class="btn btn-primary btn-block" onclick="qualEnviarCartaFinal('${c.id}')">${icon('mail-check')} Enviar Carta ao Colaborador</button>`;
  }
  openDrawer(`
    <div class="drawer-head"><div><h2>Carta — ${idea.protocolo}</h2><div class="p">${c.tipo === 'aprovacao' ? 'Carta de Aprovação' : 'Carta de Reprovação'} · v${c.versao}</div></div><button class="drawer-close" onclick="closeDrawer()">${icon('x')}</button></div>
    <div class="drawer-body">
      <div class="section-title">Status atual</div>
      ${badgeStatus(idea.status)}
      <div class="section-title">Conteúdo da carta</div>
      <textarea id="cartaConteudo" style="min-height:220px" ${canEditContent ? '' : 'readonly'}>${esc(c.conteudo)}</textarea>
      ${canEditContent ? `<button class="btn btn-outline btn-sm" style="margin-top:8px" onclick="qualSalvarConteudo('${c.id}')">${icon('save')} Salvar rascunho</button>` : ''}

      <div class="section-title">Histórico de versões</div>
      <div class="hist-list">${c.historicoVersoes.slice().reverse().map(v => `<div class="hist-item"><div class="t">v${v.versao} · ${fmtDateTime(v.data)}</div><div class="e">${esc(v.evento)}</div></div>`).join('')}</div>

      ${c.comentarios.length ? `<div class="section-title">Comentários de revisão</div>${c.comentarios.map(cm => `<div class="desc-box" style="margin-bottom:8px"><b>${esc(cm.autor)}</b> (v${cm.versao}): ${esc(cm.texto)}</div>`).join('')}` : ''}

      <div class="section-title">Ações</div>
      ${acoes || `<p style="font-size:12.5px;color:var(--text-muted)">Nenhuma ação disponível para o seu perfil neste momento.</p>`}
    </div>`);
}
function qualSalvarConteudo(cartaId) {
  const c = DB.cartas.find(x => x.id === cartaId);
  c.conteudo = document.getElementById('cartaConteudo').value;
  toast('Rascunho salvo.');
}
function qualEnviarParaAnalista(cartaId) {
  const c = DB.cartas.find(x => x.id === cartaId);
  const idea = DB.ideias.find(i => i.id === c.ideiaId);
  c.conteudo = document.getElementById('cartaConteudo').value;
  idea.status = 'carta_analista'; c.status = 'carta_analista';
  c.historicoVersoes.push({ versao: c.versao, evento: 'Carta enviada para a Analista.', data: new Date().toISOString() });
  addHistorico(idea, 'Carta enviada para aprovação da Analista.');
  addAudit(SESSION.user.nome, `Enviou carta de ${idea.protocolo} para a Analista.`);
  addNotif('analista', `Nova carta para revisão: ${idea.protocolo}.`, 'mail-check');
  closeDrawer(); toast('Carta enviada para a Analista.'); refresh();
}
function qualEnviarCartaFinal(cartaId) {
  const c = DB.cartas.find(x => x.id === cartaId);
  const idea = DB.ideias.find(i => i.id === c.ideiaId);
  c.status = 'carta_enviada'; idea.status = 'carta_enviada';
  c.historicoVersoes.push({ versao: c.versao, evento: 'Carta gerada em PDF, assinada e enviada ao colaborador.', data: new Date().toISOString() });
  addHistorico(idea, 'Qualidade enviou a carta oficial ao colaborador.');
  addAudit(SESSION.user.nome, `Enviou carta final de ${idea.protocolo}.`);
  addNotif('colaborador', `A carta referente à ideia ${idea.protocolo} está disponível.`, 'mail-check');
  if (idea.decisao === 'reprovada') {
    idea.status = 'concluida';
    addHistorico(idea, 'Processo encerrado (ideia reprovada).');
  }
  closeDrawer(); toast('Carta enviada ao colaborador.');
  if (idea.decisao === 'aprovada' && !idea.planoId) {
    setTimeout(() => qualCriarPlanoModal(idea.id, true), 250);
  } else { refresh(); }
}


/* ============================================================
   SINAL VERDE — Aprovação de Cartas (Analista/Gerente/Diretoria)
   Parte do protótipo do Programa Sinal Verde (ver /README.md).
   ============================================================ */

// ---------------- Cartas — aprovação (Analista/Gerente/Diretoria) ----------------
const STAGE_ROLE = { carta_analista: 'analista', carta_gerente: 'gerente', carta_diretoria: 'diretoria' };
const NEXT_STAGE = { carta_analista: 'carta_gerente', carta_gerente: 'carta_diretoria', carta_diretoria: 'carta_pronta' };
const ROLE_LABEL = { analista: 'Analista', gerente: 'Gerente', diretoria: 'Diretoria' };

function renderAprovCartas() {
  const stage = Object.keys(STAGE_ROLE).find(k => STAGE_ROLE[k] === SESSION.role);
  const list = DB.ideias.filter(i => i.status === stage);
  return `
  <div class="panel"><div class="panel-body table-wrap">
    <table class="data-table">
      <thead><tr><th>Protocolo</th><th>Título</th><th>Tipo</th><th>Tempo na etapa</th><th></th></tr></thead>
      <tbody>
        ${list.map(i => {
          const c = DB.cartas.find(x => x.id === i.cartaId);
          const dias = diasDesde(i.dataCriacao);
          return `<tr>
            <td class="mono">${i.protocolo}</td>
            <td style="max-width:260px">${esc(i.titulo)}</td>
            <td>${c.tipo === 'aprovacao' ? '<span class="badge badge-success">Aprovação</span>' : '<span class="badge badge-error">Reprovação</span>'}</td>
            <td>${slaBadgeFor(dias, 2)}</td>
            <td><button class="btn btn-primary btn-sm" onclick="openCartaReviewModal('${c.id}')">Revisar</button></td>
          </tr>`;
        }).join('') || `<tr><td colspan="5"><div class="empty-state">${icon('inbox')}<div class="t">Nenhuma carta pendente para você</div></div></td></tr>`}
      </tbody>
    </table>
  </div></div>`;
}
function openCartaReviewModal(cartaId) {
  const c = DB.cartas.find(x => x.id === cartaId);
  const idea = DB.ideias.find(i => i.id === c.ideiaId);
  openDrawer(`
    <div class="drawer-head"><div><h2>Carta — ${idea.protocolo}</h2><div class="p">v${c.versao} · ${esc(idea.titulo)}</div></div><button class="drawer-close" onclick="closeDrawer()">${icon('x')}</button></div>
    <div class="drawer-body">
      <div class="section-title">Conteúdo</div>
      <div class="desc-box">${esc(c.conteudo)}</div>
      ${c.comentarios.length ? `<div class="section-title">Comentários anteriores</div>${c.comentarios.map(cm => `<div class="desc-box" style="margin-bottom:8px"><b>${esc(cm.autor)}</b>: ${esc(cm.texto)}</div>`).join('')}` : ''}
      <div class="section-title">Sua decisão</div>
      <div style="display:flex;gap:10px">
        <button class="btn btn-primary" style="flex:1" onclick="aprovarCarta('${c.id}')">${icon('check')} Aprovar</button>
        <button class="btn btn-outline" style="flex:1" onclick="mostrarCorrecaoBox('${c.id}')">${icon('rotate-ccw')} Solicitar Correção</button>
      </div>
      <div id="correcaoBox" class="hidden" style="margin-top:14px">
        <div class="field"><label>Comentário / correção solicitada</label><textarea id="correcaoTexto" placeholder="Descreva o que precisa ser ajustado..."></textarea></div>
        <button class="btn btn-outline btn-block" onclick="solicitarCorrecao('${c.id}')">Enviar correção</button>
      </div>
    </div>`);
}
function mostrarCorrecaoBox(id) { document.getElementById('correcaoBox').classList.remove('hidden'); }
function aprovarCarta(cartaId) {
  const c = DB.cartas.find(x => x.id === cartaId);
  const idea = DB.ideias.find(i => i.id === c.ideiaId);
  const next = NEXT_STAGE[idea.status];
  const roleAtual = ROLE_LABEL[STAGE_ROLE[idea.status]];
  c.versao += 1;
  c.historicoVersoes.push({ versao: c.versao, evento: `${roleAtual} aprovou.`, data: new Date().toISOString() });
  idea.status = next; c.status = next;
  addHistorico(idea, `${roleAtual} aprovou a carta.`);
  addAudit(SESSION.user.nome, `Aprovou carta de ${idea.protocolo} (${roleAtual}).`);
  if (next === 'carta_gerente') addNotif('gerente', `Nova carta para revisão: ${idea.protocolo}.`, 'mail-check');
  if (next === 'carta_diretoria') addNotif('diretoria', `Carta aguardando aprovação institucional: ${idea.protocolo}.`, 'briefcase');
  if (next === 'carta_pronta') addNotif('qualidade', `Carta de ${idea.protocolo} aprovada pela Diretoria e pronta para envio.`, 'badge-check');
  closeDrawer(); toast(`Carta aprovada${next === 'carta_pronta' ? ' — pronta para envio' : ''}.`); refresh();
}
function solicitarCorrecao(cartaId) {
  const texto = document.getElementById('correcaoTexto').value.trim();
  if (!texto) { toast('Descreva a correção solicitada.'); return; }
  const c = DB.cartas.find(x => x.id === cartaId);
  const idea = DB.ideias.find(i => i.id === c.ideiaId);
  const roleAtual = ROLE_LABEL[STAGE_ROLE[idea.status]];
  c.comentarios.push({ autor: `${roleAtual} (${SESSION.user.nome})`, texto, data: new Date().toISOString(), versao: c.versao });
  c.versao += 1;
  c.historicoVersoes.push({ versao: c.versao, evento: `${roleAtual} solicitou correção.`, data: new Date().toISOString() });
  idea.status = 'carta_elaboracao'; c.status = 'carta_elaboracao';
  addHistorico(idea, `${roleAtual} solicitou correção na carta.`);
  addAudit(SESSION.user.nome, `Solicitou correção na carta de ${idea.protocolo}.`);
  addNotif('qualidade', `Correção solicitada (${roleAtual}) na carta de ${idea.protocolo}.`, 'rotate-ccw');
  closeDrawer(); toast('Correção solicitada. A carta retornou para a Qualidade.'); refresh();
}

// ======================================================================
// DIRETORIA — dashboard estratégico
// ======================================================================
function renderDiretoriaDashboard() {
  const economiaConfirmada = DB.planos.filter(p => p.status === 'concluido').reduce((s, p) => s + p.economia.obtida, 0) + 4780000;
  const aprovadas = DB.ideias.filter(i => i.decisao === 'aprovada').length;
  const total = DB.ideias.length;
  return `
  <div class="kpi-grid">
    ${kpiCard('trending-up', 'Economia acumulada', fmtMoney(economiaConfirmada))}
    ${kpiCard('percent', 'ROI', '742%')}
    ${kpiCard('badge-check', 'Taxa de aprovação', `${total ? Math.round(aprovadas / total * 100) : 0}%`)}
    ${kpiCard('users', 'Participação', '72%')}
  </div>
  <div class="panel">
    <div class="panel-head"><h3>Cartas aguardando sua aprovação</h3></div>
    <div class="panel-body table-wrap">
      ${(() => { const list = DB.ideias.filter(i => i.status === 'carta_diretoria'); return list.length ? `<table class="data-table"><tbody>${list.map(i => `<tr><td class="mono">${i.protocolo}</td><td>${esc(i.titulo)}</td><td><button class="btn btn-primary btn-sm" onclick="openCartaReviewModal('${i.cartaId}')">Revisar</button></td></tr>`).join('')}</tbody></table>` : `<div class="empty-state">${icon('sparkles')}<div class="t">Nenhuma carta pendente</div></div>`; })()}
    </div>
  </div>`;
}


/* ============================================================
   SINAL VERDE — Portal da Qualidade — Implantação, BI, Usuários, Auditoria e Configurações
   Parte do protótipo do Programa Sinal Verde (ver /README.md).
   ============================================================ */

// ---------------- Implantação ----------------
function planoStatusLabel(s) {
  return { planejamento: 'Planejamento', execucao: 'Execução', testes: 'Testes', validacao: 'Validação', concluido: 'Concluído', arquivado: 'Arquivado' }[s] || s;
}
function renderQualImplantacoes() {
  const cols = ['planejamento', 'execucao', 'testes', 'validacao', 'concluido', 'arquivado'];
  return `
  <div class="panel"><div class="panel-body">
    <div class="kanban-scroll">
      ${cols.map(st => {
        const items = DB.planos.filter(p => p.status === st);
        return `<div class="kanban-col">
          <div class="kanban-col-head"><span class="t">${planoStatusLabel(st)}</span><span class="n">${items.length}</span></div>
          ${items.map(p => {
            const idea = DB.ideias.find(i => i.id === p.ideiaId);
            return `<div class="kanban-card" onclick="openPlanoDrawer('${p.id}')"><div class="p">${idea ? idea.protocolo : ''}</div><div class="t">${esc(p.titulo.replace('Plano de Implantação — ', ''))}</div><span class="badge badge-info">${fmtMoney(p.economia.prevista)}</span></div>`;
          }).join('') || `<div class="kanban-empty">Vazio</div>`}
        </div>`;
      }).join('')}
    </div>
  </div></div>`;
}
function qualCriarPlanoModal(ideaId, afterSend) {
  const idea = DB.ideias.find(i => i.id === ideaId);
  openModal(`
    <h3>Deseja criar o Plano de Implantação agora?</h3>
    <p class="sub">${idea.protocolo} — ${esc(idea.titulo)}</p>
    <div class="field"><label>Responsável pela implantação</label><input id="planoResp" value="${esc(idea.colaborador.nome)}"></div>
    <div class="field"><label>Prazo</label><input id="planoPrazo" value="60 dias"></div>
    <div class="field"><label>Prioridade</label>
      <select id="planoPrioridade">${['baixa', 'normal', 'alta', 'critica'].map(p => `<option value="${p}" ${idea.prioridade === p ? 'selected' : ''}>${PRIORIDADE_META[p].label}</option>`).join('')}</select>
    </div>
    <div class="modal-actions"><button class="btn btn-outline" onclick="closeModal();refresh();">Depois</button><button class="btn btn-primary" onclick="criarPlano('${idea.id}')">Sim, criar agora</button></div>
  `);
}
function criarPlano(ideaId) {
  const idea = DB.ideias.find(i => i.id === ideaId);
  const plano = criarPlanoParaIdeia(idea, { responsavel: document.getElementById('planoResp').value, prazo: document.getElementById('planoPrazo').value, prioridade: document.getElementById('planoPrioridade').value });
  idea.planoId = plano.id; idea.status = 'implantacao';
  addHistorico(idea, 'Plano de Implantação criado.');
  addAudit(SESSION.user.nome, `Criou plano de implantação para ${idea.protocolo}.`);
  addNotif('colaborador', `A implantação da sua ideia ${idea.protocolo} foi iniciada.`, 'rocket');
  addNotif('comite', `Implantação iniciada para ${idea.protocolo}.`, 'rocket');
  closeModal(); toast('Plano de Implantação criado.'); refresh();
}
function openPlanoDrawer(planoId, readonly) {
  const p = DB.planos.find(x => x.id === planoId);
  const idea = DB.ideias.find(i => i.id === p.ideiaId);
  const isQual = SESSION.role === 'qualidade' && !readonly;
  openDrawer(`
    <div class="drawer-head"><div><h2>${esc(p.titulo)}</h2><div class="p">${idea ? idea.protocolo : ''}</div></div><button class="drawer-close" onclick="closeDrawer()">${icon('x')}</button></div>
    <div class="drawer-body">
      <div class="kv-grid">
        <div class="kv"><div class="k">Responsável</div><div class="v">${esc(p.responsavel)}</div></div>
        <div class="kv"><div class="k">Setor</div><div class="v">${esc(p.setor)}</div></div>
        <div class="kv"><div class="k">Prazo</div><div class="v">${esc(p.prazo)}</div></div>
        <div class="kv"><div class="k">Prioridade</div><div class="v">${badgePrioridade(p.prioridade)}</div></div>
      </div>
      <div class="section-title">Status do plano</div>
      ${isQual ? `<select onchange="mudarStatusPlano('${p.id}', this.value)">${['planejamento', 'execucao', 'testes', 'validacao', 'concluido', 'arquivado'].map(s => `<option value="${s}" ${p.status === s ? 'selected' : ''}>${planoStatusLabel(s)}</option>`).join('')}</select>` : `<span class="badge badge-info">${planoStatusLabel(p.status)}</span>`}

      <div class="section-title">Objetivo</div>
      <div class="desc-box">${esc(p.objetivo)}</div>

      <div class="section-title">Plano de ação</div>
      ${p.acoes.map(a => `
        <div class="kv" style="margin-bottom:8px;display:flex;justify-content:space-between;align-items:center">
          <div><div class="v">${esc(a.descricao)}</div><div class="k">Resp.: ${esc(a.responsavel)} · Prazo: ${esc(a.prazo)}</div></div>
          ${isQual ? `<select onchange="mudarStatusAcao('${p.id}','${a.id}', this.value)">${['nao_iniciada', 'em_andamento', 'concluida', 'pausada', 'cancelada'].map(s => `<option value="${s}" ${a.status === s ? 'selected' : ''}>${acaoStatusLabel(s)}</option>`).join('')}</select>` : `<span class="badge ${a.status === 'concluida' ? 'badge-success' : 'badge-info'}">${acaoStatusLabel(a.status)}</span>`}
        </div>`).join('')}
      ${isQual ? `<button class="btn btn-outline btn-sm" onclick="addAcaoModal('${p.id}')">${icon('plus')} Adicionar ação</button>` : ''}

      <div class="section-title">Validação financeira</div>
      <div class="kv-grid">
        <div class="kv"><div class="k">Economia prevista</div><div class="v">${fmtMoney(p.economia.prevista)}</div></div>
        <div class="kv"><div class="k">Economia obtida</div><div class="v">${fmtMoney(p.economia.obtida)}</div></div>
      </div>
      ${isQual ? `<button class="btn btn-outline btn-sm" style="margin-top:8px" onclick="registrarEconomiaModal('${p.id}')">${icon('calculator')} Registrar economia obtida</button>` : ''}

      ${p.acompanhamentos.length ? `<div class="section-title">Acompanhamentos</div>${p.acompanhamentos.map(a => `<div class="desc-box" style="margin-bottom:8px"><b>${esc(a.periodo)}</b> — ${a.continua === 'sim' ? 'Continua funcionando' : a.continua === 'parcial' ? 'Funcionando parcialmente' : 'Não está funcionando'}. ${esc(a.observacoes || '')}</div>`).join('')}` : ''}
      ${isQual ? `<button class="btn btn-outline btn-sm" onclick="addAcompanhamentoModal('${p.id}')">${icon('clipboard-check')} Registrar acompanhamento</button>` : ''}
      ${SESSION.role === 'comite' && p.status !== 'concluido' ? `<button class="btn btn-outline btn-sm" onclick="comiteAvaliarEfetividade('${p.id}')">${icon('thumbs-up')} A melhoria foi eficaz?</button>` : ''}

      ${isQual && p.status !== 'concluido' ? `<div class="section-title">Encerramento</div><button class="btn btn-primary btn-block" onclick="encerrarImplantacaoModal('${p.id}')">${icon('flag')} Encerrar Implantação</button>` : ''}
    </div>`);
}
function acaoStatusLabel(s) { return { nao_iniciada: 'Não iniciada', em_andamento: 'Em andamento', concluida: 'Concluída', pausada: 'Pausada', cancelada: 'Cancelada' }[s] || s; }
function mudarStatusPlano(planoId, status) {
  const p = DB.planos.find(x => x.id === planoId);
  p.status = status;
  const idea = DB.ideias.find(i => i.id === p.ideiaId);
  if (idea) idea.status = status === 'validacao' ? 'acompanhamento' : (status === 'concluido' || status === 'arquivado') ? idea.status : 'implantacao';
  addAudit(SESSION.user.nome, `Alterou status do plano de ${idea ? idea.protocolo : p.id} para ${planoStatusLabel(status)}.`);
  toast('Status do plano atualizado.'); openPlanoDrawer(planoId);
}
function mudarStatusAcao(planoId, acaoId, status) {
  const p = DB.planos.find(x => x.id === planoId);
  const a = p.acoes.find(x => x.id === acaoId);
  a.status = status;
  toast('Ação atualizada.');
}
function addAcaoModal(planoId) {
  openModal(`<h3>Nova ação</h3>
    <div class="field"><label>Descrição</label><input id="novaAcaoDesc"></div>
    <div class="field"><label>Responsável</label><input id="novaAcaoResp"></div>
    <div class="field"><label>Prazo</label><input id="novaAcaoPrazo" placeholder="Ex: 15 dias"></div>
    <div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="salvarAcao('${planoId}')">Adicionar</button></div>`);
}
function salvarAcao(planoId) {
  const p = DB.planos.find(x => x.id === planoId);
  p.acoes.push({ id: uid('A'), descricao: document.getElementById('novaAcaoDesc').value, responsavel: document.getElementById('novaAcaoResp').value, prazo: document.getElementById('novaAcaoPrazo').value, status: 'nao_iniciada' });
  closeModal(); toast('Ação adicionada.'); openPlanoDrawer(planoId);
}
function registrarEconomiaModal(planoId) {
  openModal(`<h3>Registrar economia obtida</h3><div class="field"><label>Valor (R$)</label><input type="number" id="econObtida"></div>
  <div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="salvarEconomia('${planoId}')">Salvar</button></div>`);
}
function salvarEconomia(planoId) {
  const p = DB.planos.find(x => x.id === planoId);
  p.economia.obtida = Number(document.getElementById('econObtida').value) || 0;
  closeModal(); toast('Economia registrada.'); openPlanoDrawer(planoId);
}
function addAcompanhamentoModal(planoId) {
  openModal(`<h3>Registrar acompanhamento</h3>
    <div class="field"><label>Período</label><select id="acompPeriodo">${['30 dias', '60 dias', '90 dias', '180 dias', '365 dias'].map(p => `<option>${p}</option>`).join('')}</select></div>
    <div class="field"><label>A ideia continua funcionando?</label><select id="acompContinua"><option value="sim">Sim</option><option value="parcial">Parcialmente</option><option value="nao">Não</option></select></div>
    <div class="field"><label>Observações</label><textarea id="acompObs"></textarea></div>
    <div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="salvarAcompanhamento('${planoId}')">Salvar</button></div>`);
}
function salvarAcompanhamento(planoId) {
  const p = DB.planos.find(x => x.id === planoId);
  p.acompanhamentos.push({ periodo: document.getElementById('acompPeriodo').value, continua: document.getElementById('acompContinua').value, observacoes: document.getElementById('acompObs').value, data: new Date().toISOString() });
  closeModal(); toast('Acompanhamento registrado.'); openPlanoDrawer(planoId);
}
function comiteAvaliarEfetividade(planoId) {
  openModal(`<h3>A melhoria foi eficaz?</h3>
    <div class="modal-actions" style="justify-content:center">
      <button class="btn btn-outline" onclick="closeModal();toast('Resposta registrada: Não.')">Não</button>
      <button class="btn btn-outline" onclick="closeModal();toast('Resposta registrada: Parcialmente.')">Parcialmente</button>
      <button class="btn btn-primary" onclick="closeModal();toast('Resposta registrada: Sim.')">Sim</button>
    </div>`);
}
function encerrarImplantacaoModal(planoId) {
  const p = DB.planos.find(x => x.id === planoId);
  openModal(`<h3>Confirma o encerramento desta implantação?</h3>
    <div class="field"><label>Resultados atingidos?</label><select id="encResultado"><option value="sim">Sim</option><option value="parcial">Parcialmente</option><option value="nao">Não</option></select></div>
    <div class="field"><label>Efetividade (0–100%)</label><input type="number" min="0" max="100" id="encEfetividade" value="${p.economia.prevista ? Math.round((p.economia.obtida || p.economia.prevista * 0.9) / p.economia.prevista * 100) : 90}"></div>
    <div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="encerrarImplantacao('${planoId}')">Confirmar</button></div>`);
}
function encerrarImplantacao(planoId) {
  const p = DB.planos.find(x => x.id === planoId);
  const idea = DB.ideias.find(i => i.id === p.ideiaId);
  p.status = 'concluido';
  if (!p.economia.obtida) p.economia.obtida = Math.round(p.economia.prevista * (Number(document.getElementById('encEfetividade').value) / 100));
  idea.status = 'concluida';
  addHistorico(idea, 'Implantação encerrada oficialmente.');
  addAudit(SESSION.user.nome, `Encerrou implantação de ${idea.protocolo}.`);
  addNotif('colaborador', `A implantação da sua ideia ${idea.protocolo} foi concluída. Obrigado pela contribuição!`, 'flag');
  closeModal(); toast('Implantação encerrada.'); refresh();
}

// ---------------- Indicadores (BI) ----------------
function renderQualIndicadores() {
  const ideias = DB.ideias;
  const total = ideias.length;
  const aprovadas = ideias.filter(i => i.decisao === 'aprovada').length;
  const reprovadas = ideias.filter(i => i.decisao === 'reprovada').length;
  const economiaConfirmada = DB.planos.filter(p => p.status === 'concluido').reduce((s, p) => s + p.economia.obtida, 0);
  const economiaPrevista = DB.planos.reduce((s, p) => s + p.economia.prevista, 0);
  const porArea = {};
  ideias.forEach(i => porArea[i.area] = (porArea[i.area] || 0) + 1);
  const areaMax = Math.max(1, ...Object.values(porArea));
  const seg = ideias.filter(i => i.categoria === 'seguranca').length;
  const custo = ideias.filter(i => i.categoria === 'custos').length;

  return `
  <div class="kpi-grid">
    ${kpiCard('list-checks', 'Total de ideias', total)}
    ${kpiCard('badge-check', 'Aprovadas', `${aprovadas} (${total ? Math.round(aprovadas / total * 100) : 0}%)`)}
    ${kpiCard('x-circle', 'Reprovadas', `${reprovadas} (${total ? Math.round(reprovadas / total * 100) : 0}%)`)}
    ${kpiCard('coins', 'Economia confirmada', fmtMoney(economiaConfirmada))}
  </div>
  <div class="grid-2">
    <div class="panel">
      <div class="panel-head"><h3>Ideias por área</h3></div>
      <div class="panel-body">
        ${Object.entries(porArea).sort((a, b) => b[1] - a[1]).map(([area, n]) => hbarScaled(area, n, areaMax)).join('') || '<p style="color:var(--text-muted)">Sem dados.</p>'}
      </div>
    </div>
    <div class="panel">
      <div class="panel-head"><h3>Distribuição por categoria</h3></div>
      <div class="panel-body">
        <div class="donut-wrap">
          ${donutSvg(seg, custo)}
          <div class="legend-list">
            <div><span class="dot" style="background:var(--error)"></span>Segurança — ${seg}</div>
            <div><span class="dot" style="background:var(--primary)"></span>Redução de Custos — ${custo}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="panel">
    <div class="panel-head"><h3>Economia — prevista vs. confirmada</h3></div>
    <div class="panel-body">
      <div class="bars">
        ${barCol('Prevista', economiaPrevista, Math.max(economiaPrevista, economiaConfirmada, 1))}
        ${barCol('Confirmada', economiaConfirmada, Math.max(economiaPrevista, economiaConfirmada, 1))}
      </div>
    </div>
  </div>
  <div class="panel">
    <div class="panel-head"><h3>Insights Inteligentes</h3><span class="sub">Resumo executivo gerado automaticamente</span></div>
    <div class="panel-body">
      <ul style="margin:0;padding-left:18px;font-size:13.5px;line-height:1.9;color:var(--text-secondary)">
        <li>A área de <b>${Object.entries(porArea).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'}</b> é a que mais envia ideias no momento.</li>
        <li>A taxa de aprovação atual é de <b>${total ? Math.round(aprovadas / total * 100) : 0}%</b>.</li>
        <li>Ideias de <b>Redução de Custos</b> representam <b>${total ? Math.round(custo / total * 100) : 0}%</b> do total enviado.</li>
        <li>Economia acumulada confirmada até o momento: <b>${fmtMoney(economiaConfirmada)}</b>.</li>
      </ul>
    </div>
  </div>`;
}
function hbarScaled(label, val, max) { return `<div class="hbar-row"><span class="name">${esc(label)}</span><div class="hbar-track"><div class="hbar-fill" style="width:${Math.round(val / max * 100)}%"></div></div><span class="n">${val}</span></div>`; }
function barCol(label, val, max) { const h = Math.max(6, Math.round(val / max * 140)); return `<div class="bar-col"><span class="val">${fmtMoney(val)}</span><div class="bar" style="height:${h}px"></div><span class="lbl">${label}</span></div>`; }
function donutSvg(seg, custo) {
  const total = Math.max(1, seg + custo);
  const segPct = seg / total; const r = 44, c = 2 * Math.PI * r;
  return `<svg width="120" height="120" viewBox="0 0 120 120">
    <circle cx="60" cy="60" r="${r}" fill="none" stroke="var(--primary)" stroke-width="18"/>
    <circle cx="60" cy="60" r="${r}" fill="none" stroke="var(--error)" stroke-width="18"
      stroke-dasharray="${c * segPct} ${c}" transform="rotate(-90 60 60)"/>
  </svg>`;
}

// ---------------- Usuários ----------------
function renderQualUsuarios() {
  const users = [
    { nome: 'Marina Costa', perfil: 'Colaborador', setor: 'Operação', status: 'Ativo' },
    { nome: 'João Silva', perfil: 'Colaborador', setor: 'Oficina', status: 'Ativo' },
    { nome: 'Rafael Nunes', perfil: 'Comitê', setor: 'Segurança do Trabalho', status: 'Ativo' },
    { nome: 'Fernanda Dias', perfil: 'Comitê', setor: 'Administrativo', status: 'Ativo' },
    { nome: 'Isabella Ramos', perfil: 'Qualidade', setor: 'Qualidade', status: 'Ativo' },
    { nome: 'Camila Alves', perfil: 'Analista da Qualidade', setor: 'Qualidade', status: 'Ativo' },
    { nome: 'Eduardo Lima', perfil: 'Gerente da Qualidade', setor: 'Qualidade', status: 'Ativo' },
    { nome: 'Roberto Cardoso', perfil: 'Diretoria', setor: 'Diretoria', status: 'Ativo' },
  ];
  return `
  <div class="panel">
    <div class="panel-head"><h3>Usuários cadastrados</h3><button class="btn btn-primary btn-sm" onclick="toast('Cadastro de usuário simulado neste protótipo.')">${icon('user-plus')} Novo usuário</button></div>
    <div class="panel-body table-wrap">
      <table class="data-table">
        <thead><tr><th>Nome</th><th>Perfil</th><th>Setor</th><th>Status</th><th></th></tr></thead>
        <tbody>${users.map(u => `<tr><td>${esc(u.nome)}</td><td><span class="badge badge-info">${u.perfil}</span></td><td>${esc(u.setor)}</td><td><span class="badge badge-success">${u.status}</span></td><td><button class="link-btn" onclick="toast('Reset de senha enviado por e-mail.')">Resetar senha</button></td></tr>`).join('')}</tbody>
      </table>
    </div>
  </div>`;
}

// ---------------- Auditoria ----------------
function renderQualAuditoria() {
  return `
  <div class="panel"><div class="panel-body table-wrap">
    <table class="data-table">
      <thead><tr><th>Data/hora</th><th>Usuário</th><th>Ação</th></tr></thead>
      <tbody>${DB.auditoria.map(a => `<tr><td class="mono">${fmtDateTime(a.data)}</td><td>${esc(a.usuario)}</td><td>${esc(a.acao)}</td></tr>`).join('')}</tbody>
    </table>
  </div></div>
  <p style="font-size:12px;color:var(--text-muted)">${icon('lock', '')} Nenhum registro de auditoria pode ser apagado — nem por administradores.</p>`;
}

// ---------------- Configurações ----------------
function renderQualConfig() {
  const slas = [
    ['Recebimento da ideia', '1 dia útil'], ['Agendamento da reunião', '5 dias úteis'], ['Parecer do Comitê', '5 dias úteis'],
    ['Decisão da Qualidade', '3 dias úteis'], ['Elaboração da carta', '3 dias úteis'], ['Aprovação da Analista', '2 dias úteis'],
    ['Aprovação da Gerente', '2 dias úteis'], ['Aprovação da Diretoria', '3 dias úteis'], ['Envio da carta', '2 dias úteis'],
    ['Criação do plano de implantação', '5 dias úteis'],
  ];
  return `
  <div class="grid-2">
    <div class="panel">
      <div class="panel-head"><h3>SLA por etapa</h3></div>
      <div class="panel-body table-wrap">
        <table class="data-table"><thead><tr><th>Etapa</th><th>Prazo padrão</th></tr></thead>
        <tbody>${slas.map(([e, d]) => `<tr><td>${e}</td><td><input value="${d}" style="border:1px solid var(--border);border-radius:6px;padding:5px 8px;font-size:12.5px;width:120px"></td></tr>`).join('')}</tbody></table>
        <button class="btn btn-primary btn-sm" style="margin-top:12px" onclick="toast('Configurações de SLA salvas.')">Salvar</button>
      </div>
    </div>
    <div class="panel">
      <div class="panel-head"><h3>Áreas cadastradas</h3></div>
      <div class="panel-body">
        <div class="chip-list">${AREAS.map(a => `<span class="chip">${a}</span>`).join('')}</div>
        <button class="btn btn-outline btn-sm" style="margin-top:12px" onclick="toast('Cadastro de área simulado neste protótipo.')">${icon('plus')} Nova área</button>
      </div>
    </div>
  </div>`;
}


/* ============================================================
   SINAL VERDE — Mascote flutuante
   Parte do protótipo do Programa Sinal Verde (ver /README.md).

   A pedido, o mascote hoje é um EMOJI animado (💡, o mesmo ícone
   da logo oficial) — um placeholder rápido e leve enquanto a
   arte definitiva do mascote oficial da Univale não fica pronta.
   Para trocar depois, basta mudar MASCOT_EMOJI abaixo (ou
   substituir por um <img>/SVG dentro de renderMascotFigure()) —
   toda a lógica de abrir, fechar e trocar de dica continua igual.
   ============================================================ */

const MASCOT_NAME = 'Univaldo';
const MASCOT_ROLE = 'seu guia no Sinal Verde';
const MASCOT_EMOJI = '💡';

function renderMascotFigure() {
  return `<span class="mascot-emoji">${MASCOT_EMOJI}</span>`;
}

const MASCOT_TIPS = [
  'Dica: você pode salvar sua ideia como rascunho e continuar depois — nada se perde.',
  'Quanto mais detalhada a descrição da sua ideia, mais fácil fica para o Comitê avaliar.',
  'Toda ideia recebe um protocolo único, tipo SV-2026-000185, para você acompanhar o andamento.',
  'Ideias parecidas com outras já enviadas aparecem automaticamente — assim evitamos duplicidade.',
  'Ideias de redução de custo com economia estimada tendem a ser avaliadas mais rápido.',
  'Você pode acompanhar cada etapa da sua ideia em "Minhas Ideias", sem precisar perguntar para ninguém.',
  'Toda carta aprovada vira um selo na sua aba "Conquistas" — dá uma olhada lá!',
];

let mascotOpen = false;
let mascotTipIndex = 0;

function mascotInit() {
  const fab = document.createElement('button');
  fab.className = 'mascot-fab';
  fab.id = 'mascotFab';
  fab.setAttribute('aria-label', `Assistente ${MASCOT_NAME}`);
  fab.innerHTML = renderMascotFigure();
  fab.onclick = mascotToggle;
  document.body.appendChild(fab);

  const bubble = document.createElement('div');
  bubble.className = 'mascot-bubble hidden';
  bubble.id = 'mascotBubble';
  document.body.appendChild(bubble);

  mascotRenderBubble();

  // Depois de alguns segundos, o mascote aparece uma vez sozinho
  // com uma dica de boas-vindas (como o "aceninho" de apps do tipo
  // Duolingo) — só nesta sessão, sem repetir a cada clique.
  setTimeout(() => {
    if (!mascotOpen) mascotToggle();
  }, 2600);
}

function mascotRenderBubble() {
  const bubble = document.getElementById('mascotBubble');
  if (!bubble) return;
  bubble.innerHTML = `
    <div class="mascot-bubble-head">
      ${renderMascotFigure()}
      <div>
        <div class="name">${MASCOT_NAME}</div>
        <div class="role">${MASCOT_ROLE}</div>
      </div>
      <button class="mascot-bubble-close" onclick="mascotToggle()" aria-label="Fechar">${icon('x')}</button>
    </div>
    <p>${MASCOT_TIPS[mascotTipIndex]}</p>
    <div class="mascot-bubble-actions">
      <button class="btn btn-outline btn-sm" onclick="mascotNextTip()">Outra dica</button>
    </div>`;
}

function mascotToggle() {
  mascotOpen = !mascotOpen;
  document.getElementById('mascotBubble').classList.toggle('hidden', !mascotOpen);
}

function mascotNextTip() {
  mascotTipIndex = (mascotTipIndex + 1) % MASCOT_TIPS.length;
  mascotRenderBubble();
}

// ======================================================================
// CONFETE — celebração rápida (envio de ideia, ideia aprovada etc.)
// ======================================================================
const CONFETTI_COLORS = ['#02A39D', '#00695C', '#F9A825', '#2E7D32', '#C08A1E'];
function celebrateConfetti(count) {
  const layer = document.createElement('div');
  layer.className = 'confetti-layer';
  document.body.appendChild(layer);
  const n = count || 26;
  for (let i = 0; i < n; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    const left = Math.random() * 100;
    const delay = Math.random() * 0.3;
    const duration = 1.4 + Math.random() * 1.1;
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    piece.style.left = left + 'vw';
    piece.style.background = color;
    piece.style.animationDelay = delay + 's';
    piece.style.animationDuration = duration + 's';
    piece.style.top = (-10 - Math.random() * 20) + 'px';
    layer.appendChild(piece);
  }
  setTimeout(() => layer.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  try { mascotInit(); } catch (e) { console.error('Falha ao iniciar o mascote:', e); }
});

/* ============================================================
   SINAL VERDE — Tratamento de erros e inicialização
   Parte do protótipo do Programa Sinal Verde (ver /README.md).
   ============================================================ */

// ======================================================================
// TRATAMENTO GLOBAL DE ERROS — evita tela em branco silenciosa
// ======================================================================
window.addEventListener('error', (e) => {
  console.error('Erro no Sinal Verde:', e.error || e.message);
  try {
    if (document.getElementById('toastStack')) toast('Ocorreu um erro inesperado nesta ação. Veja o console (F12) para detalhes.');
  } catch (_) { /* evita erro em cascata */ }
});

// ======================================================================
// INIT
// ======================================================================
document.addEventListener('DOMContentLoaded', () => {
  try {
    seed();
    renderTeamRoleList();
    lucide.createIcons();
  } catch (e) {
    console.error('Falha ao inicializar o Sinal Verde:', e);
  }
});
