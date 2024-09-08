// Segmento P - Beneficiário (Cobrança)
export const SEGMENT_P = {
  BANK: { position: [1, 3], description: "Código do banco (3 dígitos)" },
  LOT: { position: [4, 7], description: "Número do lote" },
  RECORD_TYPE: { position: [8, 8], description: "Tipo de registro (detalhe)" },
  SEQUENTIAL_NUMBER: { position: [9, 13], description: "Número sequencial dentro do lote" },
  SEGMENT: { position: [14, 14], description: "Código do segmento (P)" },
  BENEFICIARY_AGENCY: { position: [18, 22], description: "Agência do beneficiário" },
  BENEFICIARY_ACCOUNT: { position: [23, 32], description: "Número da conta do beneficiário" },
  ACCOUNT_DIGIT: { position: [33, 33], description: "Dígito da conta do beneficiário" },
  OUR_NUMBER: { position: [63, 73], description: "Nosso número do boleto" },
  PORTFOLIO: { position: [107, 108], description: "Código da carteira de cobrança" },
  DOCUMENT_NUMBER: { position: [109, 123], description: "Número do documento" },
  DUE_DATE: { position: [124, 131], description: "Data de vencimento (ddmmaa)" },
  TITLE_VALUE: { position: [132, 146], description: "Valor do título (boleto)" },
  TITLE_SPECIES: { position: [147, 149], description: "Espécie do título (ex: duplicata)" },
  ISSUE_DATE: { position: [150, 157], description: "Data de emissão do boleto" },
  DAILY_INTEREST: { position: [158, 173], description: "Valor de juros por dia de atraso" },
  INTEREST_START_DATE: { position: [174, 181], description: "Data de início da cobrança de juros" }
}

// Segmento Q - Pagador
export const SEGMENT_Q = {
  BANK: { position: [1, 3], description: "Código do banco (3 dígitos)" },
  LOT: { position: [4, 7], description: "Número do lote" },
  RECORD_TYPE: { position: [8, 8], description: "Tipo de registro (detalhe)" },
  SEQUENTIAL_NUMBER: { position: [9, 13], description: "Número sequencial dentro do lote" },
  SEGMENT: { position: [14, 14], description: "Código do segmento (Q)" },
  PAYER_CPF_CNPJ: { position: [74, 88], description: "CPF ou CNPJ do pagador" },
  PAYER_NAME: { position: [34, 73], description: "Nome do pagador" },
  PAYER_ADDRESS: { position: [89, 128], description: "Endereço do pagador" },
  PAYER_NEIGHBORHOOD: { position: [129, 148], description: "Bairro do pagador" },
  PAYER_ZIP_CODE: { position: [149, 153], description: "CEP do pagador" },
  PAYER_CITY: { position: [154, 173], description: "Cidade do pagador" },
  PAYER_STATE: { position: [174, 175], description: "Estado (UF) do pagador" },
  GUARANTOR_NAME: { position: [176, 215], description: "Nome do sacador/avalista (se houver)" },
  GUARANTOR_CPF_CNPJ: { position: [216, 230], description: "CPF ou CNPJ do sacador/avalista" }
}

// Segmento R - Multas, Juros e Instruções Adicionais
export const SEGMENT_R = {
  BANK: { position: [1, 3], description: "Código do banco (3 dígitos)" },
  LOT: { position: [4, 7], description: "Número do lote" },
  RECORD_TYPE: { position: [8, 8], description: "Tipo de registro (detalhe)" },
  SEQUENTIAL_NUMBER: { position: [9, 13], description: "Número sequencial dentro do lote" },
  SEGMENT: { position: [14, 14], description: "Código do segmento (R)" },
  FINE_FOR_DELAY: { position: [19, 33], description: "Valor da multa por atraso" },
  FINE_START_DATE: { position: [34, 41], description: "Data para início da cobrança da multa" },
  DISCOUNT_VALUE: { position: [58, 72], description: "Valor do desconto concedido" },
  DISCOUNT_LIMIT_DATE: { position: [73, 80], description: "Data limite para concessão de desconto" },
  PROTEST_INSTRUCTION: { position: [109, 109], description: "Código de instrução de protesto" },
  PROTEST_PERIOD: { position: [110, 113], description: "Prazo para protesto (em dias)" },
  WRITE_OFF_INSTRUCTION: { position: [142, 142], description: "Código de instrução de baixa" }
}

export function extractSegmentP(line) {
  return {
    bank: line.slice(SEGMENT_P.BANK.position[0] - 1, SEGMENT_P.BANK.position[1]),
    lot: line.slice(SEGMENT_P.LOT.position[0] - 1, SEGMENT_P.LOT.position[1]),
    beneficiaryAgency: line.slice(SEGMENT_P.BENEFICIARY_AGENCY.position[0] - 1, SEGMENT_P.BENEFICIARY_AGENCY.position[1]),
    beneficiaryAccount: line.slice(SEGMENT_P.BENEFICIARY_ACCOUNT.position[0] - 1, SEGMENT_P.BENEFICIARY_ACCOUNT.position[1]),
    ourNumber: line.slice(SEGMENT_P.OUR_NUMBER.position[0] - 1, SEGMENT_P.OUR_NUMBER.position[1]),
    dueDate: line.slice(SEGMENT_P.DUE_DATE.position[0] - 1, SEGMENT_P.DUE_DATE.position[1]),
    titleValue: line.slice(SEGMENT_P.TITLE_VALUE.position[0] - 1, SEGMENT_P.TITLE_VALUE.position[1])
  }
}

export function extractSegmentQ(line) {
  return {
    bank: line.slice(SEGMENT_Q.BANK.position[0] - 1, SEGMENT_Q.BANK.position[1]),
    lot: line.slice(SEGMENT_Q.LOT.position[0] - 1, SEGMENT_Q.LOT.position[1]),
    payerName: line.slice(SEGMENT_Q.PAYER_NAME.position[0] - 1, SEGMENT_Q.PAYER_NAME.position[1]),
    payerCpfCnpj: line.slice(SEGMENT_Q.PAYER_CPF_CNPJ.position[0] - 1, SEGMENT_Q.PAYER_CPF_CNPJ.position[1]),
    payerAddress: line.slice(SEGMENT_Q.PAYER_ADDRESS.position[0] - 1, SEGMENT_Q.PAYER_ADDRESS.position[1]),
    payerCity: line.slice(SEGMENT_Q.PAYER_CITY.position[0] - 1, SEGMENT_Q.PAYER_CITY.position[1]),
    payerState: line.slice(SEGMENT_Q.PAYER_STATE.position[0] - 1, SEGMENT_Q.PAYER_STATE.position[1])
  }
}

export function extractSegmentR(line) {
  return {
    bank: line.slice(SEGMENT_R.BANK.position[0] - 1, SEGMENT_R.BANK.position[1]),
    lot: line.slice(SEGMENT_R.LOT.position[0] - 1, SEGMENT_R.LOT.position[1]),
    fineForDelay: line.slice(SEGMENT_R.FINE_FOR_DELAY.position[0] - 1, SEGMENT_R.FINE_FOR_DELAY.position[1]),
    fineStartDate: line.slice(SEGMENT_R.FINE_START_DATE.position[0] - 1, SEGMENT_R.FINE_START_DATE.position[1]),
    discountValue: line.slice(SEGMENT_R.DISCOUNT_VALUE.position[0] - 1, SEGMENT_R.DISCOUNT_VALUE.position[1])
  }
}
