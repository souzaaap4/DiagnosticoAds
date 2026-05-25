function setupBancoDeDados() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var SHEET_NAME = "Banco de Dados";

  var existing = ss.getSheetByName(SHEET_NAME);
  if (existing) ss.deleteSheet(existing);

  var sheet = ss.insertSheet(SHEET_NAME);

  // ── Cabecalhos ───────────────────────────────────────────────────────────────
  var headers = [
    "Data de entrada de leads",
    "Hora",
    "Nome completo",
    "E-mail",
    "WhatsApp",
    "Confirmar WhatsApp",
    "Investimento em Ads",
    "Canais",
    "Funil",
    "Channel",
    "Source",
    "Medium",
    "Campaign",
    "Content",
    "Referrer",
    "Page URL",
    "Timestamp"
  ];

  // Notas explicativas em cada cabecalho
  var headerNotes = [
    "Data em que o lead entrou (DD/MM/AAAA)",
    "Hora do envio do formulario (HH:MM)",
    "Nome completo informado no formulario",
    "E-mail informado no formulario",
    "WhatsApp com DDD",
    "Confirmacao do WhatsApp (deve ser identico ao anterior)",
    "Quanto investe em publicidade nos marketplaces",
    "Quais canais de marketplace utiliza",
    "Nome do funil de origem (ex: diagnostico-organico)",
    "Canal de aquisicao (ex: organico, pago, direto)",
    "Origem do trafego (ex: google, instagram, direto)",
    "Midia (ex: cpc, stories, none)",
    "Nome da campanha",
    "Conteudo do anuncio (utm_content)",
    "Dominio de referencia (de onde veio o usuario)",
    "URL completa da pagina no momento do envio",
    "Data e hora ISO do envio (gerado automaticamente)"
  ];

  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);

  // Adiciona notas nos cabecalhos
  for (var i = 0; i < headers.length; i++) {
    sheet.getRange(1, i + 1).setNote(headerNotes[i]);
  }

  // ── Estilo do cabecalho ──────────────────────────────────────────────────────
  headerRange
    .setBackground("#0d1b2a")
    .setFontColor("#b7ff2b")
    .setFontWeight("bold")
    .setFontSize(10)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setWrap(false);

  sheet.setRowHeight(1, 38);

  // ── Larguras de coluna ───────────────────────────────────────────────────────
  var widths = [160, 70, 180, 200, 130, 140, 220, 160, 170, 110, 130, 100, 180, 110, 220, 280, 210];
  for (var i = 0; i < widths.length; i++) {
    sheet.setColumnWidth(i + 1, widths[i]);
  }

  // ── Congelar cabecalho ───────────────────────────────────────────────────────
  sheet.setFrozenRows(1);

  // ── Filtro automatico ────────────────────────────────────────────────────────
  sheet.getRange(1, 1, 1, headers.length).createFilter();

  // ── Formatacao zebrada ───────────────────────────────────────────────────────
  var dataRange = sheet.getRange(1, 1, 1000, headers.length);
  var banding = dataRange.applyRowBanding(SpreadsheetApp.BandingTheme.GREY);
  banding.setHeaderRowColor("#0d1b2a");
  banding.setFirstRowColor("#f4f6f8");
  banding.setSecondRowColor("#ffffff");

  // ── Validacao: coluna Funil (col 9) ─────────────────────────────────────────
  var funilRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["diagnostico-organico", "lead-organico", "outro"], true)
    .setAllowInvalid(true)
    .setHelpText("Funil de origem do lead")
    .build();
  sheet.getRange(2, 9, 999, 1).setDataValidation(funilRule);

  // ── Validacao: coluna Channel (col 10) ───────────────────────────────────────
  var channelRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["direto", "organico", "pago", "social", "email", "referral"], true)
    .setAllowInvalid(true)
    .setHelpText("Canal de aquisicao")
    .build();
  sheet.getRange(2, 10, 999, 1).setDataValidation(channelRule);

  // ── Formatacao condicional: Channel ─────────────────────────────────────────
  var channelCol = sheet.getRange(2, 10, 999, 1);
  var rules = sheet.getConditionalFormatRules();

  var condRules = [
    { value: "organico",  bg: "#d4edda", fg: "#155724" },
    { value: "pago",      bg: "#fff3cd", fg: "#856404" },
    { value: "social",    bg: "#cce5ff", fg: "#004085" },
    { value: "direto",    bg: "#e2e3e5", fg: "#383d41" },
    { value: "email",     bg: "#f8d7da", fg: "#721c24" },
    { value: "referral",  bg: "#e8d5f5", fg: "#4a148c" }
  ];

  for (var r = 0; r < condRules.length; r++) {
    var rule = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(condRules[r].value)
      .setBackground(condRules[r].bg)
      .setFontColor(condRules[r].fg)
      .setRanges([channelCol])
      .build();
    rules.push(rule);
  }
  sheet.setConditionalFormatRules(rules);

  // ── Proteger cabecalho ───────────────────────────────────────────────────────
  var protection = headerRange.protect().setDescription("Cabecalho - nao editar");
  protection.setWarningOnly(true);

  // ── Menu personalizado ───────────────────────────────────────────────────────
  SpreadsheetApp.getUi()
    .createMenu("Metodo P4")
    .addItem("Recriar Banco de Dados", "setupBancoDeDados")
    .addItem("Limpar dados (manter cabecalho)", "limparDados")
    .addToUi();

  SpreadsheetApp.getUi().alert(
    'Aba "Banco de Dados" criada!\n\n' +
    headers.length + ' colunas configuradas.\n' +
    'Validacoes, formatacao condicional e notas aplicadas.'
  );
}

// ── Limpa dados mantendo o cabecalho ────────────────────────────────────────
function limparDados() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Banco de Dados");
  if (!sheet) {
    SpreadsheetApp.getUi().alert('Aba "Banco de Dados" nao encontrada.');
    return;
  }
  var ui = SpreadsheetApp.getUi();
  var confirm = ui.alert(
    "Confirmar limpeza",
    "Isso vai apagar TODOS os dados (exceto cabecalho). Continuar?",
    ui.ButtonSet.YES_NO
  );
  if (confirm !== ui.Button.YES) return;
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }
  SpreadsheetApp.getUi().alert("Dados apagados. Cabecalho mantido.");
}
