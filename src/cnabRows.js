'use strict';
import path from 'path'
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url';
import yargs from 'yargs'
import { messageBuilder } from "./messageBuilder.mjs"

const log = console.log

const optionsYargs = yargs(process.argv.slice(2))
  .usage('Uso: $0 [options]')
  .option("f", { alias: "from", describe: "posição inicial de pesquisa da linha do Cnab", type: "number", demandOption: false })
  .option("t", { alias: "to", describe: "posição final de pesquisa da linha do Cnab", type: "number", demandOption: false })
  .option("s", { alias: "segmento", describe: "tipo de segmento", type: "string", demandOption: true })
  .option("file", { alias: "arquivo", describe: "caminho do arquivo CNAB a ser lido", type: "string", demandOption: false })
  .example('$0 -f 21 -t 34 -s p --file /path/cnab.rem')
  .argv;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = optionsYargs.file
  ? path.resolve(optionsYargs.file)
  : path.resolve(`${__dirname}/../cnabExample.rem`)

const { from, to, segmento: segment } = optionsYargs

const sliceArrayPosition = (arr, ...positions) => [...arr].slice(...positions)

console.time('Tempo de execução')

readFile(filePath, 'utf8')
  .then(file => {
    const cnabArray = file.split('\n')

    // const cnabHeader = sliceArrayPosition(cnabArray, 0, 2)
    // const cnabTail = sliceArrayPosition(cnabArray, -2)
    const cnabBody = sliceArrayPosition(cnabArray, 2, -2);

    const groupedSegments = groupSegmentByDebtorName(cnabBody)

    switch (String(segment).toLocaleLowerCase()) {
      case 'p':
        groupedSegments.forEach((segments, debtorName) => {
          segments.P.forEach((segmentP) => {
            log(messageBuilder(segmentP, "P", from, to, debtorName))
          })
        })
        break
      case 'q':
        groupedSegments.forEach((segments, debtorName) => {
          segments.Q.forEach((segmentQ) => {
            log(messageBuilder(segmentQ, "Q", from, to, debtorName))
          })
        })
        break
      case 'r':
        groupedSegments.forEach((segments, debtorName) => {
          segments.R.forEach((segmentR) => {
            log(messageBuilder(segmentR, "R", from, to, debtorName))
          })
        })
        break
      default:
        log('Segmento inválido. Utilize "p", "q" ou "r".');
    }
  })
  .catch(error => {
    console.log(error)
  })

console.timeEnd('Tempo de execução')

function groupSegmentByDebtorName(cnabArray) {
  const groupedBills = new Map();

  // Processa as linhas do CNAB de 3 em 3 (cada conjunto P, Q, R)
  for (let i = 0; i < cnabArray.length; i += 3) {
    const segmentP = cnabArray[i];
    const segmentQ = cnabArray[i + 1];
    const segmentR = cnabArray[i + 2];

    const debtorName = segmentQ.substring(33, 73).trim();

    if (!groupedBills.has(debtorName)) {
      groupedBills.set(debtorName, { P: [], Q: [], R: [] });
    }

    const segments = groupedBills.get(debtorName);
    segments.P.push(segmentP);
    segments.Q.push(segmentQ);
    segments.R.push(segmentR);
  }

  return groupedBills
};