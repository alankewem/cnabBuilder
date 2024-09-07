'use strict';
import chalk from 'chalk'

export function messageBuilder(segment, segmentType, from, to, debtorName) {
  let logMessage = `\n----- CNAB segmento tipo ${segmentType} -----\n`;

  if (debtorName) {
    logMessage += `Nome do devedor: ${String(debtorName).toUpperCase()}`
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

  logMessage += `----- FIM ------`;

  return logMessage;
}