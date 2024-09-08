'use strict';
import path from 'path'
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url';
import yargs from 'yargs'
import { messageToSegmentArgumentOutput, messageToDebtorArgumentOutput } from "./messageBuilder.mjs"

const log = console.log

const optionsYargs = yargs(process.argv.slice(2))
  .usage('Uso: $0 [options]')
  .option("f", { alias: "from", describe: "posição inicial de pesquisa da linha do Cnab", type: "number", demandOption: false })
  .option("t", { alias: "to", describe: "posição final de pesquisa da linha do Cnab", type: "number", demandOption: false })
  .option("s", { alias: "segmento", describe: "tipo de segmento", type: "string", demandOption: false })
  .option("file", { alias: "arquivo", describe: "caminho do arquivo CNAB a ser lido", type: "string", demandOption: false })
  .option("d", { alias: "devedor", describe: "nome do devedor", type: "string", demandOption: false })
  .example('$0 -f 21 -t 34 -s p --file /path/cnab.rem')
  .example('$0 -d CAIXA ECONOMICA --file /path/cnab.rem')
  .argv;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = optionsYargs.file
  ? path.resolve(optionsYargs.file)
  : path.resolve(`${__dirname}/../cnabExample.rem`)

const { from, to, segmento: segment, devedor: debtor } = optionsYargs

function sliceArrayPosition(arr, ...positions) { return [...arr].slice(...positions) }

async function main() {
  try {
    const fileContent = await readFile(filePath, 'utf8')
    const cnabArray = fileContent.split("\n")
    const cnabHeader = sliceArrayPosition(cnabArray, 0, 2)
    const cnabTail = sliceArrayPosition(cnabArray, -2)
    const cnabBody = sliceArrayPosition(cnabArray, 2, -2)

    switch (true) {
      case !!segment:
        handleSegmentSearch(cnabBody)
        break;
      case !!debtor:
        handleDebtorSearch(cnabBody, debtor)
        break
      default:
        log('Por favor, forneça uma opção válida.');
        break;
    }
  } catch (error) {
    console.log(error)
  }
}

console.time('Tempo de execução')
await main()
console.timeEnd('Tempo de execução')

async function handleSegmentSearch(cnabBody) {
  const groupedSegments = groupSegmentByDebtorsNames(cnabBody)

  switch (String(segment).toLocaleLowerCase()) {
    case 'p':
      groupedSegments.forEach((segments, debtorName) => {
        segments.P.forEach(({ content }) => {
          log(messageToSegmentArgumentOutput(content, "P", from, to, debtorName));
        });
      });
      break;
    case 'q':
      groupedSegments.forEach((segments, debtorName) => {
        segments.Q.forEach(({ content }) => {
          log(messageToSegmentArgumentOutput(content, "Q", from, to, debtorName));
        });
      });
      break;
    case 'r':
      groupedSegments.forEach((segments, debtorName) => {
        segments.R.forEach(({ content }) => {
          log(messageToSegmentArgumentOutput(content, "R", from, to, debtorName));
        });
      });
      break;
    default:
      log('Segmento inválido. Utilize "p", "q" ou "r".');
  }
}

async function handleDebtorSearch(cnabBody, debtorName) {
  const groupedSegments = groupSegmentByDebtorsNames(cnabBody)
  const matchedBills = searchBillsByDebtorName(groupedSegments, debtorName);

  matchedBills.forEach(({ name, bill }) => {
    log(messageToDebtorArgumentOutput(name, bill))
  })
}

function searchBillsByDebtorName(groupedSegments, debtorName) {
  const matchedBills = [];

  for (const [debtor, segment] of groupedSegments.entries()) {
    const nameMatch = String(debtor).toLowerCase().includes(String(debtorName).toLowerCase());

    if (nameMatch) {
      segment.P.forEach((_, index) => {
        matchedBills.push({ name: debtor, bill: [segment.P[index], segment.Q[index], segment.R[index]] });
      });
    }
  }
  return matchedBills;
}

function groupSegmentByDebtorsNames(cnabArray) {
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
    segments.P.push({ content: segmentP, line: i + 3 });
    segments.Q.push({ content: segmentQ, line: i + 4 });
    segments.R.push({ content: segmentR, line: i + 5 });
  }

  return groupedBills
};