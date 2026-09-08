/* =====================================================================
   PPG — Programa Política de Gestão
   v4.0 — dados organizacionais coerentes (via empresa.config.js),
   questionário estilo Duolingo, perfis totalmente separados, menu
   expansível/recolhível, Banco de Perguntas, Auditoria e drill-down.
   ===================================================================== */

/* ======================= DADOS DERIVADOS DA CONFIGURAÇÃO DA EMPRESA =======================
   Tudo aqui vem de window.EMPRESA_CONFIG (empresa.config.js). Nenhuma lista de
   setor/função/filial é mantida solta neste arquivo — isso evita combinações
   incoerentes como "setor ELÉTRICA + função GERENTE DE CSC". */
const EMPRESA = window.EMPRESA_CONFIG;
const SETORES = EMPRESA.setores.map(s => s.nome);
const UNIDADES = EMPRESA.filiais;
const FUNCOES = [...new Set(EMPRESA.setores.flatMap(s => s.funcoes))];
const CARGOS_IMPEDIDOS = EMPRESA.cargosImpedidos;
const CARGOS_PERMITIDOS = FUNCOES.filter(f => !CARGOS_IMPEDIDOS.includes(f));

const NOMES = []; // não é mais usado — participantes agora vêm do quadro real (EMPRESA.colaboradores)

function randomFrom(arr){return arr[Math.floor(Math.random()*arr.length)];}
function pad(n){return n.toString().padStart(2,'0');}
function fmtDateTime(d){return pad(d.getDate())+"/"+pad(d.getMonth()+1)+"/"+d.getFullYear()+" "+pad(d.getHours())+":"+pad(d.getMinutes());}
function opt(text, correct){ return {text, correct: !!correct}; }

/* Geração de participantes fictícios para o modo de teste — mas usando
   SEMPRE colaboradores reais do quadro ativo (planilha da empresa), nunca
   nomes/combinações inventadas. Cada campanha sorteia um grupo de
   colaboradores reais (sem repetir matrícula dentro da mesma campanha). */
function buildParticipants(campaignId, count, pct100Count){
  const list = [];
  const sampled = EMPRESA.sortearColaboradores(count);
  sampled.forEach((colab, i)=>{
    const acertos = i < pct100Count ? 100 : [90,80,70,60][Math.floor(Math.random()*4)];
    const d = new Date(2026, 5, 10 + Math.floor(i/4), 8 + (i%9), (i*7)%60);
    list.push({
      campaignId, nome: colab.nome, matricula: colab.matricula,
      setor: colab.setor, filial: colab.filial, funcao: colab.funcao, cargo: colab.funcao,
      data: d, pct: acertos, respostasCorretas: null
    });
  });
  return list;
}

function isoLocal(d){
  const p = n => String(n).padStart(2,'0');
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}
const _hoje = new Date();
const _inicioC1 = new Date(_hoje.getTime() - 20*24*60*60*1000);
const _fimC1 = new Date(_hoje.getTime() + 20*24*60*60*1000);

let campaigns = [
  {
    id:"c1", nome:"PPG 2026.1 – Segurança da Informação",
    descricao:"Avaliação sobre práticas de segurança da informação e proteção de dados corporativos.",
    objetivo:"Reforçar a cultura de segurança da informação entre todos os colaboradores.",
    inicio:isoLocal(_inicioC1), fim:isoLocal(_fimC1),
    qtdGanhadores:4, premio:"Vale-compras R$ 200,00", criterios:"Nenhum critério adicional definido.",
    status:"andamento", ganhadores:null,
    questoes:[
      {texto:"Qual é a prática recomendada ao identificar um e-mail suspeito?", type:"unica", options:[opt("Clicar no link para verificar a origem"),opt("Reportar ao canal de segurança e não interagir com o e-mail",true),opt("Responder pedindo mais informações ao remetente"),opt("Encaminhar para colegas avaliarem")]},
      {texto:"O que caracteriza uma senha forte?", type:"unica", options:[opt("Data de nascimento e nome do usuário"),opt("Sequência numérica simples, como 123456"),opt("Combinação de letras, números e símbolos, sem dados pessoais",true),opt("A mesma senha usada em vários sistemas")]},
      {texto:"Dados de clientes podem ser compartilhados sem autorização?", type:"vf", options:[opt("Verdadeiro"),opt("Falso",true)]},
      {texto:"Qual canal deve ser usado para reportar incidentes de segurança?", type:"unica", options:[opt("Grupo de WhatsApp da equipe"),opt("Canal oficial de segurança da informação",true),opt("Rede social corporativa"),opt("E-mail pessoal do gestor")]}
    ]
  },
  {
    id:"c2", nome:"PPG 2025.4 – Qualidade e Processos",
    descricao:"Questionário sobre procedimentos de qualidade, ISO 9001 e melhoria contínua.",
    objetivo:"Consolidar o entendimento sobre os processos certificados pela ISO 9001.",
    inicio:"2025-11-01T08:00", fim:"2025-11-20T18:00",
    qtdGanhadores:4, premio:"Vale-compras R$ 200,00", criterios:"Priorizar setores ainda não contemplados em 2025.",
    status:"encerrada", ganhadores:null,
    questoes:[
      {texto:"O que é uma não conformidade?", type:"unica", options:[opt("Um elogio do cliente"),opt("Um desvio em relação a um requisito estabelecido",true),opt("Uma sugestão de melhoria qualquer"),opt("Um novo processo criado")]},
      {texto:"Qual a periodicidade da auditoria interna?", type:"unica", options:[opt("Definida no programa de auditoria da empresa",true),opt("Nunca é definida"),opt("Somente quando há reclamação"),opt("A cada 5 anos, sem exceções")]},
      {texto:"Quais das opções abaixo fazem parte do ciclo PDCA?", type:"multiplas_respostas", options:[opt("Planejar",true),opt("Executar",true),opt("Ignorar os resultados"),opt("Verificar e agir",true)]},
      {texto:"Quem é responsável por abrir uma RNC (Registro de Não Conformidade)?", type:"unica", options:[opt("Somente a diretoria"),opt("Qualquer colaborador que identificar o desvio",true),opt("Somente auditores externos"),opt("Ninguém, é automático")]}
    ]
  },
  {
    id:"c3", nome:"PPG 2025.3 – Ética e Compliance",
    descricao:"Reforço das diretrizes do código de ética e canal de denúncias.",
    objetivo:"Assegurar o conhecimento do código de ética por todos os colaboradores.",
    inicio:"2025-08-01T08:00", fim:"2025-08-20T18:00",
    qtdGanhadores:4, premio:"Vale-compras R$ 150,00", criterios:"Nenhum critério adicional definido.",
    status:"finalizada",
    ganhadores:[
      {nome:"Paulo Dias", matricula:"100004", setor:"Financeiro", filial:"Filial Sul", funcao:"Analista Financeiro"},
      {nome:"Nelson Dias", matricula:"100017", setor:"Qualidade", filial:"Matriz", funcao:"Analista da Qualidade"},
      {nome:"Patrícia Dias", matricula:"100023", setor:"Recursos Humanos", filial:"Filial Oeste", funcao:"Assistente de RH"},
      {nome:"Rodrigo Silva", matricula:"100028", setor:"Manutenção", filial:"Filial Norte", funcao:"Mecânico"}
    ],
    randomSeed:"748291063", justificativa:"Distribuição justa alcançada: 4 setores e 3 filiais distintas representadas entre os ganhadores.", responsavel:"Mariana Queiroz",
    questoes:[
      {texto:"Qual o canal oficial para registrar uma denúncia?", type:"unica", options:[opt("Comentário em rede social"),opt("Canal de denúncias da Ética e Compliance",true),opt("Conversa informal com colegas"),opt("E-mail pessoal do diretor")]},
      {texto:"O que é conflito de interesses?", type:"unica", options:[opt("Quando interesses pessoais podem influenciar decisões profissionais",true),opt("Uma discordância entre colegas de equipe"),opt("Um erro de sistema"),opt("Uma reunião com clientes")]},
      {texto:"Presentes de fornecedores devem ser sempre recusados, independentemente do valor?", type:"vf", options:[opt("Verdadeiro"),opt("Falso — a política define limites de valor e situações permitidas",true)]},
      {texto:"Quem pode acionar o código de ética da empresa?", type:"unica", options:[opt("Somente gestores"),opt("Qualquer colaborador",true),opt("Somente o setor de Compliance"),opt("Somente fornecedores")]}
    ]
  }
];

let participants = [
  ...buildParticipants("c1", 34, 6),
  ...buildParticipants("c2", 28, 5),
  ...buildParticipants("c3", 22, 4),
];

let wonHistory = [
  {matricula:"100004", data:new Date(2025,7,21)},
  {matricula:"100017", data:new Date(2025,7,21)},
  {matricula:"100023", data:new Date(2025,7,21)},
  {matricula:"100028", data:new Date(2025,7,21)},
  {matricula:participants.find(p=>p.campaignId==="c1")?.matricula, data:new Date(2025,2,10)}
];

/* ======================= BANCO DE PERGUNTAS ======================= */
let questionBank = [
  {codigo:"BQ-001", categoria:"Segurança", tema:"Segurança da Informação", procedimento:"POL-SEG-01",
   texto:"Qual é a prática recomendada ao identificar um e-mail suspeito?", type:"unica",
   options:[opt("Clicar no link para verificar a origem"),opt("Reportar ao canal de segurança e não interagir com o e-mail",true),opt("Responder pedindo mais informações ao remetente"),opt("Encaminhar para colegas avaliarem")],
   autor:"Mariana Queiroz", dataCriacao:new Date(2026,4,20), ultimaUtilizacao:new Date(2026,5,15), qtdUtilizacoes:1, status:"ativa"},
  {codigo:"BQ-002", categoria:"Qualidade", tema:"ISO 9001", procedimento:"POL-QUA-04",
   texto:"O que é uma não conformidade?", type:"unica",
   options:[opt("Um elogio do cliente"),opt("Um desvio em relação a um requisito estabelecido",true),opt("Uma sugestão de melhoria qualquer"),opt("Um novo processo criado")],
   autor:"Mariana Queiroz", dataCriacao:new Date(2025,9,10), ultimaUtilizacao:new Date(2025,10,5), qtdUtilizacoes:2, status:"ativa"},
  {codigo:"BQ-003", categoria:"Ética", tema:"Compliance", procedimento:"COD-ETI-01",
   texto:"O que é conflito de interesses?", type:"unica",
   options:[opt("Quando interesses pessoais podem influenciar decisões profissionais",true),opt("Uma discordância entre colegas de equipe"),opt("Um erro de sistema"),opt("Uma reunião com clientes")],
   autor:"Mariana Queiroz", dataCriacao:new Date(2025,6,2), ultimaUtilizacao:new Date(2025,7,10), qtdUtilizacoes:1, status:"ativa"},
  {codigo:"BQ-004", categoria:"Segurança", tema:"Proteção de Dados", procedimento:"POL-SEG-02",
   texto:"O uso de pen drives pessoais em computadores corporativos é permitido sem autorização?", type:"vf",
   options:[opt("Verdadeiro"),opt("Falso",true)],
   autor:"Mariana Queiroz", dataCriacao:new Date(2024,2,1), ultimaUtilizacao:new Date(2024,2,20), qtdUtilizacoes:1, status:"ativa"}
];
function bqUsageStatus(q){
  if(!q.ultimaUtilizacao) return {label:"Nunca utilizada", cls:"nunca"};
  const twoYearsMs = 2*365*24*60*60*1000;
  const diff = new Date() - new Date(q.ultimaUtilizacao);
  if(diff < twoYearsMs){
    const months = Math.max(1, Math.round(diff/(30*24*60*60*1000)));
    return {label:`Usada há ${months} mês(es) — considere outra`, cls:"recente"};
  }
  return {label:"Livre para reutilização", cls:"livre"};
}

/* ======================= AUDITORIA (log de ações) ======================= */
let actionLog = [];
function logAction(acao, detalhe){
  actionLog.unshift({acao, detalhe: detalhe||"", usuario: currentUser ? currentUser.nome : "Sistema", data:new Date()});
  const sec = document.getElementById('sec-auditoria');
  if(sec && sec.classList.contains('active')) renderAuditoria();
  saveState();
}
function renderAuditoria(){
  const tbody = document.getElementById('tblAuditoria');
  if(!tbody) return;
  tbody.innerHTML = actionLog.map(a=>`<tr><td>${fmtDateTime(a.data)}</td><td>${a.usuario}</td><td>${a.acao}</td><td>${a.detalhe}</td></tr>`).join('') ||
    `<tr><td colspan="4" style="text-align:center; color:var(--ink-soft); padding:20px;">Nenhuma ação registrada ainda nesta sessão.</td></tr>`;
}

let currentUser = null;
let currentRole = "qualidade";
let historyLog = [];
let editingCampaignId = null;
let quizState = null;
let editingBQCodigo = null;

/* ======================= PERSISTÊNCIA (localStorage) =======================
   O app é só HTML/CSS/JS, sem servidor — então "banco de dados" aqui significa
   salvar automaticamente no navegador de quem está usando. Os dados sobrevivem
   a um recarregamento de página (F5) ou a fechar e reabrir a aba, permitindo
   acompanhar o processo ao longo do tempo. Isso é local a cada navegador/
   computador — não é compartilhado entre pessoas diferentes (para isso seria
   necessário um backend real). */
const STORAGE_KEY = "ppg_app_state_v1";

function dateReviver(key, value){
  if(typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) return new Date(value);
  return value;
}
function saveState(){
  try{
    const state = {
      campaigns, participants, wonHistory, questionBank, actionLog,
      currentUser, currentRole,
      darkMode: document.body.classList.contains('dark'),
      savedAt: new Date()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }catch(e){ console.warn("Não foi possível salvar os dados localmente:", e); }
}
function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return false;
    const state = JSON.parse(raw, dateReviver);
    if(state.campaigns) campaigns = state.campaigns;
    if(state.participants) participants = state.participants;
    if(state.wonHistory) wonHistory = state.wonHistory;
    if(state.questionBank) questionBank = state.questionBank;
    if(state.actionLog) actionLog = state.actionLog;
    currentUser = state.currentUser || null;
    currentRole = state.currentRole || "qualidade";
    if(state.darkMode) document.body.classList.add('dark');
    return true;
  }catch(e){ console.warn("Não foi possível carregar os dados salvos:", e); return false; }
}
function clearSavedState(){ try{ localStorage.removeItem(STORAGE_KEY); }catch(e){} }

/* ======================= ELEGIBILIDADE ======================= */
function isWithinTwoYears(matricula, refDate){
  const twoYearsMs = 2*365*24*60*60*1000;
  return wonHistory.some(w => w.matricula === matricula && (refDate - w.data) < twoYearsMs);
}
function evaluateEligibility(campaignId){
  const all = campaignParticipants(campaignId).filter(p=>p.pct===100);
  const eligible = [], excluded = [];
  const now = new Date();
  all.forEach(p=>{
    if(CARGOS_IMPEDIDOS.includes(p.cargo)) excluded.push({...p, motivo:`Cargo impedido (${p.cargo})`});
    else if(isWithinTwoYears(p.matricula, now)) excluded.push({...p, motivo:"Premiado(a) em campanha do PPG nos últimos 2 anos"});
    else eligible.push(p);
  });
  return {eligible, excluded};
}

/* ======================= ACESSO POR DATA ======================= */
function campaignAccessStatus(c){
  const now = new Date();
  const start = new Date(c.inicio), end = new Date(c.fim);
  if(now < start) return 'nao_iniciada';
  if(now > end) return 'encerrada';
  return 'aberta';
}

/* ======================= NAV ======================= */
const titles = {
  inicio:"Início", campanhas:"Rodadas", nova:"Nova Campanha", participantes:"Resultados",
  elegiveis:"Elegíveis", sorteio:"Sorteio", relatorios:"Relatórios", historico:"Histórico",
  banco:"Banco de Perguntas", auditoria:"Auditoria", config:"Configurações", responder:"Questionário",
  "campanha-atual":"Campanha Atual", "historico-colab":"Histórico", "meu-resultado":"Meu Resultado", regulamento:"Regulamento"
};

document.querySelectorAll('.menu-item').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const target = btn.dataset.target;
    document.querySelectorAll('.menu-item').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    goToSection(target);
  });
});
document.querySelectorAll('.menu-group-header').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    btn.closest('.menu-group').classList.toggle('expanded');
  });
});
function goToSection(target){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  const sec = document.getElementById('sec-'+target);
  if(sec) sec.classList.add('active');
  document.getElementById('pageTitle').textContent = titles[target] || target;
  closeSidebarMobile();
  if(target==="inicio") renderDashboard();
  if(target==="campanhas") renderCampaignGrid();
  if(target==="historico") renderTimeline();
  if(target==="participantes") renderParticipantsTable();
  if(target==="elegiveis") renderEligibleTable();
  if(target==="banco") renderBanco();
  if(target==="auditoria") renderAuditoria();
  if(target==="campanha-atual") renderCampanhaAtual();
  if(target==="historico-colab") renderHistoricoColaborador();
  if(target==="meu-resultado") renderMeuResultado();
  if(target==="regulamento") renderRegulamentoStats();
}

document.getElementById('hamburger').addEventListener('click', ()=>{
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('open');
});
document.getElementById('overlay').addEventListener('click', closeSidebarMobile);
function closeSidebarMobile(){ document.getElementById('sidebar').classList.remove('open'); document.getElementById('overlay').classList.remove('open'); }

const btnResetDemoData = document.getElementById('btnResetDemoData');
if(btnResetDemoData){
  btnResetDemoData.addEventListener('click', ()=>{
    if(confirm("Isso vai apagar todos os dados salvos neste navegador (campanhas, respostas, banco de perguntas) e voltar ao estado inicial de demonstração. Continuar?")){
      clearSavedState();
      window.location.reload();
    }
  });
}

/* Menu lateral recolhível (ícone-somente) */
const btnCollapseSidebar = document.getElementById('btnCollapseSidebar');
if(btnCollapseSidebar){
  btnCollapseSidebar.addEventListener('click', ()=>{
    document.getElementById('sidebar').classList.toggle('collapsed');
  });
}
// Em telas de tablet, começa recolhido automaticamente (mais espaço de conteúdo)
if(window.innerWidth <= 1180 && window.innerWidth > 880){
  document.getElementById('sidebar').classList.add('collapsed');
}

/* Link/QR de divulgação: ?campanha=ID leva direto ao questionário após o login */
const urlParams = new URLSearchParams(window.location.search);
const deepLinkCampaignId = urlParams.get('campanha');

/* ======================= LOGIN ======================= */
// Cada usuário de demonstração tem sua própria senha. O perfil do colaborador
// já nasce coerente com a hierarquia Setor → Função da EMPRESA_CONFIG.
const USERS = {
  // ---- Qualidade (administrador) ----
  "1000": { senha:"qualidade2026", nome:"Mariana Queiroz", role:"qualidade" },
  "1001": { senha:"qualidade2026", nome:"Fernando Ribeiro", role:"qualidade" },
  "1002": { senha:"qualidade2026", nome:"Juliana Prado", role:"qualidade" },

  // ---- Colaborador — perfis variados para amostragem/testes em diferentes telas ----
  "2000": { senha:"colab2026", nome:"Carlos Bento", role:"colaborador",
            setor:"Qualidade", filial:"Matriz", funcao:"Analista da Qualidade", cargo:"Analista da Qualidade" },
  "100110": { senha:"colab2026", nome:"Camila Ramos", role:"colaborador",
            setor:"Tecnologia da Informação", filial:"Filial Oeste", funcao:"Analista de TI", cargo:"Analista de TI" },
  "100028": { senha:"colab2026", nome:"Rodrigo Silva", role:"colaborador",
            setor:"Manutenção", filial:"Filial Norte", funcao:"Mecânico", cargo:"Mecânico" },
  "100171": { senha:"colab2026", nome:"Thiago Barbosa", role:"colaborador",
            setor:"Operações", filial:"Filial Norte", funcao:"Motorista Instrutor", cargo:"Motorista Instrutor" },
  "100004": { senha:"colab2026", nome:"Paulo Dias", role:"colaborador",
            setor:"Financeiro", filial:"Filial Sul", funcao:"Analista Financeiro", cargo:"Analista Financeiro" },
  "100023": { senha:"colab2026", nome:"Patrícia Dias", role:"colaborador",
            setor:"Recursos Humanos", filial:"Filial Oeste", funcao:"Assistente de RH", cargo:"Assistente de RH" }
};
document.getElementById('loginForm').addEventListener('submit', function(e){
  e.preventDefault();
  const mat = document.getElementById('loginMatricula').value.trim();
  const senha = document.getElementById('loginSenha').value;
  const errEl = document.getElementById('loginError');
  const user = USERS[mat];
  if(user && senha === user.senha){
    currentUser = {matricula: mat, nome:user.nome, role:user.role, setor:user.setor, filial:user.filial, funcao:user.funcao, cargo:user.cargo};
  } else { errEl.style.display = "block"; return; }
  errEl.style.display = "none";
  document.getElementById('loginScreen').style.display = "none";
  document.getElementById('appRoot').style.display = "flex";
  applyRole(currentUser.role);
  saveState();
  showToast(`Bem-vindo(a), ${currentUser.nome}.`, "success");
});
document.getElementById('btnLogout').addEventListener('click', ()=>{
  currentUser = null;
  saveState();
  document.getElementById('appRoot').style.display = "none";
  document.getElementById('loginScreen').style.display = "flex";
  document.getElementById('loginForm').reset();
});
function applyRole(role){
  currentRole = role;
  const isAdmin = role === "qualidade";
  document.body.classList.toggle('role-colaborador', !isAdmin);
  document.getElementById('userName').textContent = currentUser.nome;
  document.getElementById('userRole').textContent = isAdmin ? "Qualidade · Administrador" : `Colaborador · ${currentUser.funcao || ''}`;
  const initials = currentUser.nome.split(' ').filter(Boolean).slice(0,2).map(n=>n[0]).join('').toUpperCase();
  document.getElementById('avatarInit').textContent = initials;
  document.getElementById('configSubtitle').textContent = isAdmin ? "Preferências pessoais e parâmetros gerais do sistema." : "Preferências pessoais.";
  logAction(isAdmin ? "Login (Qualidade)" : "Login (Colaborador)", `${currentUser.nome} autenticado(a) no sistema.`);
  if(window.lucide) lucide.createIcons();
  const defaultTarget = isAdmin ? "inicio" : "campanha-atual";
  document.querySelectorAll('.menu-item').forEach(b=>b.classList.remove('active'));
  const btn = document.querySelector(`[data-target="${defaultTarget}"]`);
  if(btn) btn.classList.add('active');
  if(!isAdmin && deepLinkCampaignId && campaigns.find(c=>c.id===deepLinkCampaignId)){
    goToSection(defaultTarget);
    openQuiz(deepLinkCampaignId);
  } else {
    goToSection(defaultTarget);
  }
}

/* ======================= TEMA ======================= */
function setDarkMode(on){ document.body.classList.toggle('dark', on); document.getElementById('themeToggle').checked = on; saveState(); }
document.getElementById('themeToggle').addEventListener('change', (e)=> setDarkMode(e.target.checked));
document.getElementById('themeToggleTop').addEventListener('click', ()=> setDarkMode(!document.body.classList.contains('dark')));

/* ======================= TOAST ======================= */
function showToast(msg, type=""){
  const t = document.getElementById('toast');
  t.textContent = msg; t.className = "toast show " + type;
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(()=> t.className = "toast " + type, 2800);
}

/* ======================= HELPERS ======================= */
function statusBadge(status){
  const map = {programada:["programada","Programada"], andamento:["andamento","Em andamento"], encerrada:["encerrada","Encerrada"], finalizada:["finalizada","Finalizada"]};
  const [cls,label] = map[status];
  return `<span class="badge ${cls}">${label}</span>`;
}
function campaignParticipants(id){ return participants.filter(p=>p.campaignId===id); }
function fillCampaignSelects(){
  const selects = [document.getElementById('selectCampanhaParticipantes'), document.getElementById('selectCampanhaElegiveis'), document.getElementById('selectCampanhaSorteio'), document.getElementById('selectCampanhaRelatorio')];
  selects.forEach(sel=>{
    if(!sel) return;
    const prev = sel.value;
    sel.innerHTML = campaigns.map(c=>`<option value="${c.id}">${c.nome}</option>`).join('');
    if(prev) sel.value = prev;
  });
}

/* ======================= DASHBOARD (com drill-down) ======================= */
function renderDashboard(){
  renderQualidadeTip();
  document.getElementById('kpiTotalCampanhas').textContent = campaigns.length;
  document.getElementById('kpiAndamento').textContent = campaigns.filter(c=>c.status==="andamento").length;
  document.getElementById('kpiProgramadas').textContent = campaigns.filter(c=>c.status==="programada").length;
  const latest = campaigns[0];
  document.getElementById('kpiParticipantes').textContent = campaignParticipants(latest.id).length;
  document.getElementById('kpiElegiveis').textContent = evaluateEligibility(latest.id).eligible.length;
  const ganhadores = campaigns.filter(c=>c.ganhadores).reduce((a,c)=>a+c.ganhadores.length,0);
  document.getElementById('kpiGanhadores').textContent = ganhadores;

  const barsEl = document.getElementById('chartParticipacao');
  const maxCount = Math.max(...campaigns.map(c=>campaignParticipants(c.id).length), 1);
  barsEl.innerHTML = campaigns.map(c=>{
    const n = campaignParticipants(c.id).length;
    const h = Math.max(8, Math.round((n/maxCount)*130));
    const shortName = c.nome.split('–')[0].trim();
    return `<div class="bar-col"><div class="bar-value">${n}</div><div class="bar-shell"><div class="bar-fill" style="height:0px" data-h="${h}"></div></div><div class="bar-label">${shortName}</div></div>`;
  }).join('');
  requestAnimationFrame(()=> document.querySelectorAll('#chartParticipacao .bar-fill').forEach(el=> el.style.height = el.dataset.h + "px"));

  const ref = campaigns.find(c=>c.status==="encerrada") || campaigns[0];
  const refP = campaignParticipants(ref.id);
  const p100 = refP.filter(p=>p.pct===100).length, p90 = refP.filter(p=>p.pct===90).length, p80 = refP.filter(p=>p.pct===80).length;
  const pOther = refP.length - p100 - p90 - p80;
  const total = refP.length || 1;
  const seg = [{v:p100,c:"var(--success)",label:"100%"},{v:p90,c:"var(--primary)",label:"90%"},{v:p80,c:"var(--warning)",label:"80%"},{v:pOther,c:"var(--error)",label:"≤70%"}];
  let acc = 0;
  const stops = seg.map(s=>{const start=acc/total*360; acc+=s.v; const end=acc/total*360; return `${s.c} ${start}deg ${end}deg`;}).join(', ');
  document.getElementById('chartDonut').innerHTML = `
    <div style="width:130px;height:130px;border-radius:50%; background:conic-gradient(${stops}); display:flex; align-items:center; justify-content:center;">
      <div style="width:78px;height:78px;border-radius:50%; background:var(--card); display:flex; flex-direction:column; align-items:center; justify-content:center;">
        <div style="font-family:'Manrope'; font-weight:800; font-size:18px; color:var(--secondary);">${total}</div><div style="font-size:10px; color:var(--ink-soft);">respostas</div>
      </div></div>
    <div class="donut-legend">${seg.map(s=>`<div><span class="legend-dot" style="background:${s.c}"></span>${s.label} — ${s.v}</div>`).join('')}</div>`;

  const allWinners = campaigns.filter(c=>c.ganhadores).flatMap(c=>c.ganhadores);
  renderHBarChart('chartSetor', allWinners, 'setor', SETORES.filter(s=> allWinners.some(w=>w.setor===s)).length ? [...new Set(allWinners.map(w=>w.setor))] : SETORES.slice(0,8));
  renderHBarChart('chartFilial', allWinners, 'filial', UNIDADES);

  document.getElementById('tblUltimasCampanhas').innerHTML = campaigns.map(c=>{
    const n = campaignParticipants(c.id).length;
    return `<tr><td>${c.nome}</td><td>${c.inicio.replace('T',' ')} – ${c.fim.replace('T',' ')}</td><td>${n}</td><td>${statusBadge(c.status)}</td></tr>`;
  }).join('');
}
function renderHBarChart(elId, winners, field, universe){
  const counts = {}; universe.forEach(u=>counts[u]=0);
  winners.forEach(w=>{ counts[w[field]] = (counts[w[field]]||0) + 1; });
  const max = Math.max(...Object.values(counts), 1);
  const el = document.getElementById(elId);
  el.innerHTML = Object.entries(counts).map(([k,v],idx)=>{
    const rowId = elId + "_row" + idx;
    const names = winners.filter(w=>w[field]===k).map(w=>`${w.nome} · ${w.funcao||''}`);
    return `<div>
      <div class="hbar-row clickable" onclick="toggleHbarDetail('${rowId}')">
        <div class="hbar-label">${k}</div>
        <div class="hbar-track"><div class="hbar-fill" style="width:0%" data-w="${(v/max*100)}"></div></div>
        <div class="hbar-value">${v}</div>
      </div>
      <div class="hbar-detail" id="${rowId}">${names.length ? names.map(n=>`<span>${n}</span>`).join('') : 'Nenhum ganhador ainda neste grupo.'}</div>
    </div>`;
  }).join('');
  requestAnimationFrame(()=> el.querySelectorAll('.hbar-fill').forEach(f=> f.style.width = f.dataset.w + "%"));
}
window.toggleHbarDetail = function(id){ document.getElementById(id).classList.toggle('open'); };

/* Drill-down dos KPIs do dashboard */
window.goToRodadas = function(){ document.querySelector('[data-target="campanhas"]').click(); };
window.goToResultadosLatest = function(){ goToParticipants(campaigns[0].id); };
window.goToElegiveisLatest = function(){
  document.querySelector('[data-target="elegiveis"]').click();
  document.getElementById('selectCampanhaElegiveis').value = campaigns[0].id;
  renderEligibleTable();
};
window.goToHistoricoAdmin = function(){ document.querySelector('[data-target="historico"]').click(); };

/* ======================= CAMPANHAS / RODADAS (Qualidade) ======================= */
function renderCampaignGrid(){
  document.getElementById('campaignGrid').innerHTML = campaigns.map(c=>{
    const n = campaignParticipants(c.id).length;
    const {eligible} = evaluateEligibility(c.id);
    return `<div class="ccard">
      <div style="display:flex; justify-content:space-between; align-items:flex-start;"><h4>${c.nome}</h4>${statusBadge(c.status)}</div>
      <div class="desc">${c.descricao}</div>
      <div class="meta">
        <span>📅 ${c.inicio.replace('T',' ')} → ${c.fim.replace('T',' ')}</span>
        <span>📝 ${c.questoes ? c.questoes.length : '—'} perguntas · 🏆 ${c.qtdGanhadores} ganhadores</span>
        <span>👥 ${n} participantes · ✅ ${eligible.length} elegíveis</span>
      </div>
      <div class="actions">
        <button class="btn btn-ghost btn-sm" onclick="goToParticipants('${c.id}')">Ver participantes</button>
        <button class="btn btn-outline btn-sm" onclick="loadCampaignForEdit('${c.id}')">Editar</button>
        <button class="btn btn-outline btn-sm" onclick="openShareModal('${c.id}')">🔗 Compartilhar</button>
      </div>
    </div>`;
  }).join('') || `<p style="color:var(--ink-soft); font-size:13px;">Nenhuma campanha cadastrada.</p>`;
}
window.goToParticipants = function(id){
  document.querySelectorAll('.menu-item').forEach(b=>b.classList.remove('active'));
  const btn = document.querySelector('[data-target="participantes"]'); if(btn) btn.classList.add('active');
  goToSection('participantes');
  document.getElementById('selectCampanhaParticipantes').value = id;
  renderParticipantsTable();
};

/* ======================= PARTICIPANTES / RESULTADOS ======================= */
function renderParticipantsTable(){
  const sel = document.getElementById('selectCampanhaParticipantes');
  const id = sel.value;
  const list = campaignParticipants(id).sort((a,b)=>b.pct-a.pct);
  document.getElementById('tblParticipantes').innerHTML = list.map(p=>`
    <tr><td>${p.nome}</td><td>${p.matricula}</td><td>${p.cargo}</td><td>${p.setor}</td><td>${p.filial}</td><td>${fmtDateTime(p.data)}</td><td><span class="${p.pct===100?'pct100':'pctless'}">${p.pct}%</span></td></tr>`).join('') ||
    `<tr><td colspan="7" style="text-align:center; color:var(--ink-soft); padding:20px;">Nenhum participante ainda.</td></tr>`;
  const media = list.length ? Math.round(list.reduce((a,p)=>a+p.pct,0)/list.length) : 0;
  const {eligible} = evaluateEligibility(id);
  document.getElementById('participantesStats').innerHTML = `
    <div class="stat"><b>${list.length}</b><span>Total de participantes</span></div>
    <div class="stat"><b>${eligible.length}</b><span>Total de elegíveis</span></div>
    <div class="stat"><b>${media}%</b><span>Média geral de acertos</span></div>`;

  const c = campaigns.find(x=>x.id===id);
  const qs = (c && c.questoes) || [];
  const stats = qs.map((q,idx)=>{
    const answered = list.filter(p=>p.respostasCorretas);
    const withData = answered.length ? answered : null;
    let pctCorrect;
    if(withData){
      pctCorrect = Math.round(withData.filter(p=>p.respostasCorretas[idx]).length / withData.length * 100);
    } else {
      pctCorrect = q._mockAcerto !== undefined ? q._mockAcerto : (55 + Math.floor(Math.random()*35));
      q._mockAcerto = pctCorrect;
    }
    return {texto:q.texto, pct:pctCorrect};
  });
  const asc = [...stats].sort((a,b)=>a.pct-b.pct), desc = [...stats].sort((a,b)=>b.pct-a.pct);
  document.getElementById('questoesErro').innerHTML = asc.slice(0,3).map(s=>`<div class="hbar-row"><div class="hbar-label" style="width:auto; flex:1; white-space:normal;">${s.texto}</div><div class="hbar-value" style="color:var(--error); width:40px;">${s.pct}%</div></div>`).join('') || '<p class="hint">Sem dados.</p>';
  document.getElementById('questoesAcerto').innerHTML = desc.slice(0,3).map(s=>`<div class="hbar-row"><div class="hbar-label" style="width:auto; flex:1; white-space:normal;">${s.texto}</div><div class="hbar-value" style="color:var(--success); width:40px;">${s.pct}%</div></div>`).join('') || '<p class="hint">Sem dados.</p>';
}
document.getElementById('selectCampanhaParticipantes').addEventListener('change', renderParticipantsTable);

/* ======================= ELEGÍVEIS ======================= */
function renderEligibleTable(){
  const id = document.getElementById('selectCampanhaElegiveis').value;
  const {eligible, excluded} = evaluateEligibility(id);
  document.getElementById('tblElegiveis').innerHTML = eligible.map((p,i)=>`<tr><td>${i+1}</td><td>${p.nome}</td><td>${p.matricula}</td><td>${p.cargo}</td><td>${p.setor}</td><td>${p.filial}</td><td>${fmtDateTime(p.data)}</td></tr>`).join('') ||
    `<tr><td colspan="7" style="text-align:center; color:var(--ink-soft); padding:20px;">Nenhum colaborador elegível nesta campanha.</td></tr>`;
  document.getElementById('tblExcluidos').innerHTML = excluded.map(p=>`<tr><td>${p.nome}</td><td>${p.matricula}</td><td>${p.cargo}</td><td>${p.setor}</td><td><span class="badge excluido">${p.motivo}</span></td></tr>`).join('') ||
    `<tr><td colspan="5" style="text-align:center; color:var(--ink-soft); padding:20px;">Nenhuma exclusão automática nesta campanha.</td></tr>`;
}
document.getElementById('selectCampanhaElegiveis').addEventListener('change', renderEligibleTable);

/* ======================= COMPARTILHAMENTO (LINK + QR CODE) ======================= */
window.openShareModal = function(campaignId){
  const c = campaigns.find(x=>x.id===campaignId);
  if(!c) return;
  const link = `${window.location.origin}${window.location.pathname}?campanha=${campaignId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link)}`;
  const backdrop = document.createElement('div');
  backdrop.className = "share-backdrop";
  backdrop.id = "shareBackdrop";
  backdrop.innerHTML = `
    <div class="share-card">
      <h3>Divulgar campanha</h3>
      <p>${c.nome}</p>
      <div class="share-qr"><img src="${qrUrl}" alt="QR Code de acesso à campanha" onerror="this.parentElement.innerHTML='<span style=\\'font-size:11px;color:var(--ink-soft);padding:12px;\\'>QR indisponível sem conexão à internet</span>'"></div>
      <div class="share-link-box">
        <input type="text" id="shareLinkInput" value="${link}" readonly>
        <button class="btn btn-primary btn-sm" id="btnCopyShareLink">Copiar</button>
      </div>
      <p class="hint" style="margin-bottom:16px;">Compartilhe este link ou o QR Code por e-mail, WhatsApp ou impresso — ao abrir, o colaborador faz login e já cai direto no questionário.</p>
      <div class="share-actions"><button class="btn btn-outline" id="btnCloseShare">Fechar</button></div>
    </div>`;
  document.body.appendChild(backdrop);
  backdrop.addEventListener('click', (e)=>{ if(e.target === backdrop) closeShareModal(); });
  document.getElementById('btnCloseShare').addEventListener('click', closeShareModal);
  document.getElementById('btnCopyShareLink').addEventListener('click', ()=>{
    const input = document.getElementById('shareLinkInput');
    input.select();
    navigator.clipboard && navigator.clipboard.writeText(input.value).then(()=>{
      showToast("Link copiado para a área de transferência.","success");
    }).catch(()=>{
      document.execCommand('copy');
      showToast("Link copiado.","success");
    });
  });
  logAction("Campanha divulgada", `Link/QR gerado para ${c.nome}`);
};
window.closeShareModal = function(){
  const el = document.getElementById('shareBackdrop');
  if(el) el.remove();
};


let questionCounter = 0;
function createQuestionCard(qData){
  questionCounter++;
  const qid = "q" + questionCounter;
  const wrap = document.createElement('div');
  wrap.className = "qcard"; wrap.id = qid;
  const type = (qData && qData.type) || "unica";
  const texto = (qData && qData.texto) || "";
  const options = (qData && qData.options) || [{text:"",correct:false},{text:"",correct:false},{text:"",correct:false},{text:"",correct:false}];
  wrap.innerHTML = `
    <div class="qcard-head"><b>Pergunta</b><button type="button" class="remove-q" onclick="document.getElementById('${qid}').remove()">Remover</button></div>
    <div class="form-grid">
      <div class="field full"><label>Enunciado</label><input type="text" class="q-text" placeholder="Digite a pergunta" value="${texto.replace(/"/g,'&quot;')}"></div>
      <div class="field"><label>Tipo de pergunta</label>
        <select class="q-type" onchange="toggleQuestionType('${qid}', this.value)">
          <option value="unica" ${type==='unica'?'selected':''}>Resposta única</option>
          <option value="multipla" ${type==='multipla'?'selected':''}>Múltipla escolha</option>
          <option value="multiplas_respostas" ${type==='multiplas_respostas'?'selected':''}>Resposta múltipla</option>
          <option value="vf" ${type==='vf'?'selected':''}>Verdadeiro ou falso</option>
        </select>
      </div>
      <div class="field"><label>Anexo / imagem (opcional)</label><input type="file" accept="image/*" class="q-file"></div>
      <div class="field full q-options-wrap">
        <label>Alternativas — marque a(s) correta(s)</label>
        <div class="opt-hint">O sistema usa a marcação abaixo como gabarito oficial para corrigir automaticamente.</div>
        <div class="q-options"></div>
      </div>
    </div>`;
  document.getElementById('questionList').appendChild(wrap);
  renderOptionsFor(qid, type, options);
}
function renderOptionsFor(qid, type, options){
  const card = document.getElementById(qid);
  const opts = card.querySelector('.q-options');
  if(type === 'vf'){
    const vTrue = options[0] ? options[0].correct : true;
    opts.innerHTML = `
      <div class="opt-row"><input type="radio" name="${qid}-vf" class="q-correct-vf" value="0" ${vTrue?'checked':''}><span style="font-size:13px;">Verdadeiro</span></div>
      <div class="opt-row"><input type="radio" name="${qid}-vf" class="q-correct-vf" value="1" ${!vTrue?'checked':''}><span style="font-size:13px;">Falso</span></div>`;
  } else {
    const inputType = type === 'multiplas_respostas' ? 'checkbox' : 'radio';
    const nameAttr = inputType === 'radio' ? `name="${qid}-radio"` : "";
    opts.innerHTML = options.map((o,i)=>`
      <div class="opt-row"><input type="${inputType}" ${nameAttr} class="q-correct" ${o.correct?'checked':''}><input type="text" class="q-opt-text" placeholder="Alternativa ${i+1}" value="${(o.text||"").replace(/"/g,'&quot;')}"></div>`).join('');
  }
}
window.toggleQuestionType = function(qid, type){
  const blankOpts = type==='vf' ? [{text:"Verdadeiro",correct:true},{text:"Falso",correct:false}] : [{text:"",correct:false},{text:"",correct:false},{text:"",correct:false},{text:"",correct:false}];
  renderOptionsFor(qid, type, blankOpts);
};
document.getElementById('btnAddQuestion').addEventListener('click', ()=> createQuestionCard());
document.getElementById('btnResetForm').addEventListener('click', ()=>{
  document.getElementById('formCampanha').reset();
  document.getElementById('questionList').innerHTML = ""; questionCounter = 0;
  createQuestionCard(); createQuestionCard();
});
createQuestionCard(); createQuestionCard();

function collectQuestionsFromForm(){
  const qCards = document.querySelectorAll('#questionList .qcard');
  return Array.from(qCards).map(card=>{
    const texto = card.querySelector('.q-text').value || "Pergunta sem enunciado";
    const typeSel = card.querySelector('.q-type').value;
    let options;
    if(typeSel === 'vf'){
      const checked = card.querySelector('.q-correct-vf:checked');
      const isTrue = checked ? checked.value === "0" : true;
      options = [opt("Verdadeiro", isTrue), opt("Falso", !isTrue)];
    } else {
      const rows = card.querySelectorAll('.q-options .opt-row');
      options = Array.from(rows).map(r=>{
        const txt = r.querySelector('.q-opt-text').value || "";
        const chk = r.querySelector('.q-correct').checked;
        return opt(txt, chk);
      }).filter(o=>o.text.trim() !== "");
    }
    return {texto, type: typeSel, options};
  });
}

/* Reaproveitar pergunta do Banco de Perguntas dentro de Nova Campanha,
   com alerta de reutilização (controle de repetição — regra 14) */
function fillBQPicker(){
  const sel = document.getElementById('bqPickerSelect');
  if(!sel) return;
  sel.innerHTML = questionBank.filter(q=>q.status==='ativa').map(q=>`<option value="${q.codigo}">${q.codigo} — ${q.texto.slice(0,55)}</option>`).join('');
}
const btnInserirDoBanco = document.getElementById('btnInserirDoBanco');
if(btnInserirDoBanco){
  btnInserirDoBanco.addEventListener('click', ()=>{
    const sel = document.getElementById('bqPickerSelect');
    const q = questionBank.find(x=>x.codigo===sel.value);
    if(!q) return;
    const u = bqUsageStatus(q);
    if(u.cls === 'recente'){
      showToast(`Atenção: esta pergunta foi ${u.label.toLowerCase()}. Você pode reutilizá-la mesmo assim, se necessário.`, "warning");
    } else {
      showToast("Pergunta inserida no questionário.","success");
    }
    createQuestionCard({texto:q.texto, type:q.type, options:q.options});
    q.qtdUtilizacoes++; q.ultimaUtilizacao = new Date();
    renderBanco();
    logAction("Reutilização de pergunta do banco", `${q.codigo} inserida em nova campanha`);
  });
}

/* ======================= NOVA CAMPANHA — SUBMIT (criar ou editar) ======================= */
document.getElementById('formCampanha').addEventListener('submit', function(e){
  e.preventDefault();
  const f = new FormData(this);
  const questoes = collectQuestionsFromForm();
  const payload = {
    nome: f.get('nome') || "Nova campanha PPG",
    descricao: f.get('descricao') || "",
    objetivo: f.get('objetivo') || "",
    inicio: f.get('inicio'),
    fim: f.get('fim'),
    qtdGanhadores: Number(f.get('qtdGanhadores')) || 4,
    premio: f.get('premio') || "",
    criterios: f.get('criterios') || "Nenhum critério adicional definido.",
    status: f.get('status') || "programada",
    questoes: questoes.length ? questoes : [{texto:"Pergunta de exemplo", type:"unica", options:[opt("Sim",true),opt("Não")]}]
  };

  if(editingCampaignId){
    const idx = campaigns.findIndex(c=>c.id===editingCampaignId);
    if(idx > -1) campaigns[idx] = {...campaigns[idx], ...payload};
    showToast("Campanha atualizada com sucesso!","success");
    logAction("Campanha editada", payload.nome);
    editingCampaignId = null;
    document.getElementById('btnSubmitCampanha').textContent = "Cadastrar campanha";
    document.getElementById('btnCancelEdit').style.display = "none";
    document.getElementById('novaTitle').textContent = "Nova Campanha";
  } else {
    const id = "c" + (campaigns.length + 1) + "_" + Date.now().toString().slice(-4);
    campaigns.unshift({id, ganhadores:null, ...payload});
    showToast("Campanha e questionário cadastrados com sucesso!","success");
    logAction("Nova campanha cadastrada", payload.nome);
  }
  fillCampaignSelects();
  renderCampaignGrid();
  this.reset();
  document.getElementById('questionList').innerHTML = ""; questionCounter = 0;
  createQuestionCard(); createQuestionCard();
  document.querySelector('[data-target="campanhas"]').click();
});

window.loadCampaignForEdit = function(id){
  const c = campaigns.find(x=>x.id===id);
  if(!c) return;
  editingCampaignId = id;
  const form = document.getElementById('formCampanha');
  form.nome.value = c.nome; form.descricao.value = c.descricao || ""; form.objetivo.value = c.objetivo || "";
  form.inicio.value = c.inicio; form.fim.value = c.fim;
  form.qtdGanhadores.value = c.qtdGanhadores; form.status.value = c.status;
  form.premio.value = c.premio || ""; form.criterios.value = c.criterios || "";
  document.getElementById('questionList').innerHTML = ""; questionCounter = 0;
  (c.questoes||[]).forEach(q=> createQuestionCard(q));
  document.getElementById('btnSubmitCampanha').textContent = "Salvar alterações";
  document.getElementById('btnCancelEdit').style.display = "inline-flex";
  document.getElementById('novaTitle').textContent = "Editar Campanha";
  document.querySelector('[data-target="nova"]').click();
  showToast("Editando campanha — altere os campos e clique em Salvar alterações.","");
};
document.getElementById('btnCancelEdit').addEventListener('click', ()=>{
  editingCampaignId = null;
  document.getElementById('formCampanha').reset();
  document.getElementById('questionList').innerHTML = ""; questionCounter = 0;
  createQuestionCard(); createQuestionCard();
  document.getElementById('btnSubmitCampanha').textContent = "Cadastrar campanha";
  document.getElementById('btnCancelEdit').style.display = "none";
  document.getElementById('novaTitle').textContent = "Nova Campanha";
});

/* ======================= BANCO DE PERGUNTAS (Qualidade) ======================= */
function renderBanco(){
  const tbody = document.getElementById('bqTableBody');
  if(!tbody) return;
  tbody.innerHTML = questionBank.map(q=>{
    const u = bqUsageStatus(q);
    return `<tr>
      <td>${q.codigo}</td><td>${q.categoria}</td><td>${q.tema}</td><td>${q.procedimento||'—'}</td>
      <td>${q.qtdUtilizacoes}x</td>
      <td><span class="bq-badge ${u.cls}">${u.label}</span></td>
      <td><span class="badge ${q.status==='ativa'?'finalizada':'excluido'}">${q.status==='ativa'?'Ativa':'Inativa'}</span></td>
      <td style="display:flex; gap:6px;">
        <button class="btn btn-outline btn-sm" onclick="editBQ('${q.codigo}')">Editar</button>
        <button class="btn btn-outline btn-sm" onclick="deleteBQ('${q.codigo}')">Excluir</button>
      </td>
    </tr>`;
  }).join('') || `<tr><td colspan="8" style="text-align:center; color:var(--ink-soft); padding:20px;">Nenhuma pergunta cadastrada no banco.</td></tr>`;
  fillBQPicker();
}
function bqRenderOptions(type, options){
  const wrap = document.getElementById('bqOptionsWrap');
  if(!wrap) return;
  options = options || (type==='vf' ? [{text:"Verdadeiro",correct:true},{text:"Falso",correct:false}] : [{text:"",correct:false},{text:"",correct:false},{text:"",correct:false},{text:"",correct:false}]);
  if(type==='vf'){
    wrap.innerHTML = `
      <div class="opt-row"><input type="radio" name="bq-vf" class="bq-correct-vf" value="0" ${options[0] && options[0].correct?'checked':''}><span style="font-size:13px;">Verdadeiro</span></div>
      <div class="opt-row"><input type="radio" name="bq-vf" class="bq-correct-vf" value="1" ${!(options[0] && options[0].correct)?'checked':''}><span style="font-size:13px;">Falso</span></div>`;
  } else {
    const inputType = type==='multiplas_respostas' ? 'checkbox' : 'radio';
    const nameAttr = inputType==='radio' ? 'name="bq-radio"' : '';
    wrap.innerHTML = options.map((o,i)=>`<div class="opt-row"><input type="${inputType}" ${nameAttr} class="bq-correct" ${o.correct?'checked':''}><input type="text" class="bq-opt-text" placeholder="Alternativa ${i+1}" value="${(o.text||'').replace(/"/g,'&quot;')}"></div>`).join('');
  }
}
window.renderBQOptionInputs = function(type){ bqRenderOptions(type, null); };
function collectBQOptions(){
  const type = document.getElementById('bqTipo').value;
  if(type==='vf'){
    const checked = document.querySelector('.bq-correct-vf:checked');
    const isTrue = checked ? checked.value==="0" : true;
    return [opt("Verdadeiro", isTrue), opt("Falso", !isTrue)];
  }
  const rows = document.querySelectorAll('#bqOptionsWrap .opt-row');
  return Array.from(rows).map(r=>opt(r.querySelector('.bq-opt-text').value||"", r.querySelector('.bq-correct').checked)).filter(o=>o.text.trim()!=="");
}
const bqForm = document.getElementById('bqForm');
if(bqForm){
  bqRenderOptions('unica', null);
  bqForm.addEventListener('submit', function(e){
    e.preventDefault();
    const options = collectBQOptions();
    const payload = {
      categoria: document.getElementById('bqCategoria').value || "Geral",
      tema: document.getElementById('bqTema').value || "",
      procedimento: document.getElementById('bqProcedimento').value || "",
      texto: document.getElementById('bqTexto').value || "Pergunta sem enunciado",
      type: document.getElementById('bqTipo').value,
      options: options.length ? options : [opt("Sim",true),opt("Não")],
      status: document.getElementById('bqStatus').value
    };
    if(editingBQCodigo){
      const idx = questionBank.findIndex(q=>q.codigo===editingBQCodigo);
      if(idx>-1) questionBank[idx] = {...questionBank[idx], ...payload};
      logAction("Edição de pergunta", `${editingBQCodigo} — ${payload.texto.slice(0,40)}`);
      showToast("Pergunta atualizada.","success");
    } else {
      const codigo = "BQ-" + String(questionBank.length+1).padStart(3,'0');
      questionBank.push({codigo, autor: currentUser.nome, dataCriacao:new Date(), ultimaUtilizacao:null, qtdUtilizacoes:0, ...payload});
      logAction("Nova pergunta cadastrada", `${codigo} — ${payload.texto.slice(0,40)}`);
      showToast("Pergunta cadastrada no banco.","success");
    }
    editingBQCodigo = null;
    this.reset();
    document.getElementById('bqCodigo').value = "";
    bqRenderOptions('unica', null);
    renderBanco();
  });
  document.getElementById('btnResetBQ').addEventListener('click', ()=>{
    editingBQCodigo = null;
    bqForm.reset();
    document.getElementById('bqCodigo').value = "";
    bqRenderOptions('unica', null);
  });
  document.getElementById('bqImportFile').addEventListener('change', function(e){
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(evt){
      try{
        const data = new Uint8Array(evt.target.result);
        const wb = XLSX.read(data, {type:'array'});
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, {defval:""});
        let count = 0;
        rows.forEach(r=>{
          const opts = [1,2,3,4].map(i=>r['opcao'+i]).filter(v=>v!=="").map((t,i)=>opt(String(t), String(r.correta||"").split(',').map(s=>s.trim()).includes(String(i+1))));
          questionBank.push({
            codigo: r.codigo ? String(r.codigo) : ("BQ-"+String(questionBank.length+1).padStart(3,'0')),
            categoria: r.categoria || "Importada", tema: r.tema || "", procedimento: r.procedimento || "",
            texto: r.texto || r.pergunta || "Pergunta importada",
            type: r.tipo || "unica", options: opts.length ? opts : [opt("Sim",true),opt("Não")],
            autor: currentUser.nome, dataCriacao:new Date(), ultimaUtilizacao:null, qtdUtilizacoes:0, status:"ativa"
          });
          count++;
        });
        renderBanco();
        logAction("Importação de perguntas", `${count} pergunta(s) via ${file.name}`);
        showToast(`${count} pergunta(s) importada(s) com sucesso.`,"success");
      }catch(err){
        showToast("Não foi possível importar o arquivo. Verifique se é .xlsx ou .csv com as colunas esperadas.","warning");
      }
      e.target.value = "";
    };
    reader.readAsArrayBuffer(file);
  });
}
window.editBQ = function(codigo){
  const q = questionBank.find(x=>x.codigo===codigo);
  if(!q) return;
  editingBQCodigo = codigo;
  document.getElementById('bqCodigo').value = q.codigo;
  document.getElementById('bqCategoria').value = q.categoria;
  document.getElementById('bqTema').value = q.tema;
  document.getElementById('bqProcedimento').value = q.procedimento || "";
  document.getElementById('bqTexto').value = q.texto;
  document.getElementById('bqTipo').value = q.type;
  document.getElementById('bqStatus').value = q.status;
  bqRenderOptions(q.type, q.options);
  document.getElementById('bqForm').scrollIntoView({behavior:'smooth', block:'start'});
};
window.deleteBQ = function(codigo){
  questionBank = questionBank.filter(q=>q.codigo!==codigo);
  logAction("Exclusão de pergunta", codigo);
  renderBanco();
  showToast("Pergunta removida do banco.","");
};

/* ======================= RESPONDER QUESTIONÁRIO — ESTILO DUOLINGO ======================= */
window.openQuiz = function(campaignId){
  const c = campaigns.find(x=>x.id===campaignId);
  const existing = participants.find(p=>p.campaignId===campaignId && p.matricula===currentUser.matricula);
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.getElementById('sec-responder').classList.add('active');
  document.getElementById('pageTitle').textContent = "Questionário";
  document.getElementById('responderTitle').textContent = c.nome;
  document.getElementById('responderSubtitle').textContent = existing ? "" : c.descricao;
  if(existing){
    renderQuizDoneInto(document.getElementById('responderBody'), c, existing);
  } else {
    startQuizFlow(c);
  }
};
document.getElementById('btnVoltarCampanhas').addEventListener('click', ()=>{
  const target = currentRole === 'qualidade' ? 'campanhas' : 'campanha-atual';
  document.querySelectorAll('.menu-item').forEach(b=>b.classList.remove('active'));
  const btn = document.querySelector(`[data-target="${target}"]`); if(btn) btn.classList.add('active');
  goToSection(target);
});

function startQuizFlow(c){
  const access = campaignAccessStatus(c);
  const body = document.getElementById('responderBody');
  if(access !== 'aberta'){
    body.innerHTML = mascotBubble(access==='nao_iniciada' ? "Ainda não é hoje! Essa campanha abre em breve." : "Essa campanha já encerrou — mas fica de olho na próxima!") +
      `<div class="lock-banner">
      <div style="font-size:26px;">⏳</div>
      <div>${access==='nao_iniciada' ? 'Esta campanha ainda não está aberta para respostas.' : 'O prazo para responder esta campanha já foi encerrado.'}</div>
      <div class="hint">Período: ${c.inicio.replace('T',' ')} até ${c.fim.replace('T',' ')}</div>
    </div>`;
    return;
  }
  // Limite de participação: 1 resposta por matrícula (regra 12)
  const already = participants.find(p=>p.campaignId===c.id && p.matricula===currentUser.matricula);
  if(already){
    showToast("Sua participação nesta campanha já foi registrada.", "warning");
    renderQuizDoneInto(body, c, already);
    return;
  }
  quizState = {campaign:c, index:0, answers:new Array(c.questoes.length).fill(null)};
  renderQuizStep();
}

function renderQuizStep(){
  const {campaign, index, answers} = quizState;
  const q = campaign.questoes[index];
  const total = campaign.questoes.length;
  const progressPct = Math.round((index / total) * 100);
  const body = document.getElementById('responderBody');
  const selected = answers[index];
  body.innerHTML = `
    <div class="duo-wrap">
      <div class="duo-progress"><div class="duo-progress-fill" style="width:${progressPct}%"></div></div>
      <div class="duo-counter">Pergunta ${index+1} de ${total}</div>
      <div class="duo-card" id="duoCard">
        <div class="duo-question">${q.texto}</div>
        <div class="duo-options">
          ${q.options.map((o,oi)=>{
            const isSel = Array.isArray(selected) ? selected.includes(oi) : selected === oi;
            return `<button type="button" class="duo-option ${isSel?'selected':''}" data-oi="${oi}">${o.text}</button>`;
          }).join('')}
        </div>
      </div>
      <div class="duo-nav">
        <button class="btn btn-outline" id="duoBack" ${index===0?'disabled':''}>← Voltar</button>
        <button class="btn btn-primary" id="duoContinue">${index===total-1?'Finalizar':'Continuar'}</button>
      </div>
      <p class="hint" style="text-align:center; margin-top:14px;">Você poderá enviar apenas uma resposta para esta campanha, vinculada à sua matrícula.</p>
    </div>`;

  body.querySelectorAll('.duo-option').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const oi = Number(btn.dataset.oi);
      if(q.type === 'multiplas_respostas'){
        let arr = Array.isArray(answers[index]) ? [...answers[index]] : [];
        if(arr.includes(oi)) arr = arr.filter(x=>x!==oi); else arr.push(oi);
        answers[index] = arr;
      } else {
        answers[index] = oi;
      }
      renderQuizStep();
    });
  });
  document.getElementById('duoBack').addEventListener('click', ()=>{
    quizState.index = Math.max(0, index-1);
    renderQuizStep();
  });
  const contBtn = document.getElementById('duoContinue');
  const hasAnswer = Array.isArray(selected) ? selected.length>0 : (selected !== null && selected !== undefined);
  contBtn.disabled = !hasAnswer;
  contBtn.addEventListener('click', ()=>{
    if(index < total-1){ quizState.index++; renderQuizStep(); }
    else { finalizeQuiz(); }
  });
}

function isCorrect(q, ans){
  if(q.type === 'multiplas_respostas'){
    const correctSet = new Set(q.options.map((o,i)=>o.correct?i:null).filter(x=>x!==null));
    const ansSet = new Set(ans||[]);
    if(correctSet.size !== ansSet.size) return false;
    for(const i of correctSet) if(!ansSet.has(i)) return false;
    return true;
  }
  if(ans===undefined || ans===null) return false;
  return !!(q.options[ans] && q.options[ans].correct);
}

function finalizeQuiz(){
  const {campaign, answers} = quizState;
  const respostasCorretas = campaign.questoes.map((q,i)=> isCorrect(q, answers[i]));
  const correctCount = respostasCorretas.filter(Boolean).length;
  const pct = Math.round(correctCount / campaign.questoes.length * 100);
  const novoParticipante = {
    campaignId: campaign.id, nome: currentUser.nome, matricula: currentUser.matricula,
    setor: currentUser.setor, filial: currentUser.filial, funcao: currentUser.funcao, cargo: currentUser.cargo,
    data: new Date(), pct, respostasCorretas
  };
  participants.push(novoParticipante);
  fillCampaignSelects();
  renderDashboard(); renderParticipantsTable(); renderEligibleTable(); renderSorteioSetup();
  renderQuizDoneInto(document.getElementById('responderBody'), campaign, novoParticipante);
  saveState();
  quizState = null;
}

/* Univaldo, o mascote oficial da Univale Transportes.
   modo "pro" = versão discreta/profissional, usada no painel da Qualidade. */
const MASCOT_IMG = "assets/mascote-feliz.png";
const MASCOT_BLINK_IMG = "assets/mascote-piscando.png";
const MASCOT_NOME = "Univaldo";
function mascotBubble(texto, opts){
  const pro = opts && opts.pro;
  const img = (opts && opts.img) || MASCOT_IMG;
  return `<div class="mascot-row ${pro ? 'mascot-pro' : ''}">
    <div class="mascot-avatar">
      <img class="m-base" src="${img}" alt="Univaldo">
      <img class="m-blink" src="${MASCOT_BLINK_IMG}" alt="">
    </div>
    <div class="mascot-speech"><span class="mascot-name">${MASCOT_NOME}</span>${texto}</div>
  </div>`;
}
function renderQualidadeTip(){
  const el = document.getElementById('qualidadeTip');
  if(!el) return;
  const dicas = [];
  const encerrandoEm3Dias = campaigns.filter(c=>{
    if(c.status !== 'andamento') return false;
    const dias = (new Date(c.fim) - new Date()) / (1000*60*60*24);
    return dias > 0 && dias <= 3;
  });
  const finalizadasSemSorteio = campaigns.filter(c=>c.status==='encerrada' && !c.ganhadores);
  const total100 = campaigns.reduce((a,c)=> a + evaluateEligibility(c.id).eligible.length, 0);

  if(finalizadasSemSorteio.length){
    dicas.push(`${finalizadasSemSorteio.length} campanha(s) encerrada(s) já podem ter o sorteio executado — dá uma olhada em "Sorteio".`);
  }
  if(encerrandoEm3Dias.length){
    dicas.push(`${encerrandoEm3Dias.length} campanha(s) encerram nos próximos 3 dias — bom momento para divulgar de novo o link.`);
  }
  dicas.push(`Hoje há ${total100} colaborador(es) com 100% de acertos somando todas as campanhas.`);

  el.innerHTML = mascotBubble(dicas[0], {pro:true});
}

function confettiHTML(){
  const emojis = ["🎉","🎊","⭐","✨","🏆"];
  let spans = "";
  for(let i=0;i<14;i++){
    const left = Math.round(Math.random()*100);
    const delay = (Math.random()*0.6).toFixed(2);
    const size = 14 + Math.round(Math.random()*10);
    spans += `<span style="left:${left}%; animation-delay:${delay}s; font-size:${size}px;">${randomFrom(emojis)}</span>`;
  }
  return `<div class="duo-confetti">${spans}</div>`;
}

/* Tela final — exatamente o que o colaborador deve ver, nada de gabarito ou
   detalhamento de acertos/erros por pergunta (isso fica exclusivo da Qualidade). */
function renderQuizDoneInto(container, c, participant){
  const correctCount = participant.respostasCorretas ? participant.respostasCorretas.filter(Boolean).length : Math.round(participant.pct/100*c.questoes.length);
  const perfeito = participant.pct === 100;
  const mascotImg = perfeito ? "assets/mascote-comemorando.png" : "assets/mascote-feliz.png";
  const mascotMsg = perfeito
    ? "Mandou muito bem! 100% de acertos — boa sorte no sorteio! 🍀"
    : "Valeu por participar! Continue de olho nas próximas campanhas. 💪";
  container.innerHTML = `
    <div class="duo-done">
      ${perfeito ? confettiHTML() : ''}
      <img src="${mascotImg}" class="mascot-figure" alt="Univaldo">
      <h2>Obrigado por participar!</h2>
      <p>Sua participação foi registrada com sucesso.</p>
      <div class="duo-score">Você acertou <b>${correctCount} de ${c.questoes.length}</b> perguntas.</div>
      <p class="hint">Boa sorte no sorteio!</p>
    </div>
    ${mascotBubble(mascotMsg)}`;
}

function renderRegulamentoStats(){
  const el = document.getElementById('regulamentoStats');
  if(!el) return;
  const totalCampanhas = campaigns.length;
  const totalPremiados = new Set(wonHistory.map(w=>w.matricula)).size;
  const allParts = participants;
  const media = allParts.length ? Math.round(allParts.reduce((a,p)=>a+p.pct,0)/allParts.length) : 0;
  const totalElegiveisHoje = campaigns.reduce((a,c)=> a + evaluateEligibility(c.id).eligible.length, 0);
  el.innerHTML = `<div class="transp-stats">
    <div class="transp-stat"><b>${totalCampanhas}</b><span>Campanhas realizadas</span></div>
    <div class="transp-stat"><b>${totalPremiados}</b><span>Colaboradores já premiados</span></div>
    <div class="transp-stat"><b>${media}%</b><span>Média geral de acertos</span></div>
    <div class="transp-stat"><b>${totalElegiveisHoje}</b><span>Elegíveis somando as rodadas</span></div>
  </div>`;
}

/* ======================= PÁGINAS DO COLABORADOR ======================= */
function colaboradorStreakStrip(){
  const mine = participants.filter(p=>p.matricula===currentUser.matricula);
  const total = mine.length;
  const media = total ? Math.round(mine.reduce((a,p)=>a+p.pct,0)/total) : 0;
  const premios = campaigns.filter(c=>c.ganhadores && c.ganhadores.some(w=>w.matricula===currentUser.matricula)).length;
  return `<div class="streak-strip">
    <div class="streak-chip fire"><div class="si">🔥</div><div><b>${total}</b><span>Campanhas respondidas</span></div></div>
    <div class="streak-chip star"><div class="si">⭐</div><div><b>${media}%</b><span>Média de acertos</span></div></div>
    <div class="streak-chip trophy"><div class="si">🏆</div><div><b>${premios}</b><span>Vezes premiado(a)</span></div></div>
  </div>`;
}
function renderCampanhaAtual(){
  const body = document.getElementById('campanhaAtualBody');
  if(!body) return;
  const open = campaigns.filter(c=>campaignAccessStatus(c)==='aberta');
  let html = mascotBubble(`Oi, ${currentUser.nome.split(' ')[0]}! ${open.length ? 'Tem campanha nova esperando por você aqui embaixo 👇' : 'Nenhuma campanha aberta agora, mas fica de olho — aviso assim que abrir uma nova!'}`);
  html += colaboradorStreakStrip();
  if(!open.length){
    html += `<div class="panel fun-empty">
      <div class="fe-icon">🕒</div>
      <h3>Nenhuma campanha em andamento</h3>
      <p class="hint">Assim que uma nova campanha do PPG for aberta, ela aparecerá aqui.</p>
    </div>`;
    body.innerHTML = html;
    return;
  }
  html += open.map(c=>{
    const answered = participants.some(p=>p.campaignId===c.id && p.matricula===currentUser.matricula);
    return `<div class="panel">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; flex-wrap:wrap;">
        <div><h3>${c.nome}</h3><p class="hint" style="margin-top:6px; max-width:480px;">${c.descricao}</p></div>
        ${statusBadge(c.status)}
      </div>
      <div class="meta" style="margin:14px 0;">
        <span>📅 Responda até ${c.fim.replace('T',' ')}</span>
        <span>🏆 Prêmio: ${c.premio || 'a definir'}</span>
      </div>
      ${answered
        ? `<button class="btn btn-ghost" onclick="openQuiz('${c.id}')">Ver meu resultado</button>`
        : `<button class="btn btn-primary" onclick="openQuiz('${c.id}')">🚀 Responder agora</button>`}
    </div>`;
  }).join('');
  body.innerHTML = html;
}
function renderHistoricoColaborador(){
  const body = document.getElementById('historicoColabBody');
  if(!body) return;
  const mine = participants.filter(p=>p.matricula===currentUser.matricula).sort((a,b)=>b.data-a.data);
  let html = mascotBubble("Aqui está tudo que você já respondeu até agora. Bora conferir? 📋");
  html += mine.map(p=>{
    const c = campaigns.find(x=>x.id===p.campaignId);
    return `<div class="panel" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
      <div><h3 style="font-size:14.5px;">${c ? c.nome : p.campaignId}</h3><p class="hint" style="margin-top:4px;">Respondido em ${fmtDateTime(p.data)}</p></div>
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="font-family:'Manrope'; font-weight:800; font-size:18px; color:var(--secondary);">${p.pct}%</span>
        <button class="btn btn-outline btn-sm" onclick="openQuiz('${p.campaignId}')">Ver resultado</button>
      </div>
    </div>`;
  }).join('') || `<div class="panel fun-empty"><div class="fe-icon">📭</div>Você ainda não participou de nenhuma campanha.</div>`;
  body.innerHTML = html;
}
function renderMeuResultado(){
  const body = document.getElementById('meuResultadoBody');
  if(!body) return;
  const mine = participants.filter(p=>p.matricula===currentUser.matricula).sort((a,b)=>b.data-a.data);
  if(!mine.length){
    body.innerHTML = mascotBubble("Você ainda não respondeu nenhuma campanha — que tal começar agora?") +
      `<div class="panel fun-empty"><div class="fe-icon">🤔</div>Assim que você responder, seu resultado mais recente aparece aqui.</div>`;
    return;
  }
  const latest = mine[0];
  const c = campaigns.find(x=>x.id===latest.campaignId);
  renderQuizDoneInto(body, c, latest);
}

/* ======================= SORTEIO ======================= */
let sorteioRunning = false;
function renderSorteioSetup(){
  const sel = document.getElementById('selectCampanhaSorteio');
  if(!sel.value) return;
  const id = sel.value;
  const {eligible, excluded} = evaluateEligibility(id);
  document.getElementById('eligibleStrip').innerHTML = `<span style="font-size:12px; color:var(--ink-soft); margin-right:4px;">Elegíveis:</span>` +
    eligible.map(p=>`<span class="chip">${p.nome} · ${p.setor}</span>`).join('') +
    excluded.map(p=>`<span class="chip excluded" title="${p.motivo}">${p.nome}</span>`).join('');
  const setoresRepresentados = new Set(eligible.map(p=>p.setor)).size;
  const filiaisRepresentadas = new Set(eligible.map(p=>p.filial)).size;
  document.getElementById('sorteioStats').innerHTML = `
    <div class="stat"><b>${eligible.length}</b><span>Total de elegíveis</span></div>
    <div class="stat"><b>${excluded.length}</b><span>Excluídos por regra</span></div>
    <div class="stat"><b>${setoresRepresentados}</b><span>Setores representados</span></div>
    <div class="stat"><b>${filiaisRepresentadas}</b><span>Filiais representadas</span></div>`;
  document.getElementById('randomSeedWrap').style.display = "none";
  document.getElementById('justificationBox').style.display = "none";
  buildEmptySlots(id);
}
document.getElementById('selectCampanhaSorteio').addEventListener('change', renderSorteioSetup);
function buildEmptySlots(campaignId){
  const c = campaigns.find(x=>x.id===campaignId);
  const n = (c && c.qtdGanhadores) || 4;
  const slotsEl = document.getElementById('slots');
  slotsEl.innerHTML = "";
  for(let i=0;i<n;i++) slotsEl.innerHTML += `<div class="slot" id="slot${i}"><div class="pos">${i+1}º LUGAR</div><div class="name">—</div><div class="info">aguardando sorteio</div></div>`;
  document.getElementById('sorteioResultActions').style.display = "none";
}
function pickFairWinners(pool, need){
  const shuffled = [...pool].sort(()=>Math.random()-0.5);
  const winners = []; const usedSetores = new Set(), usedFiliais = new Set();
  for(const p of shuffled){ if(winners.length>=need) break; if(!usedSetores.has(p.setor) || !usedFiliais.has(p.filial)){ winners.push(p); usedSetores.add(p.setor); usedFiliais.add(p.filial); } }
  for(const p of shuffled){ if(winners.length>=need) break; if(!winners.includes(p)) winners.push(p); }
  const distinctSetores = new Set(winners.map(w=>w.setor)).size;
  const fair = distinctSetores === Math.min(need, new Set(pool.map(p=>p.setor)).size);
  return {winners, fair, distinctSetores};
}
document.getElementById('btnSortear').addEventListener('click', ()=>{
  if(sorteioRunning) return;
  const id = document.getElementById('selectCampanhaSorteio').value;
  const {eligible} = evaluateEligibility(id);
  const c = campaigns.find(x=>x.id===id);
  const need = (c && c.qtdGanhadores) || 4;
  if(eligible.length === 0){ showToast("Não há colaboradores elegíveis após aplicar as regras de elegibilidade.","warning"); return; }
  if(eligible.length < need) showToast(`Apenas ${eligible.length} elegível(is) disponível(is) para ${need} vagas — sorteando o possível.`,"warning");
  sorteioRunning = true;
  buildEmptySlots(id);
  const slotEls = Array.from(document.querySelectorAll('.slot'));
  slotEls.forEach(s=>s.classList.add('rolling'));
  const finalCount = Math.min(need, eligible.length);
  const {winners, fair, distinctSetores} = pickFairWinners(eligible, finalCount);
  const seed = Math.floor(100000000 + Math.random()*899999999).toString();
  let ticks = 0; const maxTicks = 22; const rollNames = eligible.map(p=>p.nome);
  const interval = setInterval(()=>{
    ticks++;
    slotEls.forEach((slotEl,i)=>{ if(i<finalCount){ slotEl.querySelector('.name').textContent = randomFrom(rollNames); } });
    if(ticks >= maxTicks){ clearInterval(interval); revealWinners(slotEls, winners, id, seed, fair, distinctSetores, eligible); }
  }, 80);
});
function revealWinners(slotEls, winners, campaignId, seed, fair, distinctSetores, eligible){
  winners.forEach((w,i)=>{
    setTimeout(()=>{
      const slotEl = slotEls[i];
      slotEl.classList.remove('rolling'); slotEl.classList.add('won');
      slotEl.querySelector('.name').textContent = w.nome;
      slotEl.querySelector('.info').textContent = `${w.matricula} · ${w.setor} · ${w.filial}`;
      if(i === winners.length-1){
        sorteioRunning = false;
        document.getElementById('sorteioResultActions').style.display = "flex";
        document.getElementById('randomSeedWrap').style.display = "block";
        document.getElementById('randomSeedValue').textContent = seed;
        const justBox = document.getElementById('justificationBox');
        if(!fair){
          justBox.style.display = "block";
          justBox.textContent = `⚠ Distribuição justa parcial: havia apenas ${distinctSetores || new Set(eligible.map(e=>e.setor)).size} setor(es) distinto(s) entre os elegíveis, portanto não foi possível garantir total diversidade. Justificativa registrada no histórico para auditoria.`;
        } else justBox.style.display = "none";
        window._lastSorteio = {campaignId, winners, seed, fair, distinctSetores, eligibleCount: eligible.length};
        showToast(`Sorteio concluído! ${winners.length} ganhador(es) selecionado(s).`,"success");
      }
    }, i*350);
  });
  for(let i=winners.length;i<slotEls.length;i++){ slotEls[i].classList.remove('rolling'); slotEls[i].querySelector('.info').textContent = "sem elegível disponível"; }
}
document.getElementById('btnResetSorteio').addEventListener('click', ()=>{ if(!sorteioRunning) renderSorteioSetup(); });
document.getElementById('btnValidarSorteio').addEventListener('click', ()=>{
  showToast("Resultado validado por Mariana Queiroz (Qualidade).","success");
  logAction("Sorteio validado", "Resultado confirmado pela equipe da Qualidade.");
});
document.getElementById('btnRelatorioOficial').addEventListener('click', ()=>{
  if(!window._lastSorteio){ showToast("Realize o sorteio antes de gerar o relatório.","warning"); return; }
  const {campaignId, winners, seed} = window._lastSorteio;
  const c = campaigns.find(x=>x.id===campaignId);
  const headers = ["Posição","Nome","Matrícula","Setor","Filial"];
  const rows = winners.map((w,i)=>[i+1, w.nome, w.matricula, w.setor, w.filial]);
  openPrintReport(`Relatório oficial do sorteio — ${c.nome}`, headers, rows, `Número aleatório utilizado: ${seed} · Gerado em ${fmtDateTime(new Date())}`);
  logAction("Relatório oficial gerado", c.nome);
});
document.getElementById('btnRegistrarHistorico').addEventListener('click', ()=>{
  if(!window._lastSorteio) return;
  const {campaignId, winners, seed, fair, distinctSetores, eligibleCount} = window._lastSorteio;
  const c = campaigns.find(x=>x.id===campaignId);
  c.ganhadores = winners.map(w=>({nome:w.nome, matricula:w.matricula, setor:w.setor, filial:w.filial, funcao:w.funcao}));
  c.status = "finalizada"; c.randomSeed = seed; c.responsavel = "Mariana Queiroz";
  c.justificativa = fair ? `Distribuição justa alcançada entre ${distinctSetores} setor(es) distintos.` : `Distribuição parcial: apenas ${distinctSetores} setor(es) representado(s) entre os ${eligibleCount} elegíveis.`;
  winners.forEach(w=> wonHistory.push({matricula:w.matricula, data:new Date()}));
  historyLog.unshift({campaignId, data:new Date(), texto:`Sorteio realizado para a campanha ${c.nome}.`});
  logAction("Sorteio registrado no histórico", c.nome);
  fillCampaignSelects();
  showToast("Sorteio registrado no histórico para auditoria.","success");
  document.querySelector('[data-target="historico"]').click();
});

/* ======================= RELATÓRIOS (exportação real) ======================= */
function downloadCSV(filename, headers, rows){
  const escape = v => `"${String(v).replace(/"/g,'""')}"`;
  const csv = [headers.map(escape).join(';'), ...rows.map(r=>r.map(escape).join(';'))].join('\r\n');
  const blob = new Blob(["\uFEFF"+csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}
function buildBarChartSVG(labels, values, opts){
  opts = opts || {};
  const w = 580, h = 240, padTop = 30, padBottom = 50, padSide = 20;
  const innerH = h - padTop - padBottom;
  const max = Math.max(...values, 1);
  const n = values.length || 1;
  const gap = 14;
  const barW = Math.max(16, (w - padSide*2 - gap*(n-1)) / n);
  let bars = "";
  values.forEach((v,i)=>{
    const barH = Math.round((v/max) * innerH);
    const x = padSide + i*(barW+gap);
    const y = h - padBottom - barH;
    const label = String(labels[i]||'').length > 15 ? String(labels[i]).slice(0,14)+'…' : String(labels[i]||'');
    bars += `<rect x="${x.toFixed(1)}" y="${y}" width="${barW.toFixed(1)}" height="${barH}" fill="#02A39D" rx="5"/>`;
    bars += `<text x="${(x+barW/2).toFixed(1)}" y="${y-6}" font-size="11" text-anchor="middle" fill="#00695C" font-family="Arial">${v}${opts.suffix||''}</text>`;
    bars += `<text x="${(x+barW/2).toFixed(1)}" y="${h-padBottom+16}" font-size="9.5" text-anchor="middle" fill="#5B7370" font-family="Arial">${label}</text>`;
  });
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;">
    <line x1="${padSide}" y1="${h-padBottom}" x2="${w-padSide}" y2="${h-padBottom}" stroke="#E3ECEA"/>
    ${bars}
  </svg>`;
}
function openPrintReport(title, headers, rows, footNote, chartSvg){
  const win = window.open('', '_blank');
  if(!win){ showToast("O navegador bloqueou a abertura da janela de impressão.","warning"); return; }
  win.document.write(`
    <html><head><title>${title}</title>
    <style>
      body{font-family:Arial,sans-serif; padding:32px; color:#0F2A28;}
      h1{font-size:18px; color:#00695C; margin-bottom:4px;}
      p.meta{color:#5B7370; font-size:12px; margin-top:0;}
      table{width:100%; border-collapse:collapse; margin-top:18px;}
      th,td{border:1px solid #E3ECEA; padding:8px 10px; font-size:12px; text-align:left;}
      th{background:#F7F9FB; color:#5B7370; text-transform:uppercase; font-size:10px;}
      .chart-wrap{margin-top:16px; text-align:center;}
    </style></head><body>
    <h1>PPG · Programa Política de Gestão</h1>
    <p class="meta">${title} — gerado em ${fmtDateTime(new Date())}</p>
    ${chartSvg ? `<div class="chart-wrap">${chartSvg}</div>` : ''}
    <table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead>
    <tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>
    ${footNote ? `<p class="meta" style="margin-top:16px;">${footNote}</p>` : ''}
    </body></html>`);
  win.document.close();
  win.focus();
  setTimeout(()=> win.print(), 300);
}
function buildReportData(reportType, campaignId){
  const c = campaigns.find(x=>x.id===campaignId);
  if(reportType === 'participantes'){
    const rows = campaignParticipants(campaignId).map(p=>[p.nome,p.matricula,p.cargo,p.setor,p.filial,fmtDateTime(p.data),p.pct+"%"]);
    return {title:`Lista de participantes — ${c.nome}`, headers:["Nome","Matrícula","Cargo","Setor","Filial","Data/hora","% Acertos"], rows};
  }
  if(reportType === 'elegiveis'){
    const {eligible} = evaluateEligibility(campaignId);
    const rows = eligible.map((p,i)=>[i+1,p.nome,p.matricula,p.cargo,p.setor,p.filial,fmtDateTime(p.data)]);
    return {title:`Elegíveis ao sorteio — ${c.nome}`, headers:["#","Nome","Matrícula","Cargo","Setor","Filial","Data/hora"], rows};
  }
  if(reportType === 'ganhadores'){
    const rows = (c.ganhadores||[]).map((w,i)=>[i+1,w.nome,w.matricula,w.setor,w.filial,w.funcao]);
    return {title:`Ganhadores sorteados — ${c.nome}`, headers:["Posição","Nome","Matrícula","Setor","Filial","Função"], rows};
  }
  if(reportType === 'distribuicao'){
    const allWinners = campaigns.filter(x=>x.ganhadores).flatMap(x=>x.ganhadores);
    const rows = allWinners.map(w=>[w.nome,w.setor,w.filial,w.funcao]);
    const counts = {};
    allWinners.forEach(w=> counts[w.setor] = (counts[w.setor]||0)+1);
    const chartSvg = Object.keys(counts).length ? buildBarChartSVG(Object.keys(counts), Object.values(counts)) : null;
    return {title:`Distribuição de ganhadores por setor/filial/função — todas as campanhas`, headers:["Nome","Setor","Filial","Função"], rows, chartSvg};
  }
  if(reportType === 'auditoria'){
    const rows = [[c.nome, c.criterios||"—", c.randomSeed||"—", c.responsavel||"—", c.justificativa||"—"]];
    return {title:`Registro de auditoria do sorteio — ${c.nome}`, headers:["Campanha","Critérios aplicados","Nº aleatório","Responsável","Justificativa"], rows};
  }
  if(reportType === 'historico'){
    const rows = campaigns.filter(x=>x.ganhadores || x.status==='encerrada').map(x=>[x.nome, x.inicio.replace('T',' '), x.fim.replace('T',' '), campaignParticipants(x.id).length, x.ganhadores?x.ganhadores.length:0]);
    return {title:"Histórico completo de campanhas", headers:["Campanha","Início","Encerramento","Participantes","Ganhadores"], rows};
  }
  if(reportType === 'comparativo'){
    const rows = campaigns.map(x=>{
      const parts = campaignParticipants(x.id);
      const media = parts.length ? Math.round(parts.reduce((a,p)=>a+p.pct,0)/parts.length) : 0;
      const {eligible} = evaluateEligibility(x.id);
      return [x.nome, parts.length, eligible.length, media+"%", x.ganhadores?x.ganhadores.length:0, x.status];
    });
    const chartSvg = buildBarChartSVG(campaigns.map(x=>x.nome.split('–')[0].trim()), campaigns.map(x=>campaignParticipants(x.id).length), {suffix:' resp.'});
    return {title:"Comparativo entre campanhas", headers:["Campanha","Participantes","Elegíveis","Média de acertos","Ganhadores","Status"], rows, chartSvg};
  }
  if(reportType === 'evolucao'){
    const ordered = [...campaigns].sort((a,b)=> new Date(a.inicio) - new Date(b.inicio));
    const rows = ordered.map(x=>{
      const parts = campaignParticipants(x.id);
      const media = parts.length ? Math.round(parts.reduce((a,p)=>a+p.pct,0)/parts.length) : 0;
      return [x.inicio.replace('T',' '), x.nome, parts.length, media+"%"];
    });
    const chartSvg = buildBarChartSVG(ordered.map(x=>x.nome.split('–')[0].trim()), ordered.map(x=>{
      const parts = campaignParticipants(x.id);
      return parts.length ? Math.round(parts.reduce((a,p)=>a+p.pct,0)/parts.length) : 0;
    }), {suffix:'%'});
    return {title:"Evolução histórica — média de acertos por campanha ao longo do tempo", headers:["Início","Campanha","Participantes","Média de acertos"], rows, chartSvg};
  }
}
document.querySelectorAll('.report-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const campaignId = document.getElementById('selectCampanhaRelatorio').value;
    const data = buildReportData(btn.dataset.report, campaignId);
    if(!data.rows.length){ showToast("Não há dados para exportar neste relatório.","warning"); return; }
    if(btn.dataset.type === "Excel"){
      downloadCSV(data.title.replace(/[^\w]+/g,'_') + ".csv", data.headers, data.rows);
      showToast("Arquivo .csv baixado (compatível com Excel).","success");
    } else {
      openPrintReport(data.title, data.headers, data.rows, null, data.chartSvg);
      showToast("Abrindo visualização para impressão/PDF.","success");
    }
    logAction("Relatório exportado", `${btn.dataset.report} (${btn.dataset.type})`);
  });
});

/* ======================= HISTÓRICO (Qualidade) ======================= */
function renderTimeline(){
  document.getElementById('timeline').innerHTML = campaigns.filter(c=>c.status==="finalizada" || c.status==="encerrada").map(c=>{
    const {eligible} = evaluateEligibility(c.id);
    const winnersHtml = c.ganhadores ? `<div class="tl-winners">${c.ganhadores.map(w=>`<span class="chip">🏆 ${w.nome} · ${w.setor}</span>`).join('')}</div>` : `<div class="tl-winners"><span class="chip">Sorteio pendente de execução</span></div>`;
    const metaHtml = c.ganhadores ? `
      <div class="tl-meta"><span>👥 ${campaignParticipants(c.id).length} participantes</span><span>✅ ${eligible.length} elegíveis avaliados</span><span>🎲 nº aleatório: ${c.randomSeed || "—"}</span><span>👤 responsável: ${c.responsavel || "—"}</span></div>
      <div class="hint" style="margin-top:6px;">${c.justificativa || ""}</div>` : "";
    return `<div class="tl-item"><div class="tl-dot"></div><div class="tl-body"><h4>${c.nome}</h4><p>${c.inicio.replace('T',' ')} → ${c.fim.replace('T',' ')} · ${statusBadge(c.status)}</p>${winnersHtml}${metaHtml}</div></div>`;
  }).join('') || `<p style="color:var(--ink-soft); font-size:13px;">Nenhuma campanha encerrada ainda.</p>`;
}

/* ======================= INIT ======================= */
const _hadSavedState = loadState();
fillCampaignSelects();
renderDashboard();
renderCampaignGrid();
renderParticipantsTable();
renderEligibleTable();
renderSorteioSetup();
renderTimeline();
renderBanco();
if(window.lucide) lucide.createIcons();

if(_hadSavedState && currentUser){
  document.getElementById('loginScreen').style.display = "none";
  document.getElementById('appRoot').style.display = "flex";
  applyRole(currentUser.role);
  showToast(`Sessão restaurada — bem-vindo(a) de volta, ${currentUser.nome}.`, "");
} else if(_hadSavedState){
  showToast("Dados salvos anteriormente neste navegador foram restaurados.", "");
} else {
  saveState(); // primeira vez neste navegador: grava os dados de demonstração como ponto de partida
}
