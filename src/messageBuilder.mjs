'use strict'

import chalk from 'chalk'

export function messageToSegmentArgumentOutput(segment, segmentType, from, to, payerName) {
  let logMessage = `\n----- CNAB segmento tipo ${segmentType} -----\n`;

  if (payerName) {
    logMessage += `Nome do devedor: ${String(payerName).toUpperCase()}`
  }

  if (from && to) {
    logMessage += `
posição from: ${chalk.inverse.bgBlack(from)}
posição to: ${chalk.inverse.bgBlack(to)}

item isolado: ${chalk.inverse.bgBlack(segment.substring(from - 1, to))}

item dentro da linha ${segmentType}: 
  ${segment.substring(0, from - 1)}${chalk.inverse.bgBlack(segment.substring(from - 1, to))}${segment.substring(to)}
`
  } else {
    logMessage += `
linha completa: ${chalk.inverse(segment)}`;
  }

  logMessage += `\n----- FIM ------`;

  return logMessage;
}

export function messageToPayerArgumentOutput(payerName, bills) {
  let logMessage = `\n----- Correspondências de ${payerName} -----\n`
  bills.forEach(({ line, content }) => {
    logMessage += `\n${chalk.bgGreen("linha:", line)} conteúdo: ${chalk.inverse(content)}\n`
  })
  logMessage += `----- FIM ------`

  return logMessage
}

export function messageToFileExportationOutput(filePath) {
  let logMessage = `\nArquivo gerado: ${chalk.green(filePath)}\n`
  logMessage += `----- FIM ------`

  return logMessage
}

export function messageToDefaultCNABFileOutput() {
  return `\n --- ${chalk.green("Lendo o arquivo CNAB default do projeto")} ---\n`
}