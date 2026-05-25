function setupOrganico() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var SHEET_NAME = "Organico";

  var existing = ss.getSheetByName(SHEET_NAME);
  if (existing) ss.deleteSheet(existing);

  var sheet = ss.insertSheet(SHEET_NAME);

  // ── Cabecalhos ───────────────────────────────────────────────────────────────
  var headers = [
    "Entrada leads",                               // 1
    "Data primeira tentativa contato/Primeira resposta", // 2
    "Data ultimo contato ou tentativa",            // 3
    "Nome completo",                               // 4
    "Qual seu e-mail?",                            // 5
    "Qual o seu WhatsApp?",                        // 6
    "Confirme seu WhatsApp",                       // 7
    "Qual e a sua medalha no Mercado Livre?",      // 8
    "Qual e o seu regime tributario atual?",       // 9
    "Funil",                                       // 10
    "Pre Venda",                                   // 11
    "Pergunta adicional",                          // 12
    "Respondente?",                                // 13
    "MQL",                                         // 14
    "Agendado?",                                   // 15
    "Data Agendamento",                            // 16
    "Closer",                                      // 17
    "Observacoes",                                 // 18
    "Por que nao agendou?",                        // 19
    "Proxima interacao pre vendas",                // 20
    "Reuniao realizada?",                          // 21
    "Data Reuniao ou No-show",                     // 22
    "Situacao",                                    // 23
    "Data situacao",                               // 24
    "Por que recusou a proposta?",                 // 25
    "Produto",                                     // 26
    "Valor total",                                 // 27
    "Caixa Coletado",                              // 28
    "Proxima interacao Closer",                    // 29
    "channel",                                     // 30
    "utm_source",                                  // 31
    "utm_medium",                                  // 32
    "utm_campaign",                                // 33
    "utm_content",                                 // 34
    "timestamp"                                    // 35
  ];

  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);

  sheet.setRowHeight(1, 40);
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(4); // congela ate "Nome completo"

  // ── Larguras de coluna ───────────────────────────────────────────────────────
  var widths = [
    130, // 1  Entrada leads
    200, // 2  Data primeira tentativa
    200, // 3  Data ultimo contato
    180, // 4  Nome completo
    200, // 5  E-mail
    150, // 6  WhatsApp
    150, // 7  Confirme WhatsApp
    200, // 8  Medalha ML
    200, // 9  Regime tributario
    160, // 10 Funil
    130, // 11 Pre Venda
    220, // 12 Pergunta adicional
    110, // 13 Respondente
    80,  // 14 MQL
    100, // 15 Agendado
    140, // 16 Data Agendamento
    130, // 17 Closer
    200, // 18 Observacoes
    200, // 19 Por que nao agendou
    180, // 20 Proxima interacao PV
    130, // 21 Reuniao realizada
    160, // 22 Data Reuniao / No-show
    140, // 23 Situacao
    130, // 24 Data situacao
    200, // 25 Por que recusou
    130, // 26 Produto
    120, // 27 Valor total
    120, // 28 Caixa Coletado
    180, // 29 Proxima interacao Closer
    100, // 30 channel
    120, // 31 utm_source
    110, // 32 utm_medium
    160, // 33 utm_campaign
    130, // 34 utm_content
    200  // 35 timestamp
  ];
  for (var i = 0; i < widths.length; i++) {
    sheet.setColumnWidth(i + 1, widths[i]);
  }

  // ── Cores de fundo por grupo de colunas ─────────────────────────────────────
  // Grupo 1 — Dados do lead (cols 1-9): azul escuro
  sheet.getRange(1, 1, 1, 9).setBackground("#0d1b2a").setFontColor("#b7ff2b");
  // Grupo 2 — CRM / Funil (cols 10-29): roxo escuro
  sheet.getRange(1, 10, 1, 20).setBackground("#1a0a2e").setFontColor("#e0b7ff");
  // Grupo 3 — Rastreamento (cols 30-35): cinza escuro
  sheet.getRange(1, 30, 1, 6).setBackground("#1c1c1c").setFontColor("#aaaaaa");

  headerRange
    .setFontWeight("bold")
    .setFontSize(10)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setWrap(false);

  // ── Filtro automatico ────────────────────────────────────────────────────────
  headerRange.createFilter();

  // ── Formatacao zebrada ───────────────────────────────────────────────────────
  var banding = sheet.getRange(1, 1, 1000, headers.length)
    .applyRowBanding(SpreadsheetApp.BandingTheme.GREY);
  banding.setHeaderRowColor("#0d1b2a");
  banding.setFirstRowColor("#f4f6f8");
  banding.setSecondRowColor("#ffffff");

  // ── Validacoes ───────────────────────────────────────────────────────────────
  function dropdown(list) {
    return SpreadsheetApp.newDataValidation()
      .requireValueInList(list, true)
      .setAllowInvalid(true)
      .build();
  }

  // Funil (col 10)
  sheet.getRange(2, 10, 999).setDataValidation(
    dropdown(["diagnostico-organico", "lead-organico", "outro"])
  );
  // Respondente (col 13)
  sheet.getRange(2, 13, 999).setDataValidation(dropdown(["Sim", "Nao"]));
  // MQL (col 14)
  sheet.getRange(2, 14, 999).setDataValidation(dropdown(["Sim", "Nao"]));
  // Agendado (col 15)
  sheet.getRange(2, 15, 999).setDataValidation(
    dropdown(["Sim", "Nao", "Pendente", "Sem resposta"])
  );
  // Reuniao realizada (col 21)
  sheet.getRange(2, 21, 999).setDataValidation(
    dropdown(["Sim", "No-show", "Pendente"])
  );
  // Situacao (col 23)
  sheet.getRange(2, 23, 999).setDataValidation(
    dropdown(["Em contato", "Agendado", "Reuniao realizada", "Proposta enviada", "Fechado", "Perdido", "Sem resposta"])
  );
  // Channel (col 30)
  sheet.getRange(2, 30, 999).setDataValidation(
    dropdown(["organico", "direto", "pago", "social", "email", "referral"])
  );

  // ── Formatacao condicional — coluna Situacao (col 23) ───────────────────────
  var sitRange = sheet.getRange(2, 23, 999, 1);
  var rules = sheet.getConditionalFormatRules();

  var sitRules = [
    { text: "Fechado",            bg: "#d4edda", fg: "#155724" },
    { text: "Reuniao realizada",  bg: "#cce5ff", fg: "#004085" },
    { text: "Agendado",           bg: "#fff3cd", fg: "#856404" },
    { text: "Proposta enviada",   bg: "#e8d5f5", fg: "#4a148c" },
    { text: "Em contato",         bg: "#d1ecf1", fg: "#0c5460" },
    { text: "Perdido",            bg: "#f8d7da", fg: "#721c24" },
    { text: "Sem resposta",       bg: "#e2e3e5", fg: "#383d41" }
  ];

  for (var r = 0; r < sitRules.length; r++) {
    rules.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo(sitRules[r].text)
        .setBackground(sitRules[r].bg)
        .setFontColor(sitRules[r].fg)
        .setRanges([sitRange])
        .build()
    );
  }

  // Formatacao condicional — MQL = Sim (col 14)
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Sim")
      .setBackground("#d4edda")
      .setFontColor("#155724")
      .setRanges([sheet.getRange(2, 14, 999, 1)])
      .build()
  );

  // Formatacao condicional — Agendado = Sim (col 15)
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Sim")
      .setBackground("#d4edda")
      .setFontColor("#155724")
      .setRanges([sheet.getRange(2, 15, 999, 1)])
      .build()
  );

  sheet.setConditionalFormatRules(rules);

  // ── Proteger colunas de rastreamento (cols 30-35) ───────────────────────────
  var trackingRange = sheet.getRange(1, 30, 1000, 6);
  var tp = trackingRange.protect().setDescription("Rastreamento - preenchido automaticamente");
  tp.setWarningOnly(true);

  // ── Proteger cabecalho ───────────────────────────────────────────────────────
  var hp = headerRange.protect().setDescription("Cabecalho - nao editar");
  hp.setWarningOnly(true);

  // ── Menu personalizado ───────────────────────────────────────────────────────
  SpreadsheetApp.getUi()
    .createMenu("Metodo P4")
    .addItem("Recriar aba Organico", "setupOrganico")
    .addItem("Recriar Banco de Dados", "setupBancoDeDados")
    .addItem("Limpar dados (manter cabecalho)", "limparOrganico")
    .addToUi();

  SpreadsheetApp.getUi().alert(
    'Aba "Organico" criada com sucesso!\n\n' +
    headers.length + ' colunas | 3 grupos de cor\n' +
    'Validacoes, formatacao condicional e protecoes aplicadas.'
  );
}

function limparOrganico() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Organico");
  if (!sheet) {
    SpreadsheetApp.getUi().alert('Aba "Organico" nao encontrada.');
    return;
  }
  var ui = SpreadsheetApp.getUi();
  var confirm = ui.alert(
    "Confirmar limpeza",
    "Isso apaga TODOS os dados da aba Organico. Continuar?",
    ui.ButtonSet.YES_NO
  );
  if (confirm !== ui.Button.YES) return;
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }
  SpreadsheetApp.getUi().alert("Dados apagados. Cabecalho mantido.");
}
