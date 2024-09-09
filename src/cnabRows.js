'use strict'

import path from 'path'
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url';
import yargs from 'yargs'
import { sliceArrayPosition } from "./utils.mjs"
import { handlePayerSearch, handleSegmentSearch, handleExportation } from "./handlers.mjs"
import { messageToDefaultCNABFileOutput } from "./messageBuilder.mjs"

const optionsYargs = yargs(process.argv.slice(2))
  .usage('Uso: $0 [options]')
  .option("f", { alias: "from", describe: "posição inicial de pesquisa da linha do Cnab", type: "number", demandOption: false })
  .option("t", { alias: "to", describe: "posição final de pesquisa da linha do Cnab", type: "number", demandOption: false })
  .option("s", { alias: "segmento", describe: "tipo de segmento", type: "string", demandOption: false })
  .option("file", { alias: "arquivo", describe: "caminho do arquivo CNAB a ser lido", type: "string", demandOption: false })
  .option("d", { alias: "devedor", describe: "nome do devedor", type: "string", demandOption: false })
  .option("export", { alias: "exportação", describe: "irá coletar as principais informações do arquivo CNAB e exportar para um novo arquivo com extensão .json" })
  .example('$0 -f 21 -t 34 -s p --file /path/cnab.rem')
  .example('$0 -d CAIXA ECONOMICA --file /path/cnab.rem')
  .example('$0 --export')
  .argv;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let filePath
if (optionsYargs.file) {
  filePath = path.resolve(optionsYargs.file)
} else {
  filePath = path.resolve(`${__dirname}/../cnabExample.rem`)
  console.log(messageToDefaultCNABFileOutput())
}

const { from, to, segmento: segment, devedor: payer, export: exportation } = optionsYargs

async function main() {
  try {
    const fileContent = await readFile(filePath, 'utf8')
    const cnabArray = fileContent.split("\n")
    const cnabBody = sliceArrayPosition(cnabArray, 2, -2)

    switch (true) {
      case !!segment:
        handleSegmentSearch(cnabBody, segment, from, to)
        break;
      case !!payer:
        handlePayerSearch(cnabBody, payer)
        break
      case !!exportation:
        handleExportation(cnabBody)
        break
      default:
        yargs().showHelp()
        break;
    }
  } catch (error) {
    console.log(error)
  }
}

console.time('Tempo de execução')
await main()
console.timeEnd('Tempo de execução')