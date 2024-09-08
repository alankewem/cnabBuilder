import { formatDateCNAB } from "../utils.mjs"

// Segmento P - Beneficiário (Cobrança)
export const SEGMENT_P = {
  BANK: { position: [1, 3], description: "Código do banco (3 dígitos)" },
  LOT: { position: [4, 7], description: "Número do lote" },
  RECORD_TYPE: { position: [8, 8], description: "Tipo de registro (detalhe)" },
  SEQUENTIAL_NUMBER: { position: [9, 13], description: "Número sequencial dentro do lote" },
  SEGMENT: { position: [14, 14], description: "Código do segmento (P)" },
  BENEFICIARY_AGENCY: { position: [18, 22], description: "Agência do beneficiário" },
  BENEFICIARY_AGENCY_DIGIT: { position: [23, 23], description: "Agência do beneficiário" },
  BENEFICIARY_ACCOUNT: { position: [24, 35], description: "Número da conta do beneficiário" },
  ACCOUNT_DIGIT: { position: [36, 36], description: "Dígito da conta do beneficiário" },
  OUR_NUMBER: { position: [38, 57], description: "Nosso número do boleto" },
  PORTFOLIO: { position: [107, 108], description: "Código da carteira de cobrança" },
  DOCUMENT_NUMBER: { position: [109, 123], description: "Número do documento" },
  DUE_DATE: { position: [78, 85], description: "Data de vencimento (ddmmaa)" },
  TITLE_VALUE: { position: [86, 100], description: "Valor do título (boleto)" },
  TITLE_SPECIES: { position: [107, 108], description: "Espécie do título (ex: duplicata)" },
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
  PAYER_NAME: { position: [34, 73], description: "Nome do pagador" },
  PAYER_ADDRESS: { position: [74, 113], description: "Endereço do pagador" },
  PAYER_NEIGHBORHOOD: { position: [114, 128], description: "Bairro do pagador" },
  PAYER_ZIP_CODE: { position: [129, 133], description: "CEP do pagador" },
  PAYER_CITY: { position: [137, 151], description: "Cidade do pagador" },
  PAYER_STATE: { position: [152, 153], description: "Estado (UF) do pagador" },
  PAYER_DOCUMENT_TYPE: { position: [18, 18], description: "Tipo de documento do pagador" },
  PAYER_CPF_CNPJ: { position: [19, 33], description: "CPF ou CNPJ do pagador" },
  GUARANTOR_NAME: { position: [176, 215], description: "Nome do sacador/avalista (se houver)" },
  GUARANTOR_CPF_CNPJ: { position: [216, 230], description: "CPF ou CNPJ do sacador/avalista" }
}

export function extractSegmentP(content, line) {
  const valueInCents = content.slice(SEGMENT_P.TITLE_VALUE.position[0] - 1, SEGMENT_P.TITLE_VALUE.position[1]).trim()
  const dueDate = content.slice(SEGMENT_P.DUE_DATE.position[0] - 1, SEGMENT_P.DUE_DATE.position[1]).trim()
  return {
    billing: {
      atLine: line,
      bank: content.slice(SEGMENT_P.BANK.position[0] - 1, SEGMENT_P.BANK.position[1]).trim(),
      lot: content.slice(SEGMENT_P.LOT.position[0] - 1, SEGMENT_P.LOT.position[1]).trim(),
      beneficiaryAgency: content.slice(SEGMENT_P.BENEFICIARY_AGENCY.position[0] - 1, SEGMENT_P.BENEFICIARY_AGENCY.position[1]).trim(),
      beneficiaryAgencyDigit: content.slice(SEGMENT_P.BENEFICIARY_AGENCY_DIGIT.position[0] - 1, SEGMENT_P.BENEFICIARY_AGENCY_DIGIT.position[1]).trim(),
      beneficiaryAccount: content.slice(SEGMENT_P.BENEFICIARY_ACCOUNT.position[0] - 1, SEGMENT_P.BENEFICIARY_ACCOUNT.position[1]).trim(),
      beneficiaryAccountDigit: content.slice(SEGMENT_P.ACCOUNT_DIGIT.position[0] - 1, SEGMENT_P.ACCOUNT_DIGIT.position[1]),
      ourNumber: content.slice(SEGMENT_P.OUR_NUMBER.position[0] - 1, SEGMENT_P.OUR_NUMBER.position[1]).trim(),
      dueDate: formatDateCNAB(dueDate),
      titleValue: Number(valueInCents) / 100
    }
  }
}

export function extractSegmentQ(content, line) {
  const documentType = content.slice(SEGMENT_Q.PAYER_DOCUMENT_TYPE.position[0] - 1, SEGMENT_Q.PAYER_DOCUMENT_TYPE.position[1]).trim()
  return {
    payer: {
      atLine: line,
      name: content.slice(SEGMENT_Q.PAYER_NAME.position[0] - 1, SEGMENT_Q.PAYER_NAME.position[1]).trim(),
      documentType: documentType === "1" ? "CPF" : "CNPJ",
      document: content.slice(SEGMENT_Q.PAYER_CPF_CNPJ.position[0] - 1, SEGMENT_Q.PAYER_CPF_CNPJ.position[1]).trim(),
      address: content.slice(SEGMENT_Q.PAYER_ADDRESS.position[0] - 1, SEGMENT_Q.PAYER_ADDRESS.position[1]).trim(),
      neighborhood: content.slice(SEGMENT_Q.PAYER_NEIGHBORHOOD.position[0] - 1, SEGMENT_Q.PAYER_NEIGHBORHOOD.position[1]).trim(),
      city: content.slice(SEGMENT_Q.PAYER_CITY.position[0] - 1, SEGMENT_Q.PAYER_CITY.position[1]).trim(),
      state: content.slice(SEGMENT_Q.PAYER_STATE.position[0] - 1, SEGMENT_Q.PAYER_STATE.position[1]).trim(),
      zipCode: content.slice(SEGMENT_Q.PAYER_ZIP_CODE.position[0] - 1, SEGMENT_Q.PAYER_ZIP_CODE.position[1]).trim()
    }
  }
}
